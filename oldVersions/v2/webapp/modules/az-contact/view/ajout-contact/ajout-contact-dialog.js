/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          ajout-contact-dialog.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./ajout-contact-dialog.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/contact-manager',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, contactManager
	, az
) {

	var log = new az.Log("AjoutContactDialog");
	var AjoutContactDialog = Backbone.View.extend({
		id: "azAjoutContact",
		className: "az-ajout-contact-dialog modal fade",

		initialize: function() {
			log.debug("initialize");
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n, id: this.id });
			this.$el.html(tpl);
			this.onFamilleExistanteInputChanged();
			this.setFamilles();

			// Create Civilites select
			az.configuration.get("civilites").each(function(v) {
				$(".contact_civilite_part select", this.el).append($("<option>", {value: v.get("ID_CIVILITE"), text: v.get("ABREVIATION_CIVILITE")}).text(v.get("ABREVIATION_CIVILITE")));
			}, this);

			this.createValidators();

			return this;
		},


		setFamilles: function() {
			$(".famille_part select", this.el).append($("<option>", {value: 0, text: "--"}).text("--"));
			contactManager.getFamilles(true).then(
				_.bind(function(familles) {
					familles.each(function(f) {
						$(".famille_part select", this.el).append($("<option>", {value: f.get("ID_FAMILLE"), text: f.get("NOM_FAMILLE")}).text(f.get("NOM_FAMILLE")));
					}, this);
				}, this)
			);
		},

		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			log.debug("remove");
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		onFamilleExistanteInputChanged: function() {
			if (!$(".famille_existante_part input", this.el).is(":checked")) {
				$(".ajout_famille_part", this.el).show();
				$(".famille_part", this.el).hide();
			} else {
				$(".ajout_famille_part", this.el).hide();
				$(".famille_part", this.el).show();
			}
		},

		createValidators: function() {
			try {
				if (this.bootstrapValidator)
					this.bootstrapValidator.destroy();
			} catch (e) {

			}
			// Create validator
			$(".contact_table", this.el).bootstrapValidator({
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		            nom: {
						validators: {
							notEmpty: {message: i18n.ajout_contact_requis_tooltip}
						}
					},
					prenom: {
						validators: {
							notEmpty: {message: i18n.ajout_contact_requis_tooltip}
						}
					},
					date: {
						validators: {
							notEmpty: {message: i18n.ajout_contact_requis_tooltip},
							date: {
								format: 'DD/MM/YYYY',
								message: i18n.ajout_contact_date_erreur_tooltip
							}
						}
					}
		        }
		    });
			this.bootstrapValidator = $(".contact_table", this.el).data('bootstrapValidator');
		},

		events: {
			"change .famille_existante_part input": "onFamilleExistanteInputChanged",
			'change .famille_part': 'onFamilleChange',
			"click .submit": "onSubmitCliked",
			"input .ajout_famille_part input": 'onNomFamilleChange'
		},

		onNomFamilleChange: function() {
			$(".contact_nom_part input", this.el).val($(".ajout_famille_part input", this.el).val());
		},

		onFamilleChange: function() {
			$(".contact_nom_part input", this.el).val($(".famille_part select", this.el).text());
		},

		onSubmitCliked:function() {
			if (this.bootstrapValidator) {
				this.bootstrapValidator.validate();
			}

			var nom = $(".contact_nom_part input", this.el).val();
			var prenom = $(".contact_prenom_part input", this.el).val();
			var naissanceTab = $(".contact_naissance_part input", this.el).val().split("/");
			var naissance = naissanceTab[2]+"-"+naissanceTab[1]+"-"+naissanceTab[0];
			var civilite = parseInt($(".contact_civilite_part select", this.el).val());
			if (this.bootstrapValidator.isValid()) {
				$(this.el).addClass("loading");
				var idFamille = parseInt($(".famille_part select", this.el).val());
				if (!$(".famille_existante_part input", this.el).is(":checked") || !idFamille) {
					contactManager.createFamille($(".ajout_famille_part input", this.el).val()).then(_.bind(function(data) {
						data = JSON.parse(data);
						if (data.idFamille) {
							if ($(".contact_type_part .adulte", this.el).is(":checked"))
								this.createAdulte(data.idFamille, nom, prenom, naissance, civilite);
							else 
								this.createEnfant(data.idFamille, nom, prenom, naissance, civilite);
						}
					}, this));
				} else {
					if ($(".contact_type_part .adulte", this.el).is(":checked"))
						this.createAdulte(idFamille, nom, prenom, naissance, civilite);
					else 
						this.createEnfant(idFamille, nom, prenom, naissance, civilite);
				}
			}
		},

		createEnfant: function(idFamille, nom, prenom, naissance, civilite) {
			contactManager.createEnfant(idFamille, nom, prenom, naissance, civilite).then(
				_.bind(function(data) {
					this.trigger("saved", (JSON.parse(data)).idMembre);
				}, this),
				_.bind(function() {
					$(this.el).removeClass("loading");
				}, this)
			);
		},

		createAdulte: function(idFamille, nom, prenom, naissance, civilite) {
			contactManager.createAdulte(idFamille, nom, prenom, naissance, civilite).then(
				_.bind(function(data) {
					this.trigger("saved", (JSON.parse(data)).idMembre);
				}, this),
				_.bind(function() {
					$(this.el).removeClass("loading");
				}, this)
			);
		}
	});

	return AjoutContactDialog;
});

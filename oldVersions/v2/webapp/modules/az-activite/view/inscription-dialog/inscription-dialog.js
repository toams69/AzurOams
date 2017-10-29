/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          inscription-dialog.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./inscription-dialog.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/activite-manager',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, activiteManager
	, az
) {

	var log = new az.Log("InscriptionDialog");
	var InscriptionDialog = Backbone.View.extend({

		tagName: "div",
        className: "az-inscription-activite modal fade",
        id: "azInscriptionActiviteDialog",

		initialize: function(options) {
			this.options = options;
			log.debug("initialize");
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n, id: this.id });
			this.$el.html(tpl);

			if (this.options) {
				this.setContact(this.options.contact);
				this.setAnnee(this.options.annee);
			}


			$(".ristourne_part select", this.el).append($("<option>", {value: 0, text: i18n.inscription_ristourne_aucune_label}).text(i18n.inscription_ristourne_aucune_label));
			az.configuration.get("ristournes").each(function(t) {
				$(".ristourne_part select", this.el).append($("<option>", {value: t.get("ID_RISTOURNE"), text: t.get("MOTIF_RISTOURNE")}).text(t.get("MOTIF_RISTOURNE")));
			}, this);

			activiteManager.getActivites(true).then(_.bind(function() {
				this.setActivites();
			}, this));
			this.createValidators();
			
			return this;
		},

		setActivites: function() {
			activiteManager.get("activiteList").each(function(t) {
				var find =  this.contact.get("activites").find(_.bind(function(a) {
					return a.get("ID_ACTIVITE") === t.get("ID_ACTIVITE") && t.get("ID_ANNEE") === this.annee.get("ID_ANNEE");
				}, this));
				if (t.get("ID_ANNEE") === this.annee.get("ID_ANNEE") && !find)
					$(".activite_part select", this.el).append($("<option>", {value: t.get("ID_ACTIVITE"), text: t.get("NOM_ACTIVITE")}).text(t.get("NOM_ACTIVITE")));
			}, this);

			this.setTarif();
		},

		setTarif: function() {
			var currentActivite = activiteManager.get("activiteList").find(_.bind(function(a) { return a.get("ID_ACTIVITE")+"" === $(".activite_part select", this.el).val(); }, this));
			var currentRistourne = az.configuration.get("ristournes").find(_.bind(function(t) { return t.get("ID_RISTOURNE")+"" === $(".ristourne_part select", this.el).val(); }, this));
			if (currentRistourne) {
				currentRistourne = currentRistourne.get("PRCT_RISTOURNE");
			} else {
				currentRistourne = 0;
			}
			$(".montant_part .value input", this.el).val(currentActivite.get("PRIX"));
			var normalPrice = currentActivite.get("PRIX") + currentActivite.get("PRIX_FOURNITURE");
			var finalPrice = normalPrice - (normalPrice * currentRistourne / 100);
			$(".montant_fourniture_part .value input", this.el).val(currentActivite.get("PRIX_FOURNITURE") ? currentActivite.get("PRIX_FOURNITURE") : 0);
			$(".total_reglement_part .value input", this.el).val(finalPrice);
		},

		recalculate: function() {
			var currentRistourne = az.configuration.get("ristournes").find(_.bind(function(t) { return t.get("ID_RISTOURNE")+"" === $(".ristourne_part select", this.el).val(); }, this));
			if (currentRistourne) {
				currentRistourne = currentRistourne.get("PRCT_RISTOURNE");
			} else {
				currentRistourne = 0;
			}
			var normalPrice = parseFloat($(".montant_part .value input", this.el).val()) + parseFloat($(".montant_fourniture_part .value input", this.el).val());
			var finalPrice = normalPrice - (normalPrice * currentRistourne / 100);
			$(".total_reglement_part .value input", this.el).val(finalPrice);
		},

		createValidators: function() {
			try {
				if (this.bootstrapValidator)
					this.bootstrapValidator.destroy();
			} catch (e) {

			}
			// Create validator
			$(".activite_table", this.el).bootstrapValidator({
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		            montant: {
						validators: {
							numeric: {message: i18n.inscription_montant_erreur_tooltip},
							notEmpty: {message: i18n.inscription_montant_vide_tooltip}
						}
					},
					 montantF: {
						validators: {
							numeric: {message: i18n.inscription_montant_erreur_tooltip},
							notEmpty: {message: i18n.inscription_montant_vide_tooltip}
						}
					},
					 montantT: {
						validators: {
							numeric: {message: i18n.inscription_montant_erreur_tooltip},
							notEmpty: {message: i18n.inscription_montant_vide_tooltip}
						}
					}
		        }
		    });
			this.bootstrapValidator = $(".activite_table", this.el).data('bootstrapValidator');
		},

		setContact: function(contact) {
			this.contact = contact;
			if (!contact)
				return;
			if (contact.get("ID_ENFANT"))
				$(".contact_part .value", this.el).text(contact.get("NOM_ENFANT")+" "+contact.get("PRENOM_ENFANT"));
			else
				$(".contact_part .value", this.el).text(contact.get("NOM_MEMBRE")+" "+contact.get("PRENOM_MEMBRE"));
			
		},

		setAnnee: function(annee) {
			this.annee = annee;
			if (!annee)
				return;
			var text = (new Date(annee.get("DATE_DEBUT")).getUTCFullYear()) + " - " + (new Date(annee.get("DATE_FIN")).getUTCFullYear());
			$(".annee_part .value", this.el).text(text);
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

		events: {
			"click .submit": "onSubmitCliked",
			"change .activite_part select": "setTarif",
			"change .ristourne_part select": "recalculate",
			"input .montant_fourniture_part .value input, .montant_part .value input": "recalculate"
		},


		onSubmitCliked:function() {
			if (this.bootstrapValidator) {
				this.bootstrapValidator.validate();
			}
			if (this.bootstrapValidator.isValid()) {
				$(this.el).addClass("loading");
				var activite = activiteManager.get("activiteList").find(_.bind(function(a) { return a.get("ID_ACTIVITE")+"" === $(".activite_part select", this.el).val(); }, this));
				var montantF = parseFloat($(".montant_fourniture_part .value input", this.el).val());
				var montantA = parseFloat($(".montant_part .value input", this.el).val());
				var montantT = parseFloat($(".total_reglement_part .value input", this.el).val());
				var ristourne = az.configuration.get("ristournes").find(_.bind(function(t) { return t.get("ID_RISTOURNE")+"" === $(".ristourne_part select", this.el).val(); }, this));
			
				if (activite) {
					activiteManager.inscriptionActivite(activite, montantT, this.contact, this.annee, montantF, montantA, ristourne).then(
						_.bind(function() {
							this.trigger("saved");
						}, this),
						_.bind(function() {
							$(this.el).removeClass("loading");
						}, this)
					);
				} else {
					$(this.el).removeClass("loading");
				}
			}
		}
	});

	return InscriptionDialog;
});

/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          add-reglement-dialog.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./add-reglement-dialog.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/facture-manager',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, factureManager
	, az
) {

	var log = new az.Log("AddReglementDialog");
	var AddReglementDialog = Backbone.View.extend({

		tagName: "div",
        className: "az-add-reglement modal fade",
        id: "azAddReglementDialog",

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
				this.setFacture(this.options.facture);
			}

			az.configuration.get("typesReglement").each(function(t) {
				$(".type_reglement_part select", this.el).append($("<option>", {value: t.get("ID_TYPE_REGLEMENT"), text: t.get("NOM_TYPE_REGLEMENT")}).text(t.get("NOM_TYPE_REGLEMENT")));
			}, this);

			az.configuration.get("banques").each(function(b) {
				$(".banque_part select", this.el).append($("<option>", {value: b.get("ID_BANQUE"), text: b.get("NOM_BANQUE")}).text(b.get("NOM_BANQUE")));
			}, this);

			$(".banque_part, .numero_cheque_reglement_part", this.el).hide();
			this.createValidators();
			
			return this;
		},

		createValidators: function() {
			try {
				if (this.bootstrapValidator)
					this.bootstrapValidator.destroy();
			} catch (e) {

			}
			// Create validator
			$(".reglement_table", this.el).bootstrapValidator({
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		            montant: {
						validators: {
							numeric: {message: i18n.ajout_reglement_montant_erreur_tooltip},
							notEmpty: {message: i18n.ajout_reglement_montant_requis_tooltip}
						}
					},
					date: {
						validators: {
							notEmpty: {message: i18n.contact_information_champ_requis_tooltip},
							date: {
								format: 'DD/MM/YYYY',
								message: i18n.ajout_reglement_date_erreur_tooltip
							}
						}
					}
		        }
		    });
			this.bootstrapValidator = $(".reglement_table", this.el).data('bootstrapValidator');
		},

		setContact: function(contact) {
			this.contact = contact;
			
		},

		setFacture: function(facture) {
			this.facture = facture;
			$(".facture_part .value", this.el).text(this.facture.get("ID_FACTURE"));
			$(".famille_part .value", this.el).text(this.facture.get("NOM_MEMBRE") + " " + this.facture.get("PRENOM_MEMBRE"));
			$(".montant_part .value", this.el).text(this.facture.get("MONTANT_RESTANT") +" €");

			$(".code_ana_part input", this.el).val(this.facture.get("objet")["CODE_ANA"]);

			$(".date_reglement_part input", this.el).val(az.Utils.dateFormat(new Date(), "dd/mm/yyyy"));

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
			"change .type_reglement_part select": "onTypeReglementChanged"
		},

		onTypeReglementChanged: function() {
			if ($(".type_reglement_part select", this.el).val() === "2" || $(".type_reglement_part select", this.el).val() === "3") {
				$(".banque_part, .numero_cheque_reglement_part", this.el).show();
			} else {
				$(".banque_part, .numero_cheque_reglement_part", this.el).hide();
			}
		},


		onSubmitCliked:function() {
			if (this.bootstrapValidator) {
				this.bootstrapValidator.validate();
			}
			if (this.bootstrapValidator.isValid()) {
				var reglement = {montant: $(".montant_reglement_part input", this.el).val(), date: $(".date_reglement_part input", this.el).val(), type: parseInt($(".type_reglement_part select", this.el).val())};
				reglement.commentaire = $(".commentaire_reglement", this.el).val();
				reglement.codeAna = $(".code_ana_part input", this.el).val();
				if ($(".type_reglement_part select", this.el).val() === "2" || $(".type_reglement_part select", this.el).val() === "3") {
					reglement.numeroCheque = $(".numero_cheque_reglement_part input", this.el).val();
					reglement.banque = parseInt($(".banque_part select", this.el).val());
				}
				$(this.el).addClass("loading");
				factureManager.ajoutReglement(this.facture.get("ID_FACTURE"), reglement).then(
					_.bind(function() {
						this.trigger("saved");
					}, this),
					_.bind(function() {
						$(this.el).removeClass("loading");
					}, this)
				);
			}
		}
	});

	return AddReglementDialog;
});

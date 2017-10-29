/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-famille.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'../../model/contact',
	'text!./contact-famille.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/contact-manager',
	'az'
], function(
	$, _, Backbone,
	Contact
	, template
	, i18n
	, contactManager
	, az
) {

	var log = new az.Log("ContactFamilleView");
	var ContactFamilleView = Backbone.View.extend({
		id: "azContactFamille",
		className: "az-contact-information",

		initialize: function() {
			log.debug("initialize");
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n, id: this.id });
			this.$el.html(tpl);
			$(".az-contact-information-famille", this.el).hide();

			az.configuration.get("quartiers").each(function(q) {
				$(".az-contact-famille-quartier select", this.el).append($("<option>", {value: q.get("ID_QUARTIER"), text: q.get("NOM_QUARTIER")}).text(q.get("NOM_QUARTIER")));
			}, this);

			return this;
		},

		setContact: function(contact) {
			$(this.el).removeClass("loading");
			$(".az-contact-information-famille", this.el).hide();
			$(".az-contact-information-empty-contact", this.el).hide();
			$(".reset-contact", this.el).prop("disabled", true);
			$(".save-contact", this.el).prop("disabled", true);

			if (contact) {
				contactManager.getFamille(contact.get("ID_FAMILLE")).then(_.bind(function(famille) {
					this.setFamille(famille);
				}, this));
			} else {
				$(".az-contact-information-empty-contact", this.el).show();
			}
			//this.createValidators();	
		},

		setFamille: function(famille) {
			this.currentFamille = famille;
			$(".az-contact-information-famille", this.el).show();
			$(".az-contact-information-famille .az-contact-famille-nom input", this.el).val(famille.get("NOM_FAMILLE"));
			$(".az-contact-information-famille .az-contact-famille-caf input", this.el).val(famille.get("NUMERO_CAF"));
			$(".az-contact-information-famille .az-contact-famille-caf-quotient input", this.el).val(famille.get("QUOTIENT_CAF_FAMILLE"));
			$(".az-contact-information-famille .az-contact-famille-msa input", this.el).val(famille.get("NUMERO_MSA"));
			$(".az-contact-information-famille .az-contact-famille-msa-quotient input", this.el).val(famille.get("QUOTIENT_MSA_FAMILLE"));
			$(".az-contact-information-famille .az-contact-famille-avoir input", this.el).val(famille.get("AVOIR_FAMILLE"));
			$(".az-contact-famille-quartier select", this.el).val(famille.get("ID_QUARTIER"));
			$(".az-contact-famille-date-inscription span", this.el).text(az.Utils.dateFormat(new Date(famille.get("INSCRIPTION_FAMILLE")), i18n.famille_date_inscription_format ));

			$(".contact-list", this.el).empty();
			famille.get("membres").each(function(m) {
				$(".contact-list", this.el).append($("<li>").text(m.get("NOM_MEMBRE") + " " + m.get("PRENOM_MEMBRE")));
			}, this);
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
			"click .az-contact-information-toolbar .reset-contact": "onResetClicked",
			"click .az-contact-information-toolbar .save-contact": "onSaveCliked",
			"input .az-contact-information-famille input": "onInformationChanged",
			"change .az-contact-famille-quartier select": "onInformationChanged"
		},

		onInformationChanged:function() {
			$(".reset-contact", this.el).prop("disabled", false);
			$(".save-contact", this.el).prop("disabled", false);
		},

		onResetClicked: function() {
			this.setContact(this.currentFamille);
		},

		onSaveCliked:function() {
			var newFamille = new Backbone.Model(this.currentFamille.attributes);
			newFamille.set("NOM_FAMILLE", $(".az-contact-information-famille .az-contact-famille-nom input", this.el).val());

			newFamille.set("NUMERO_CAF", $(".az-contact-information-famille .az-contact-famille-caf input", this.el).val());
			newFamille.set("QUOTIENT_CAF_FAMILLE", $(".az-contact-information-famille .az-contact-famille-caf-quotient input", this.el).val());
			newFamille.set("NUMERO_MSA", $(".az-contact-information-famille .az-contact-famille-msa input", this.el).val());
			newFamille.set("QUOTIENT_MSA_FAMILLE", $(".az-contact-information-famille .az-contact-famille-msa-quotient input", this.el).val());
			newFamille.set("AVOIR_FAMILLE", $(".az-contact-information-famille .az-contact-famille-avoir input", this.el).val());
			newFamille.set("ID_QUARTIER", $(".az-contact-famille-quartier select", this.el).val());

			// save the contact
			contactManager.saveFamille(newFamille).then(_.bind(function() {
				this.displayInfoMessage("success",i18n.contact_updated);
				this.setFamille(newFamille);
			}, this));
			
		},

		displayInfoMessage: function(type, message) {
			$(this.el).addClass("alert-displayed");
			switch(type) {
				case 'success':
					$(".alert-container", this.el).empty().append($("<div></div>").addClass("alert alert-success").attr("role", "alert").text(message));
				break;
				case 'error':
					$(".alert-container", this.el).empty().append($("<div></div>").addClass("alert alert-danger").attr("role", "alert").text(message));
				break;
			}
			setTimeout(_.bind(function() {
				$(".alert-container", this.el).empty();
				$(this.el).removeClass("alert-displayed");
			}, this), az.configuration.get("alert-timeout"));
		}
	});

	return ContactFamilleView;
});

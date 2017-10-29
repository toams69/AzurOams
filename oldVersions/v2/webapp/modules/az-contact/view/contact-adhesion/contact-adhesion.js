/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-adhesion.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'../../model/contact',
	'text!./contact-adhesion.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/contact-manager',
	'az'
], function(
	$, _, Backbone
	, Contact
	, template
	, i18n
	, contactManager
	, az
) {

	var log = new az.Log("AdhesionView");
	var AdhesionView = Backbone.View.extend({

		tagName: "div",
        className: "az-contact-adhesion modal fade",
        id: "azAdhesionDialog",

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
			return this;
		},

		setContact: function(contact) {
			this.contact = contact;
			if (this.contact.get("type") === Contact.Type.ADULTE) {
				$(".adhesion_nom_part .value", this.el).text(this.contact.get("NOM_MEMBRE"));
				$(".adhesion_prenom_part .value", this.el).text(this.contact.get("PRENOM_MEMBRE"));
			} else {
				$(".adhesion_nom_part .value", this.el).text(this.contact.get("NOM_ENFANT"));
				$(".adhesion_prenom_part .value", this.el).text(this.contact.get("PRENOM_ENFANT"));
			}
		},

		setAnnee: function(annee) {
			this.annee = annee;
			var text = (new Date(this.annee.get("DATE_DEBUT")).getUTCFullYear()) + " - " + (new Date(this.annee.get("DATE_FIN")).getUTCFullYear());
			$(".adhesion_annee_part .value", this.el).text(text);

			$(".adhesion_tarif_part select", this.el).empty();
			this.annee.get("tarifs").each(function(t) {
				$(".adhesion_tarif_part select", this.el).append($("<option>", {value: t.get("ID_PRIX"), title: t.get("DESCRIPTION")}).text(t.get("DESCRIPTION")));
			}, this);

			$(".adhesion_montant_part .value", this.el).text(this.annee.get("tarifs").at(0).get("MONTANT")+ " "+i18n.adhesion_dialog_montant_devise);
			this.tarif = this.annee.get("tarifs").at(0);
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
			"change .adhesion_tarif_part select": "onTarifChanged",
			"click .submit": "onSubmitCliked"
		},

		onTarifChanged: function() {
			this.tarif = this.annee.get("tarifs").find(_.bind(function(t) {return t.get("ID_PRIX") === parseInt($(".adhesion_tarif_part select", this.el).val());}, this));
			$(".adhesion_montant_part .value", this.el).text(this.tarif.get("MONTANT")+ " "+i18n.adhesion_dialog_montant_devise);
		},

		onSubmitCliked:function() {
			if (isNaN(parseInt($(".adhesion_number_part input", this.el).val()))) {

			} else {
				contactManager.createAdhesion(this.contact, this.tarif.get("MONTANT"), this.annee, parseInt($(".adhesion_number_part input", this.el).val())).then(_.bind(function() {
					this.trigger("saved");
				}, this));
			}
		}
	});

	return AdhesionView;
});

/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          page-facture.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./page-facture.tpl.html',
	'i18n!../../nls/strings',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, az
) {

	var log = new az.Log("PageFactureView");
	var PageFactureView = Backbone.View.extend({
		id: "azPageFacture",
		className: "az-page-facture",

		initialize: function(options) {
			log.debug("initialize");
			if (options.facture) {
				this.facture = options.facture;
			}
			if (options.contact) {
				this.contact = options.contact;
			}
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			if (this.facture)
				this.setFacture(this.facture);
			return this;
		},

		setFacture: function(facture) {
			var contactTxt = "";
			contactTxt += facture.get("ABREVIATION_CIVILITE") + " " +facture.get("NOM_MEMBRE").toUpperCase()+ " "+ facture.get("PRENOM_MEMBRE");
			contactTxt += "\n" +facture.get("ADR_MEMBRE");
			contactTxt += "\n" +facture.get("CP_VILLE") + " " + facture.get("NOM_VILLE");
			$(".contact-container", this.el).text(contactTxt);

			$(".date-facture", this.el).text(az.Utils.dateFormat(facture.get("DATE_FACTURE"), "dd mmmm yyyy"));
			$(".facture-number", this.el).text(az.Utils.dateFormat(facture.get("DATE_FACTURE"), "yyyymm")+" "+facture.get("ID_FACTURE"));

			var annee = az.configuration.get("annees").find(function(a) {
				return a.get("ID_ANNEE") === facture.get("objet")["ID_ANNEE"];
			});
			if (annee) {
				var text = (new Date(annee.get("DATE_DEBUT")).getUTCFullYear()) + " - " + (new Date(annee.get("DATE_FIN")).getUTCFullYear());
				$(".annee", this.el).text(text);
			}
			var objet = "";

			
			if (this.contact && this.contact.get("ID_ENFANT")) {
				objet += this.contact.get("NOM_ENFANT") +" "+ this.contact.get("PRENOM_ENFANT") + "\n";
			} else if (this.contact) {
				objet += this.contact.get("NOM_MEMBRE") +" "+ this.contact.get("PRENOM_MEMBRE") + "\n";
			}
			objet += facture.get("objet")["NOM_ACTIVITE"];
			$(".objet", this.el).text(objet);
			$(".details", this.el).text(facture.get("MOTIF_FACTURE"));
			$(".montantT", this.el).text(facture.get("MONTANT_FACTURE") + "€");
			$(".reste", this.el).text(facture.get("MONTANT_RESTANT")+ "€");
			$(".montantR", this.el).text(facture.get("MONTANT_FACTURE") - facture.get("MONTANT_RESTANT") + "€");
		},

		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			
		},

		events: {
		
		}
	});

	return PageFactureView;
});

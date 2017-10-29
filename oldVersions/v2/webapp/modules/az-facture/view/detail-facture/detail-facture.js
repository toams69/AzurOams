/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          detail-facture.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./detail-facture.tpl.html',
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

	var log = new az.Log("DetailFactureView");
	var DetailFactureView = Backbone.View.extend({
		id: "azSample",
		className: "az-detail-facture",

		initialize: function() {
			log.debug("initialize");
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			$(".az-facture-information-part", this.el).hide();
			$(".az-facture-empty-facture", this.el).show();
			return this;
		},

		loading: function() {
			log.debug("loading");
			$(this.el).addClass("loading");
			$(".az-facture-information-part", this.el).hide();
			$(".az-facture-empty-facture", this.el).hide();
		},

		setFacture: function(facture) {
			$(this.el).removeClass("loading");
			log.debug("setFacture");
			this.facture = facture;
			if (this.facture) {
				$(".az-facture-information-part", this.el).show();
				$(".az-facture-empty-facture", this.el).hide();
				$(".adresse_part .value", this.el).text(this.facture.get("NOM_MEMBRE") + " " + this.facture.get("PRENOM_MEMBRE"));
				$(".date_part .value", this.el).text(az.Utils.dateFormat(new Date(this.facture.get("DATE_FACTURE")), "dd/mm/yyyy"));
				$(".objet_part .value", this.el).text(this.facture.get("NOM_TYPE_FACTURE"));
				$(".montant_part .value", this.el).text(this.facture.get("MONTANT_FACTURE") + " € ("+this.facture.get("MONTANT_RESTANT") +" €)");
				$(".motif_part", this.el).html(this.facture.get("MOTIF_FACTURE").replace(/\n/g, "<br/>"));

			} else {
				$(".az-facture-information-part", this.el).hide();
				$(".az-facture-empty-facture", this.el).show();

			}
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
		
		}
	});

	return DetailFactureView;
});

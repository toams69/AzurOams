/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          controller.js
 */

define([
	'underscore', 'backbone', './az-facture', 'i18n!./nls/strings', './view/contact-facture/contact-facture' , './view/detail-facture/detail-facture',  './view/reglement-facture/reglement-facture'
], function(
	_, Backbone, az, i18n, ContactFactureView, DetailFactureView, ReglementFactureView
) {


	var log = new az.Log("FactureController");
	
	/**
	 * This class represents the core application.
	 * @constructor
	 */
	var FactureController = Backbone.Router.extend({

		/**
		 * Initializes the FactureController.
		 * @return {FactureController} Itself.
		 */
		initialize:function() {
			this.registerSubview();
			return this;
		},

		registerSubview: function() {
			log.debug("registerSubview");
			az.viewManager.add("ContactPanel", [{
				name: "ContactInformation",
				view: ContactFactureView,
				title: i18n.contact_panel_facture_title,
				icon: "fa-users",
				order: 5
			}]);

			az.viewManager.add("ContactFacturePanel", [{
				name: "DetailFacture",
				view: DetailFactureView,
				title: i18n.detail_panel_facture_title,
				icon: "fa-users",
				order: 1
			}]);

			az.viewManager.add("ContactFacturePanel", [{
				name: "ReglementFacture",
				view: ReglementFactureView,
				title: i18n.reglement_panel_facture_title,
				icon: "fa-users",
				order: 2
			}]);
			
		}
	});

	return FactureController;
});

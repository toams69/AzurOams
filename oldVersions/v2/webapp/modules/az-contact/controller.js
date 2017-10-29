/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          controller.js
 */

define([
	'underscore', 'backbone', './az-contact', 'i18n!./nls/strings',
	'./view/contact-desktop/contact-desktop',
	'./view/contact-information/contact-information',
	'./view/contact-famille/contact-famille',
	'./view/contact-activite/contact-activite'
], function(
	_, Backbone, az, i18n, ContactDesktopView, ContactInformationView, ContactFamilleView, ContactActiviteView
) {

	
	/**
	 * This class represents the core application.
	 * @constructor
	 */
	var ContactController = Backbone.Router.extend({

		/**
		 * Initializes the ContactController.
		 * @return {ContactController} Itself.
		 */
		initialize:function() {
			console.debug('[ContactController] Initializing app');
			
			this.registerSubview();
			return this;
		},

		registerSubview: function() {
			console.debug('[ContactController] Register view');
			az.viewManager.add("DesktopRegion", [{
				name: "ContactManagment",
				view: ContactDesktopView,
				title: i18n.contact_managment_title_label,
				icon: "fa-users",
				order: 5
			}]);

			az.viewManager.add("ContactPanel", [{
				name: "ContactInformation",
				view: ContactInformationView,
				title: i18n.contact_panel_information_title,
				icon: "fa-users",
				order: 1
			}]);
			az.viewManager.add("ContactPanel", [{
				name: "ContactFamille",
				view: ContactFamilleView,
				title: i18n.contact_panel_famille_title,
				icon: "fa-users",
				order: 2
			}]);
			az.viewManager.add("ContactPanel", [{
				name: "ContactActivite",
				view: ContactActiviteView,
				title: i18n.contact_panel_activite_title,
				icon: "fa-users",
				order: 3
			}]);
			
		}
	});

	return ContactController;
});

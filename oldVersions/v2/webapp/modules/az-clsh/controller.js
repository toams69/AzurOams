/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          controller.js
 */

define([
	'underscore', 'backbone', './az-clsh', 'i18n!./nls/strings',
	'./view/clsh-desktop/clsh-desktop',
	'./view/clsh-information/clsh-information',
	'./view/clsh-inscription/clsh-inscription',
	'./view/clsh-presence/clsh-presence'
], function(
	_, Backbone, az, i18n, CLSHDesktopView, CLSHInformationView, CLSHInscriptionView, CLSHPresenceView
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
				name: "CLSHDesktopView",
				view: CLSHDesktopView,
				title: i18n.clsh_managment_title_label,
				icon: "fa-paint-brush",
				order: 2
			}]);
			
			//CLSHInformationView
			az.viewManager.add("CLSHPanel", [{
				name: "CLSHInformationView",
				view: CLSHInformationView,
				title: i18n.clsh_information_title_label,
				icon: "fa-paint-brush",
				order: 1
			}]);
			az.viewManager.add("CLSHPanel", [{
				name: "CLSHInscriptionView",
				view: CLSHInscriptionView,
				title: i18n.clsh_inscription_title_label,
				icon: "fa-paint-brush",
				order: 2
			}]);
			az.viewManager.add("CLSHPanel", [{
				name: "CLSHPresenceView",
				view: CLSHPresenceView,
				title: i18n.clsh_presence_title_label,
				icon: "fa-paint-brush",
				order: 3
			}]);
		}
	});

	return ContactController;
});

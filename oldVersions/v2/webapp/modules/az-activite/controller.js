/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          controller.js
 */

define([
	'underscore', 'backbone', './az-activite', 'i18n!./nls/strings',
	'./view/activite-desktop/activite-desktop'
], function(
	_, Backbone, az, i18n, ActiviteDesktopView
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
				name: "ActiviteManagment",
				view: ActiviteDesktopView,
				title: i18n.activite_managment_title_label,
				icon: "fa-cubes",
				order: 3
			}]);
			
		}
	});

	return ContactController;
});

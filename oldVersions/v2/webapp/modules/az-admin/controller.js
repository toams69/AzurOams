/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          controller.js
 */

define([
	'underscore', 'backbone', './az-admin', 'i18n!./nls/strings',
	'./view/admin-desktop/admin-desktop'
], function(
	_, Backbone, az, i18n, AdminDesktopView
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
				name: "AdminManagment",
				view: AdminDesktopView,
				title: i18n.admin_managment_title_label,
				icon: "fa-cog",
				order: 4
			}]);
			
		}
	});

	return ContactController;
});

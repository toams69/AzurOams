/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          controller.js
 */


define([
	'underscore', 'backbone'
	, './singleton/configuration'
	, './view/login/login'
	, './view/desktop/desktop'
	, './view/dashboard/dashboard'
	, './singleton/view-manager'
	, 'i18n!./nls/strings',
], function(
	_, Backbone
	, configuration
	, LoginView
	, DestkopView
	, DashboardView
	, viewManager
	, i18n
) {

	
	/**
	 * This class represents the core application.
	 * @constructor
	 */
	var AZController = Backbone.Router.extend({

		/**
		 * Initializes the AZController.
		 * @return {AZController} Itself.
		 */
		initialize:function() {
			console.debug('[AZController] Initializing app');
			this.registerSubview();
			this.viewLogin();
			//this.viewAPP();
			return this;
		},

		viewLogin: function() {
			console.debug('[AZController] Display Login Page');
			var loginView = new LoginView({ el:$('.main-body')});
			loginView.render();
			loginView.on("loggedIn", _.bind(function() {
				this.viewAPP();
			}, this));
		},

		viewAPP: function() {
			console.debug('[AZController] Display Desktop Page');
			configuration.load().then(_.bind(function() {
				var desktopView = new DestkopView({ el:$('.main-body')});
				desktopView.render();
			}, this));
			
		},


		registerSubview: function() {
			console.debug('[AZController] Register view');
			viewManager.add("DesktopRegion", [{
				name: "Dashboard",
				view: DashboardView,
				title: i18n.dashboard_title_label,
				icon: "fa-bar-chart",
				order: 1
			}]);
			
		}
	});

	return AZController;
});

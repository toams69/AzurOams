/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          Login.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./login.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/agent',
	'../../singleton/configuration'
], function(
	$, _, Backbone
	, template
	, i18n
	, user
	, configuration
) {
	
	var LoginView = Backbone.View.extend({

		initialize: function() {

		},

		render: function() {
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			configuration.getVersion().then(_.bind(function() {
				$(".alert-info", this.el).text(i18n.login_app_info +" v"+configuration.get("version"));
			}), this);
		},

		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		events: {
			"click .btn-login": "doLogin"
		},

		doLogin: function () {
			$(".btn-login", this.el).attr("disable", 'disable');
			user.logAgent($(".login-part input", this.el).val(), $(".password-part input", this.el).val()).then(
				_.bind(function() {
					this.trigger("loggedIn");
					new PNotify({
					    title: 'Bienvenue',
					    text: 'Bienvenue '+user.get("PRENOM_PERSONNEL")+'! ^_^',
					    type: "info",
					    styling: 'bootstrap3'
					});
				}, this)
			);
		},	

		handleError: function(data) {
		
		}
	});

	return LoginView;
});

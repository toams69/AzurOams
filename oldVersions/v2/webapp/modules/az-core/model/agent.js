/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          agent.js
 */


define([
	'underscore', 'backbone'
], function(_, Backbone) {

	var Agent = Backbone.Model.extend({

		defaults: {
		"nom":			"",
		"prenom":		"",
		"password":		""
		},

		initialize: function() { 
		},

		allowedToEdit: function() {
			return true;
		},

		logAgent: function(login, password) {
			var ajax = { type: "POST", url: "/api/agents", contentType: 'application/json; charset=UTF-8'};
			ajax.data = JSON.stringify({ 
				user: login,
				password: password
			});
			return $.ajax(ajax).then(_.bind(function(data) {
				this.set(JSON.parse(data));
			}, this));
		}

	});

	return Agent;
});

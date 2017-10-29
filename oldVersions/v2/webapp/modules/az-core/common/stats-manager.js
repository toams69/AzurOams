/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          stats-manager.js
 */


define([
	'underscore', 'backbone', '../model/logger',
], function(_, Backbone, Log) {
	var Log = new Log("StatsManager");
	var StatsManager = Backbone.Model.extend({

		initialize: function() { 
			
		},

		getFactureStats: function(idAnnee) {
			var ajax = { type: "GET", url: "/api/stats/factures", contentType: 'application/json; charset=UTF-8'};
			if (idAnnee) {
				ajax.url += "/"+idAnnee
			}			
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				return data;
			},this));
		},

		getMembreStats: function(idAnnee) {
			var ajax = { type: "GET", url: "/api/stats/membres", contentType: 'application/json; charset=UTF-8'};
			if (idAnnee) {
				ajax.url += "/"+idAnnee
			}			
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				return data;
			},this));
		},

		getInscriptionStats: function(nbElem) {
			var ajax = { type: "GET", url: "/api/stats/inscriptions", contentType: 'application/json; charset=UTF-8'};
			ajax.url += "/"+nbElem;
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				return data;
			},this));
		}
		
	});

	return StatsManager;
});

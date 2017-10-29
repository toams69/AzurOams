/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          clsh-manager.js
 */


define([
	'underscore', 'backbone', './clsh', "az"
], function(_, Backbone, CLSH, az) {
	var Log = new az.Log("CLSHManager");
	var CLSHManager = Backbone.Model.extend({

		initialize: function() { 
			this.set("clshSejourList", new Backbone.Collection());
			this.set("clshSecteurList", new Backbone.Collection());
		},

		getSecteurs: function() {
			var ajax = { type: "GET", url: "/api/clsh/secteurs", contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				if (data) {
					this.get("clshSecteurList").reset();
					_.each(data, function(d) {
						this.get("clshSecteurList").add(d);
					}, this);
				}
				return this.get("clshSecteurList");
			},this));
		},

		getSejours: function() {
			var ajax = { type: "GET", url: "/api/clsh/sejours", contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				if (data) {
					this.get("clshSejourList").reset();
					_.each(data, function(d) {
						this.get("clshSejourList").add(d);
					}, this);
				}
				return this.get("clshSejourList");
			},this));
		},

		getSejour: function(idSejour) {
			var ajax = { type: "GET", url: "/api/clsh/sejours/"+idSejour, contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				return new CLSH(data);
			},this));
		},

		getInscrit: function(idSejour) {
			var ajax = { type: "GET", url: "/api/clsh/sejours/"+idSejour, contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				return data.journees;
			},this));
		}

	});

	return CLSHManager;
});

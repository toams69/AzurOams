/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          configuration.js
 */


define([
	'underscore', 'backbone', './logger'
], function(_, Backbone, Logger) {

	var log = new Logger("Configuration");
	var Configuration = Backbone.Model.extend({

		defaults: {
			"version":  			"2.0.0",
			"remoteVersion":  		"2.0.0",
			"alert-timeout":			5000,
			"villes":					new Backbone.Collection(),
			"agrementations":  			new Backbone.Collection(),
			"quartiers":				new Backbone.Collection(),
			"annees": 					new Backbone.Collection(),
			"civilites":				new Backbone.Collection(),
			"ristournes":				new Backbone.Collection(),
			"banques":                  new Backbone.Collection(),
			"secteurs":					new Backbone.Collection(),
			"typesReglement":           new Backbone.Collection()
		},

		initialize: function() {
			return this; 
		},

		upload: function() {
			var ajax = { type: "GET", url: "/api/version/update", contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax);
		},

		getVersion: function() {
			var ajax = { type: "GET", url: "/api/version", contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				this.set({"version": data.currentVersion, "remoteVersion": data.remoteVersion});
			}, this));
		},

		// Call server to get all informations
		load: function() {
			log.debug("Load");

			var ajax = { type: "GET", url: "/api/configuration", contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				var villes = data.villes;
				if (villes) {
					this.get("villes").reset();
					_.each(villes, function(ville) {
						this.get("villes").add(ville);
					}, this);
				}
				var civilites = data.civilites;
				if (civilites) {
					this.get("civilites").reset();
					_.each(civilites, function(ville) {
						this.get("civilites").add(ville);
					}, this);
				}
				var quartiers = data.quartiers;
				if (quartiers) {
					this.get("quartiers").reset();
					_.each(quartiers, function(quartier) {
						this.get("quartiers").add(quartier);
					}, this);
				}
				var typesReglement = data.typesReglement;
				if (typesReglement) {
					this.get("typesReglement").reset();
					_.each(typesReglement, function(typeReglement) {
						this.get("typesReglement").add(typeReglement);
					}, this);
				}

				var banques = data.banques;
				if (banques) {
					this.get("banques").reset();
					_.each(banques, function(banque) {
						this.get("banques").add(banque);
					}, this);
				}

				var ristournes = data.ristournes;
				if (ristournes) {
					this.get("ristournes").reset();
					_.each(ristournes, function(ristourne) {
						this.get("ristournes").add(ristourne);
					}, this);
				}

				var agrementations = data.agrementations;
				if (agrementations) {
					this.get("agrementations").reset();
					_.each(agrementations, function(agrementation) {
						this.get("agrementations").add(agrementation);
					}, this);
				}
				
				var secteurs = data.secteurs;
				if (secteurs) {
					this.get("secteurs").reset();
					_.each(secteurs, function(secteur) {
						this.get("secteurs").add(secteur);
					}, this);
				}

				var annees = data.annees;
				if (annees) {
					this.get("annees").reset();
					_.each(annees, function(annee) {
						annee.sTarifs = annee.tarifs; 
						annee.tarifs = new Backbone.Collection();
						_.each(annee.sTarifs, function(t) {annee.tarifs.add(t);});
						annees.sTarifs = null;
						this.get("annees").add(annee);
					}, this);

				}
				this.set("anneeEnCours", this.get("annees").find(function(d) {
					return new Date(d.get("DATE_DEBUT")) <= Date.now() && new Date(d.get("DATE_FIN")) >= Date.now();
				}));
				

				return this.get("contactList");
			},this));

		}

	});

	return Configuration;
});

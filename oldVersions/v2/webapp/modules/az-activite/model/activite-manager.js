/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          activite-manager.js
 */


define([
	'underscore', 'backbone', './activite', "az"
], function(_, Backbone, Activite, az) {
	var Log = new az.Log("ActiviteManager");
	var ActiviteManager = Backbone.Model.extend({

		initialize: function() { 
			this.set("activiteList", new Backbone.Collection());
		},

		// Get activites
		// Return a collection of activite
		getActivites: function(refresh) {
			if (refresh) {
				var ajax = { type: "GET", url: "/api/activites", contentType: 'application/json; charset=UTF-8'};
				return $.ajax(ajax).then(_.bind(function(data) {
					data = JSON.parse(data);
					if (data) {
						this.get("activiteList").reset();
						_.each(data, function(d) {
							var activite = new Activite(d);
							this.get("activiteList").add(activite);
						}, this);
					}
					return this.get("activiteList");
				},this));
			} else {
				return $.when(this.get("activiteList"));
			}
		},

		getActivite: function(activite) {
			var idActivite = activite.get("ID_ACTIVITE");
			var ajax = { type: "GET", url: "/api/activites/"+idActivite, contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				if (data && data.activite) {
					activite.set(data.activite);
					activite.get("membres").reset();
					if (data.membres) {
						_.each(data.membres, function(a) {
							activite.get("membres").add(a);
						});
					}
					return activite;
				}
				return null;
			},this));
		},

		deleteInscription: function(idInscription) {
			if (idInscription) {
				Log.debug("deleteInscription "+idInscription);
				var ajax = { type: "POST", url: "/api/activites/inscriptions/"+idInscription, contentType: 'application/json; charset=UTF-8'};
				ajax.data = JSON.stringify({ idInscription: idInscription, operation:"Delete"});
				return $.ajax(ajax);
			} else {
				return $.Deferred().reject();
			}
		},

		inscriptionActivite: function(activite, montant, contact, annee, montantF, montantA, ristourne) {
			var idActivite = activite.get("ID_ACTIVITE");
			var text = (new Date(annee.get("DATE_DEBUT")).getUTCFullYear()) + " - " + (new Date(annee.get("DATE_FIN")).getUTCFullYear());
			var motif = "Inscription à l'activité: "+activite.get("NOM_ACTIVITE")+" pour l'année "+text;

			if (montantA) {
				motif +="\nActivité = "+montantA+" €";
			}
			if (montantF) {
				motif +="\nFourniture = "+montantF+" €";
			}
			if (ristourne) {
				motif +="\nRistourne accordée: "+ristourne.get("MOTIF_RISTOURNE");
			}

			var ajax = { type: "POST", url: "/api/activites/"+idActivite, contentType: 'application/json; charset=UTF-8'};

			ajax.data = JSON.stringify({ 
				membre: contact.attributes,
				montant: montant,
				motif: motif, 
				operation:"Inscription"
			});

			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				if (data && data.activite) {
					activite.set(data.activite);
					activite.get("membres").reset();
					if (data.membres) {
						_.each(data.membres, function(a) {
							activite.get("membres").add(a);
						});
					}
					return activite;
				}
				return null;
			},this));
		}
	});

	return ActiviteManager;
});

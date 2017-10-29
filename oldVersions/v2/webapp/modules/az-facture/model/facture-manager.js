/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          facture-manager.js
 */


define([
	'underscore', 'backbone', './facture', "az"
], function(_, Backbone, Facture, az) {
	var Log = new az.Log("FactureManager");
	var FactureManager = Backbone.Model.extend({

		initialize: function() { 
			
		},

		getFacture: function(idFacture) {
			if (!idFacture) {
				return;
			}
			var ajax = { type: "GET", url: "/api/factures/"+idFacture, contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				var f = new Facture(data);
				var restant = Math.round(parseFloat(f.get("MONTANT_FACTURE")) * 100) / 100;
				_.each(f.get("reglements"), function(r) {
					restant -= parseFloat(r["MONTANT_REGLEMENT"]);
					restant = Math.round(restant * 100) / 100;
				});
				f.set("MONTANT_RESTANT", restant);


				return f;
			},this));
		},

		deleteReglement: function(reglement) {
			if (reglement && reglement["ID_REGLEMENT"] && reglement["ID_FACTURE"]) {
				Log.debug("DeleteReglement "+reglement["ID_REGLEMENT"]);
				var ajax = { type: "POST", url: "/api/factures/"+reglement["ID_FACTURE"], contentType: 'application/json; charset=UTF-8'};
				ajax.data = JSON.stringify({ idReglement: reglement["ID_REGLEMENT"], operation:"DeleteReglement"});
				return $.ajax(ajax);
			} else {
				return $.Deferred().reject();
			}
		},

		ajoutReglement: function(idFacture, reglement) {
			if (idFacture && reglement) {
				var date = reglement.date.split("/");
				reglement.date = date[2]+"-"+date[1]+"-"+date[0];
				Log.debug("Ajout reglement facture "+idFacture);
				var ajax = { type: "POST", url: "/api/factures/"+idFacture, contentType: 'application/json; charset=UTF-8'};
				ajax.data = JSON.stringify({ reglement: reglement, operation:"AddReglement"});
				return $.ajax(ajax);
				
			}
		}

		
	});

	return FactureManager;
});

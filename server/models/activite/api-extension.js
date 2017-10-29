module.exports = function(app, connection, router){
	router.route('/activites')
	
	.get(function(req, res) {
		console.log("--- Get Activites --- ");
		var query = connection.query('SELECT a.*, SUM(PRIX_FOURNITURE) AS PRIX_FOURNITURE FROM  `activites` a LEFT JOIN fournitures_activites USING (ID_ACTIVITE) LEFT JOIN fournitures USING (ID_FOURNITURE) LEFT JOIN professeurs USING (ID_PROFESSEUR) GROUP BY(ID_ACTIVITE)', function(err, rows) {
			if (err) throw err;
			res.respond(JSON.stringify(rows), 200);
		});
		console.log("=> "+ query.sql);

	});


	router.route('/activites/:activite_id')
	.post(function(req, res) {
		if (req.body.operation === "Inscription") { // Update Enfant
			// Requete
			console.log("--- Inscription Activite ---" );
			if (req.body.membre && req.params.activite_id) {
				var isEnfant = req.body.membre["ID_ENFANT"] ? true : false;
				var idMembre = req.body.membre["ID_MEMBRE"];
				var idFamille = req.body.membre["ID_FAMILLE"];
				// Creation Facture
				var post  = {"ID_FAMILLE": idFamille, "ID_TYPE_FACTURE": isEnfant ? 4 : 5, "DATE_FACTURE": new Date(), 
						 "MONTANT_FACTURE":req.body.montant, "MOTIF_FACTURE": req.body.motif, "ID_MEMBRE": idMembre, "REMBOURSEMENT": 0, "ANNULATION": 0};
				var query = connection.query("INSERT INTO factures SET ?", post, function(err, info) {
					var idFacture = info.insertId;
					if (err) throw err;
					var post = {"ID_ACTIVITE": req.params.activite_id, "ID_FACTURE": idFacture, "DATE_INSCRIPTION": new Date()};
					if (isEnfant) {
						post["ID_ENFANT"] = req.body.membre["ID_ENFANT"];
					} else {
						post["ID_MEMBRE"] = req.body.membre["ID_MEMBRE"];
					}
					var query = connection.query("INSERT INTO inscriptions_activites SET ?", post, function(err) {
						if (err) throw err;
						res.respond(JSON.stringify({adhesion:{ID_ENFANT: req.params.contact_id, ID_ANNEE: req.body.idAnnee, ID_FACTURE: idFacture, NUMERO_ADHERENT: req.body.numeroAdherent}}), 200);
					});
					console.log("=> "+ query.sql);
				});
				console.log("=> "+ query.sql);
			} else {
				res.respond(new Error('Missing mandatory parameters'), 400);
			}
		} else {
			res.respond(new Error('Bad/Missing Operation'), 400);
		}
	});


	router.route('/activites/inscriptions/:inscription_id')
	.post(function(req, res) {
		if (req.body.operation === "Delete") {
			console.log("--- Delete Inscription Activite ---" );
			var query = connection.query("DELETE FROM inscriptions_activites WHERE ID_INSCRIPTION_ACTIVITE = "+ req.params.inscription_id, function(err, info) {
				var idFacture = info.insertId;
				if (err) throw err;
				res.respond(200);
			});
			console.log("=> "+ query.sql);
			
		} else {
			res.respond(new Error('Bad/Missing Operation'), 400);
		}
	});

};
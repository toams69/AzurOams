module.exports = function(app, connection, router){
	var _ = require('underscore'); 

	router.route('/clsh/secteurs')
	
	.get(function(req, res) {		
		var query = connection.query('SELECT * FROM `secteurs_cl`', function(err, rows) {
			if (err) throw err;
			res.json(rows);
		});
		console.log("=> "+ query.sql);
	});

	router.route('/clsh/sejours')
	
	.get(function(req, res) {		
		var query = connection.query('SELECT *, YEAR(MIN(`DATE_JOURNEE`)) as ANNEE FROM `sejours_cl` LEFT JOIN agrementations USING (ID_AGREMENTATION) LEFT JOIN journees_cl USING (ID_SEJOUR) GROUP BY ID_SEJOUR', function(err, rows) {
			if (err) throw err;
			res.json(rows);
		});
		console.log("=> "+ query.sql);
	});

	router.route('/clsh/sejours/:sejour_id')
	.get(function(req, res) {
		var sejour = {};
		var idTableTarifaire = null;
		var query = connection.query('SELECT * FROM `sejours_cl` LEFT JOIN agrementations USING (ID_AGREMENTATION) WHERE ID_SEJOUR =' +req.params.sejour_id, function(err, rows) {
			if (err) throw err;
			sejour = rows[0];
			var journees = [],
				journeesCl= [];
			var query = connection.query('SELECT * FROM  `planning_journee_cl` LEFT JOIN periodes_quotidiennes USING (  `ID_PERIODE_QUOTIDIENNE` ) LEFT JOIN journees_cl USING (  `ID_JOURNEE` )  WHERE ID_SEJOUR =' +req.params.sejour_id, function(err, rows) {
				if (err) throw err;
				_.each(rows, function(r) {
					if (!idTableTarifaire) {
						idTableTarifaire = r["ID_TABLE_TARIFAIRE"];
					}
					if (journees.indexOf(r["ID_JOURNEE"]) === -1) {
						journeesCl.push(r);
						journees.push(r["ID_JOURNEE"]);
						journeesCl[journeesCl.length - 1].periodes = [{"ID_PERIODE_QUOTIDIENNE": r["ID_PERIODE_QUOTIDIENNE"], "INTITULE_PERIODE": r["INTITULE_PERIODE"], "ABREVIATION_PERIODE": r["ABREVIATION_PERIODE"]}];
						journeesCl[journeesCl.length - 1].inscrits = [];
						delete journeesCl[journeesCl.length - 1]['ID_PERIODE_QUOTIDIENNE'];
						delete journeesCl[journeesCl.length - 1]['INTITULE_PERIODE'];
						delete journeesCl[journeesCl.length - 1]['ABREVIATION_PERIODE'];
					} else {
						var find = _.find(journeesCl, function(j) {
							return j["ID_JOURNEE"] === r["ID_JOURNEE"];
						});
						if (find) {
							find.periodes.push({"ID_PERIODE_QUOTIDIENNE": r["ID_PERIODE_QUOTIDIENNE"], "INTITULE_PERIODE": r["INTITULE_PERIODE"], "ABREVIATION_PERIODE": r["ABREVIATION_PERIODE"]});
						}
					}

				});
				var query = connection.query('SELECT * FROM  `prix_tables_tarifaires` LEFT JOIN tables_tarifaires USING (ID_TABLE_TARIFAIRE) LEFT JOIN periodes_quotidiennes USING (ID_PERIODE_QUOTIDIENNE) LEFT JOIN fourchettes_caf USING (ID_FOURCHETTE) WHERE ID_TABLE_TARIFAIRE =' +idTableTarifaire+ ' ORDER BY ID_PERIODE_QUOTIDIENNE ASC', function(err, rows) {
					if (err) throw err;
					sejour.tableTarif = {};
					sejour.tableTarif["NOM_TABLE"] = rows[0]["NOM_TABLE"];
					sejour.tableTarif["ID_TABLE_TARIFAIRE"]= rows[0]["ID_TABLE_TARIFAIRE"];
					sejour.tableTarif.table = [];
					_.each(rows, function(r) {
						sejour.tableTarif.table.push(r);
						delete sejour.tableTarif.table[sejour.tableTarif.table.length - 1]['NOM_TABLE'];
						delete sejour.tableTarif.table[sejour.tableTarif.table.length - 1]['ID_TABLE_TARIFAIRE'];
						delete sejour.tableTarif.table[sejour.tableTarif.table.length - 1]['ID_TABLE'];
						
					});

					var query = connection.query('SELECT * FROM  `ristourne` LEFT JOIN `table_tarifaire_ristournes` USING (ID_RISTOURNE) WHERE ID_TABLE_TARIFAIRE =' +idTableTarifaire+ ' ORDER BY PRCT_RISTOURNE ASC', function(err, rows) {
						if (err) throw err;
						sejour.tableTarif.ristournes = [];
						_.each(rows, function(r) {
							sejour.tableTarif.ristournes.push(r);
							delete sejour.tableTarif.ristournes[sejour.tableTarif.ristournes.length - 1]['ID_TABLE_TARIFAIRE'];
						});
						var query = connection.query('SELECT * FROM  `inscrits_cl` LEFT JOIN enfants USING (ID_ENFANT) LEFT JOIN periodes_quotidiennes USING (  `ID_PERIODE_QUOTIDIENNE` ) WHERE ID_JOURNEE IN (' +journees.join(",") + ') ORDER BY NOM_ENFANT,PRENOM_ENFANT ASC', function(err, rows) {
							if (err) throw err;
							_.each(rows, function(r) {
								var find = _.find(journeesCl, function(j) {
									return j["ID_JOURNEE"] === r["ID_JOURNEE"];
								});
								if (find) {
									var inscrit = _.find(find.inscrits, function(i) {
										return i["ID_ENFANT"] === r["ID_ENFANT"];
									});
									if (!inscrit) {
										inscrit = r;
										inscrit.periodes = [];
										inscrit.periodes.push({"ID_PERIODE_QUOTIDIENNE": r["ID_PERIODE_QUOTIDIENNE"], "INTITULE_PERIODE": r["INTITULE_PERIODE"], "ABREVIATION_PERIODE": r["ABREVIATION_PERIODE"]});
										delete inscrit['ID_PERIODE_QUOTIDIENNE'];
										delete inscrit['INTITULE_PERIODE'];
										delete inscrit['ABREVIATION_PERIODE'];
										find.inscrits.push(inscrit);
									} else {
										inscrit.periodes.push({"ID_PERIODE_QUOTIDIENNE": r["ID_PERIODE_QUOTIDIENNE"], "INTITULE_PERIODE": r["INTITULE_PERIODE"], "ABREVIATION_PERIODE": r["ABREVIATION_PERIODE"]});
									}
									
								}
							});
							sejour.journees = journeesCl;
							res.json(sejour);
						});
						console.log("=> "+ query.sql);
					});
					console.log("=> "+ query.sql);
				});
				console.log("=> "+ query.sql);
			});
			console.log("=> "+ query.sql);
		});
		console.log("=> "+ query.sql);
	});
	
	// router.route('/clsh/sejours/:sejour_id/inscrits')
	// .post(function(req, res) {
	// 	console.log("--- add inscrit CL ---" );

	// 	const create = (idFacture, idEnfant, idJournee, idPeriode, ristourne, prix) => {
	// 		const query = `INSERT INTO \`INSCRITS_CL\` (
	// 			ID_ENFANT
	// 		   ,ID_JOURNEE
	// 		   ,ID_PERIODE_QUOTIDIENNE
	// 		   ,ID_FACTURE
	// 		   ,DATE_INSCRIPTION
	// 		   ,LISTE_ATTENTE
	// 		   ,PRESENT
	// 		   ,ANNULATION
	// 		   ,RISTOURNE
	// 		   ,PRIX
	// 		 ) VALUES (
	// 			idE     ,idJ     ,idP     ,idF     ,CURRENT_TIMESTAMP     ,0     ,0     ,0 	, ristourne 	, prix   
	// 		 )`
	// 	}




	// 	if (!req.params.idFacture) {
	// 		// create the facture
	// 		if (req.body.membre && req.params.activite_id) {
	// 			var idMembre = req.body.membre["ID_MEMBRE"];
	// 			var idFamille = req.body.membre["ID_FAMILLE"];
	// 			// Creation Facture
	// 			var post  = {"ID_FAMILLE": idFamille, "ID_TYPE_FACTURE": 4, "DATE_FACTURE": new Date(), 
	// 					 "MONTANT_FACTURE":req.body.montant, "MOTIF_FACTURE": req.body.motif, "ID_MEMBRE": idMembre, "REMBOURSEMENT": 0, "ANNULATION": 0, "NB_REGLEMENT": 0};
	// 			var query = connection.query("INSERT INTO factures SET ?", post, function(err, info) {
	// 				var idFacture = info.insertId;
	// 				if (err) throw err;
	// 				var post = {"ID_ACTIVITE": req.params.activite_id, "ID_FACTURE": idFacture, "DATE_INSCRIPTION": new Date(), "LISTE_ATTENTE" : 0, "ANNULATION": 0};
	// 				if (isEnfant) {
	// 					post["ID_ENFANT"] = req.body.membre["ID_ENFANT"];
	// 				} else {
	// 					post["ID_MEMBRE"] = req.body.membre["ID_MEMBRE"];
	// 				}
	// 				var query = connection.query("INSERT INTO inscriptions_activites SET ?", post, function(err) {
	// 					if (err) throw err;
	// 					res.json({adhesion:{ID_ENFANT: req.params.contact_id, ID_ANNEE: req.body.idAnnee, ID_FACTURE: idFacture, NUMERO_ADHERENT: req.body.numeroAdherent}});
	// 				});
	// 				console.log("=> "+ query.sql);
	// 			});
	// 			console.log("=> "+ query.sql);
	// 		} else {
	// 			res.respond(new Error('Missing mandatory parameters'), 400);
	// 		}
	// 	} else {

	// 	}
	// 	var AllContactsQuery =  `INSERT INTO \`INSCRITS_CL\` (
	// 		ID_ENFANT
	// 	   ,ID_JOURNEE
	// 	   ,ID_PERIODE_QUOTIDIENNE
	// 	   ,ID_FACTURE
	// 	   ,DATE_INSCRIPTION
	// 	   ,LISTE_ATTENTE
	// 	   ,PRESENT
	// 	   ,ANNULATION
	// 	   ,RISTOURNE
	// 	   ,PRIX
	// 	 )`

	// });


	//SELECT * FROM  `planning_journee_cl` LEFT JOIN periodes_quotidiennes USING (  `ID_PERIODE_QUOTIDIENNE` ) LEFT JOIN journees_cl USING (  `ID_JOURNEE` )  WHERE ID_SEJOUR =
};
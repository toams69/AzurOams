module.exports = function(app, connection, router){
	var _ = require('underscore'); 

	router.route('/stats')
	
	.get(function(req, res) {
		var obj = {};
		connection.query('SELECT * FROM  `villes`', function(err, rows) {
			if (err) throw err;
			obj.villes = rows;
				connection.query('SELECT * FROM `civilites` ', function(err, rows) {
					if (err) throw err;
					obj.civilites = rows;
					connection.query('SELECT * FROM `quartiers` ', function(err, rows) {
						if (err) throw err;
						obj.quartiers = rows;
						connection.query('SELECT * FROM  `annees_association` ', function(err, rows) {
							if (err) throw err;
							obj.annees = rows;
							connection.query('SELECT * FROM  `tarifs_annuel` LEFT JOIN prix_adhesions USING (ID_PRIX)', function(err, rows) {
								if (err) throw err;
								var tarifs = rows;
								_.each(obj.annees, function(a) {
									a.tarifs = _.filter(tarifs, function(t) {return t["ID_ANNEE"] === a["ID_ANNEE"];});
								});
								connection.query('SELECT * FROM  `type_reglement`', function(err, rows) {
									if (err) throw err;
									obj.typesReglement = rows;
									connection.query('SELECT * FROM  `banque`', function(err, rows) {
										if (err) throw err;
										obj.banques = rows;
										connection.query('SELECT * FROM  `ristourne`', function(err, rows) {
											if (err) throw err;
											obj.ristournes = rows;
											res.respond(JSON.stringify(obj), 200);
										});
									});
								});
							});
						});
						
						
					});
				});
			
		});
	});

	router.route('/stats/factures')
	
	.get(function(req, res) {		
		var query = connection.query('SELECT f.*, SUM(MONTANT_REGLEMENT) AS MONTANT_REGLE FROM `factures` f LEFT JOIN reglement USING(ID_FACTURE) GROUP BY (ID_FACTURE)', function(err, rows) {
			if (err) throw err;
			var obj = {nbFactures: rows.length, facturesRegle: 0, facturesPartiellementRegle: 0, facturesNonRegle: 0};
			_.each(rows, function(row) {
				if (row["MONTANT_FACTURE"] > row["MONTANT_REGLE"]) {
					if (row["MONTANT_REGLE"]) {
						obj.facturesPartiellementRegle ++;
					} else {
						obj.facturesNonRegle ++;
					}
				} else {
					obj.facturesRegle ++;
				}
			});
			var json = JSON.stringify(obj);
			res.respond(json, 200);
		});
		console.log("=> "+ query.sql);
	});

	router.route('/stats/factures/:annee_id')
	.get(function(req, res) {

		var query = connection.query('SELECT DATE_FORMAT(DATE_DEBUT,\'%Y-%m-%d\') AS DATE_DEBUT, DATE_FORMAT(DATE_FIN,\'%Y-%m-%d\') AS DATE_FIN FROM annees_association WHERE ID_ANNEE='+req.params.annee_id, function(err, rows) {
			if (err) throw err;
			var dd = rows[0]["DATE_DEBUT"],
				df = rows[0]["DATE_FIN"];

			var query = connection.query('SELECT f.*, SUM(MONTANT_REGLEMENT) AS MONTANT_REGLE FROM `factures` f LEFT JOIN reglement USING(ID_FACTURE) GROUP BY (ID_FACTURE) HAVING f.DATE_FACTURE > \''+dd+'\' AND f.DATE_FACTURE < \''+df+'\'', function(err, rows) {
				if (err) throw err;
				var obj = {nbFactures: rows.length, facturesRegle: 0, facturesPartiellementRegle: 0, facturesNonRegle: 0};
				_.each(rows, function(row) {
					if (row["MONTANT_FACTURE"] > row["MONTANT_REGLE"]) {
						if (row["MONTANT_REGLE"]) {
							obj.facturesPartiellementRegle ++;
						} else {
							obj.facturesNonRegle ++;
						}
					} else {
						obj.facturesRegle ++;
					}
				});
				var json = JSON.stringify(obj);
				res.respond(json, 200);
			});
			console.log("=> "+ query.sql);
		});
		console.log("=> "+ query.sql);
	});


	router.route('/stats/membres')
	.get(function(req, res) {
		var obj = {nbMembres: 0, homme: 0, femme: 0, garcon: 0, fille: 0};
		var query = connection.query('SELECT * FROM adherents_adultes LEFT JOIN membres using (ID_MEMBRE) GROUP BY ID_MEMBRE', function(err, rows) {
			if (err) throw err;
			
			_.each(rows, function(row) {
				if (row["ID_CIVILITE"] === 1) {
					obj.homme ++;
				} else {
					obj.femme ++;
				}
			});
			obj.nbMembres += rows.length;
			var query = connection.query('SELECT * FROM adherents_enfants LEFT JOIN enfants using (ID_ENFANT) GROUP BY ID_ENFANT', function(err, rows) {
				if (err) throw err;
				_.each(rows, function(row) {
					if (row["ID_CIVILITE"] === 1) {
						obj.garcon ++;
					} else {
						obj.fille ++;
					}
				});
				obj.nbMembres += rows.length;
				var json = JSON.stringify(obj);
				res.respond(json, 200);
			});
			console.log("=> "+ query.sql);
		});
		console.log("=> "+ query.sql);

	});

	router.route('/stats/membres/:annee_id')
	.get(function(req, res) {
		var obj = {nbMembres: 0, homme: 0, femme: 0, garcon: 0, fille: 0};
		var query = connection.query('SELECT * FROM adherents_adultes LEFT JOIN membres using (ID_MEMBRE) GROUP BY (ID_MEMBRE) HAVING ID_ANNEE ='+req.params.annee_id, function(err, rows) {
			if (err) throw err;
			
			_.each(rows, function(row) {
				if (row["ID_CIVILITE"] === 1) {
					obj.homme ++;
				} else {
					obj.femme ++;
				}
			});
			obj.nbMembres += rows.length;
			var query = connection.query('SELECT * FROM adherents_enfants LEFT JOIN enfants using (ID_ENFANT) GROUP BY (ID_ENFANT) HAVING ID_ANNEE ='+req.params.annee_id, function(err, rows) {
				if (err) throw err;
				_.each(rows, function(row) {
					if (row["ID_CIVILITE"] === 1) {
						obj.garcon ++;
					} else {
						obj.fille ++;
					}
				});
				obj.nbMembres += rows.length;
				var json = JSON.stringify(obj);
				res.respond(json, 200);
			});
			console.log("=> "+ query.sql);
		});
		console.log("=> "+ query.sql);

	});


	router.route('/stats/inscriptions/:nbElem')
	.get(function(req, res) {
		var ret = {inscriptions: []};
		var query =	connection.query('SELECT * FROM  `factures` LIMIT 0 , '+req.params.nbElem, function(err, rows) {
			if (err) throw err;
			var total = rows.length;
			_.each(rows, function(row) {
				var query = "SELECT ID_FACTURE as isAdhesionAdulte, 0 as isAdhesionEnfant, 0 as isActivtie, 0 as isCL FROM `adherents_adultes` WHERE ID_FACTURE = "+row['ID_FACTURE']+" GROUP BY(ID_FACTURE)\
						union \
						SELECT 0,ID_FACTURE, 0, 0 FROM `adherents_enfants`  WHERE ID_FACTURE = "+row['ID_FACTURE']+" GROUP BY(ID_FACTURE) \
						union\
						SELECT 0, 0, ID_FACTURE, 0 FROM `inscriptions_activites`  WHERE ID_FACTURE = "+row['ID_FACTURE']+" GROUP BY(ID_FACTURE)\
						union\
						SELECT 0, 0, 0, ID_FACTURE FROM `inscrits_cl`  WHERE ID_FACTURE = "+row['ID_FACTURE']+" GROUP BY(ID_FACTURE)";

				var q = connection.query(query, function(err, rows) {
					var obj = {facture: row};
					if (err) throw err;
					var table = rows[0].isAdhesionAdulte ? "adherents_adultes" : rows[0].isAdhesionEnfant ? "adherents_enfants" : rows[0].isActivtie ? "inscriptions_activites" : rows[0].isCL ? "inscrits_cl" : "";
					switch (table) {
						case 'adherents_adultes':
							var q2 = connection.query("SELECT * FROM  "+table+" LEFT JOIN membres USING (ID_MEMBRE) WHERE (ID_FACTURE)="+ row['ID_FACTURE'], function(err, rows) {
								if (err) throw err;
								obj.objet = rows[0];
								obj.objet.type= "adhesionAdulte";
								ret.inscriptions.push(obj);
								if (total == ret.inscriptions.length) {
									var json = JSON.stringify(ret.inscriptions);
									res.respond(json, 200);
								}
							});
							console.log("=> "+ q2.sql);
							break;
						case 'adherents_enfants':
							var q2 = connection.query("SELECT * FROM  "+table+" LEFT JOIN enfants USING (ID_ENFANT) WHERE (ID_FACTURE)="+ row['ID_FACTURE'], function(err, rows) {
								if (err) throw err;
								obj.objet = rows[0];
								obj.objet.type= "adhesionEnfant";
								ret.inscriptions.push(obj);
								if (total == ret.inscriptions.length) {
									var json = JSON.stringify(ret.inscriptions);
									res.respond(json, 200);
								}
							});
							console.log("=> "+ q2.sql);
							break;
						case 'inscriptions_activites':	
							var q2 = connection.query("SELECT * FROM  inscriptions_activites LEFT JOIN membres USING (ID_MEMBRE) LEFT JOIN enfants USING (ID_ENFANT) LEFT JOIN activites USING (ID_ACTIVITE) WHERE (ID_FACTURE)="+ row['ID_FACTURE'], function(err, rows) {
								if (err) throw err;
								obj.objet = rows[0];
								obj.objet.type= "activite";
								ret.inscriptions.push(obj);
								if (total == ret.inscriptions.length) {
									var json = JSON.stringify(ret.inscriptions);
									res.respond(json, 200);
								}
							});
							console.log("=> "+ q2.sql);
							break;
						case 'inscrits_cl':	
							var q2 = connection.query("SELECT * FROM  inscrits_cl LEFT JOIN journees_cl USING (ID_JOURNEE) LEFT JOIN sejours_cl USING (ID_SEJOUR) WHERE (ID_FACTURE)="+ row['ID_FACTURE'] +" GROUP BY (ID_FACTURE)", function(err, rows) {
								if (err) throw err;
								obj.objet = rows[0];
								obj.objet.type= "cl";
								ret.inscriptions.push(obj);
								if (total == ret.inscriptions.length) {
									var json = JSON.stringify(ret.inscriptions);
									res.respond(json, 200);
								}
							});
							console.log("=> "+ q2.sql);
							break;
						default:
							total --;
							if (total == ret.inscriptions.length) {
								var json = JSON.stringify(ret.inscriptions);
								res.respond(json, 200);
							}
							break;
					}
				});
				console.log("=> "+ q.sql);
			});

			
		});
		console.log("=> "+ query.sql);

	});


};
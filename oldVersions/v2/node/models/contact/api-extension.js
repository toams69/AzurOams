/*jshint multistr: true */
module.exports = function(app, connection, router){
	var _    = require('underscore'); 

	var nullToEmpty = function(val) {
		if (!val && val !== 0) {
			return '';
		}
		return val;
	};


	var AllContactsQuery =  "SELECT  ID_FAMILLE, ID_MEMBRE, 0 AS ID_ENFANT, ID_VILLE, ID_CIVILITE, ID_QUARTIER, NOM_MEMBRE, PRENOM_MEMBRE, \
	 NAISSANCE_MEMBRE, ADR_MEMBRE, TEL1_MEMBRE, TEL2_MEMBRE, MAIL_MEMBRE, NUM_SECU_MEMBRE, NOM_EMPLOYEUR , LIEU_TRAVAIL, TELT_MEMBRE, ALLOCATAIRE_CAF, \
	 ALLOCATAIRE_MSA, INSCRIPTION_DATE, PARENT, floor(((to_days(curdate()) - to_days(`NAISSANCE_MEMBRE`)) / 365)) AS AGE_MEMBRE, ABREVIATION_CIVILITE, NOM_CIVILITE, CP_VILLE, \
	 NOM_VILLE FROM membres LEFT JOIN villes USING(ID_VILLE) LEFT JOIN civilites USING (ID_CIVILITE) \
	 UNION SELECT ID_FAMILLE, ID_MEMBRE, ID_ENFANT, 0, ID_CIVILITE, 0, NOM_ENFANT, PRENOM_ENFANT, NAISSANCE_ENFANT, 0, TEL_ENFANT, 0, 0, 0, 0, 0, 0, 0, 0,\
	 INSCRIPTION_DATE, 0, floor(((to_days(curdate()) - to_days(`NAISSANCE_ENFANT`)) / 365)), ABREVIATION_CIVILITE, NOM_CIVILITE, 0, 0 from enfants LEFT JOIN civilites USING (ID_CIVILITE)";


	var UpdateAdulteQuery= "UPDATE membres set ID_VILLE = <%= contact[\"ID_VILLE\"] %>, ID_CIVILITE=<%= contact[\"ID_CIVILITE\"] %>, NOM_MEMBRE = '<%= contact[\"NOM_MEMBRE\"] %>', PRENOM_MEMBRE = '<%= contact[\"PRENOM_MEMBRE\"] %>', \
	ID_QUARTIER = <%= contact[\"ID_QUARTIER\"] %> , NAISSANCE_MEMBRE = '<%= contact[\"NAISSANCE_MEMBRE\"] %>' , ADR_MEMBRE = '<%= contact[\"ADR_MEMBRE\"] %>' , TEL1_MEMBRE = '<%=  contact[\"TEL1_MEMBRE\"] %>' , TEL2_MEMBRE = '<%= contact[\"TEL2_MEMBRE\"] %>' , \
	MAIL_MEMBRE = '<%= contact[\"MAIL_MEMBRE\"] %>' , NUM_SECU_MEMBRE = '<%= contact[\"NUM_SECU_MEMBRE\"] %>' , NOM_EMPLOYEUR = '<%= contact[\"NOM_EMPLOYEUR\"] %>' , LIEU_TRAVAIL = '<%= contact[\"LIEU_TRAVAIL\"] %>' , TELT_MEMBRE = '<%= contact[\"TELT_MEMBRE\"] %>' , \
	ALLOCATAIRE_CAF = <%= contact[\"ALLOCATAIRE_CAF\"] %> ,PARENT = <%= contact[\"PARENT\"] %> , ALLOCATAIRE_MSA = <%= contact[\"ALLOCATAIRE_MSA\"] %> WHERE ID_MEMBRE = <%= contact[\"ID_MEMBRE\"]  %>";
   
	router.route('/contacts')
	
	.get(function(req, res) {
		console.log("--- Get All contacts --- ");
		var query = connection.query(AllContactsQuery, function(err, rows) {
			if (err) throw err;
			var json = JSON.stringify(rows);
			res.respond(json, 200);
		});
		console.log("=> "+ query.sql);
	})

	.post(function(req, res) {
		if (req.body.operation === "CreateAdulte") {
			console.log("--- Create Adulte ---");
			var post  = {"ID_FAMILLE": req.body.idFamille, "NOM_MEMBRE": req.body.nom, "PRENOM_MEMBRE": req.body.prenom, "NAISSANCE_MEMBRE": req.body.naissance, "ID_CIVILITE":req.body.civilite};
			var query =  connection.query("INSERT INTO membres SET ?", post, function(err, info) {
				if (err) throw err;
				res.respond(200, JSON.stringify({idMembre: info.insertId}));
			});
			console.log("=> "+ query.sql);
		} else if (req.body.operation === "CreateEnfant") {
			console.log("--- Create Enfant ---");
			var post  = {"ID_FAMILLE": req.body.idFamille, "NOM_ENFANT": req.body.nom, "PRENOM_ENFANT": req.body.prenom, "NAISSANCE_ENFANT": req.body.naissance, "ID_CIVILITE": req.body.civilite};
			var query =  connection.query("INSERT INTO enfants SET ?", post, function(err, info) {
				if (err) throw err;
				res.respond(200, JSON.stringify({idMembre: info.insertId}));
			});
			console.log("=> "+ query.sql);
		} else {
			res.respond(new Error('Bad/Missing Operation'), 400);
		}
		//res.send("error");
	});


	///////////////////
	// ADULTES
	//////////////////
	// Function Adulte
	var checkAdulteMandatoryParameter= function(adulte) {
		return adulte["ID_VILLE"] && adulte["ID_QUARTIER"] && adulte["NAISSANCE_MEMBRE"] && adulte["ADR_MEMBRE"] && adulte["ID_MEMBRE"];
	};

	router.route('/contacts/adultes/:contact_id')
	
	.post(function(req, res) {
		if (req.body.operation === "Update") {
			for (var i in req.body.adulte) {
				req.body.adulte[i] = nullToEmpty(req.body.adulte[i]);
			}
			if (req.body.adulte && checkAdulteMandatoryParameter(req.body.adulte) && req.body.adulte["ID_MEMBRE"] == req.params.contact_id) {	
				var finalQuery = _.template(UpdateAdulteQuery, {
					contact: req.body.adulte
				});
				console.log("--- Update Adulte --- ");
				var query = connection.query(finalQuery, function(err) {
					if (err) throw err;
					res.respond(200);
				});
				console.log("=> "+ query.sql);

			} else {
				res.respond(new Error('Missing mandatory parameters'), 400);
			}
		} else if (req.body.operation === "CreateAdhesion") { // Create Adhesion

			var post  = {"ID_FAMILLE": req.body.idFamille, "ID_TYPE_FACTURE": 1, "DATE_FACTURE": new Date(), 
						 "MONTANT_FACTURE":req.body.montant, "MOTIF_FACTURE": req.body.motif, "ID_MEMBRE": req.body.idMembre,
						 "REMBOURSEMENT": 0, "ANNULATION": 0};

			console.log("--- Create Adhesion Adulte --- ");
			var query = connection.query("INSERT INTO factures SET ?", post, function(err, info) {
				var idFacture = info.insertId;
				if (err) throw err;
				post = {"ID_MEMBRE":  req.params.contact_id, "ID_ANNEE": req.body.idAnnee, "ID_FACTURE": idFacture, "NUMERO_ADHERENT":  req.body.numeroAdherent};
				var query = connection.query("INSERT INTO adherents_adultes SET ?", post, function(err) {
					if (err) throw err;
					res.respond(JSON.stringify({adhesion:{ID_MEMBRE: req.params.contact_id, ID_ANNEE: req.body.idAnnee, ID_FACTURE: idFacture, NUMERO_ADHERENT: req.body.numeroAdherent}}), 200);
				});
				console.log("=> "+ query.sql);
				
			});
			console.log("=> "+ query.sql);
		} else if (req.body.operation === "UpdateAdhesion") {
			console.log("--- Update Adhesion Adulte --- ");
			var query = connection.query("UPDATE adherents_adultes SET NUMERO_ADHERENT= ? WHERE ID_ANNEE=? AND ID_MEMBRE=?", [req.body.numeroAdherent, req.body.idAnnee, req.params.contact_id], function(err) {
				if (err) throw err;
				res.respond(200);
			});
			console.log("=> "+ query.sql);
		} else {
			res.respond(new Error('Bad/Missing Operation'), 400);
		}
	})

	.get(function(req, res) {
		console.log("--- Get Adulte --- ");
		var obj = {};
		var query = connection.query('SELECT * FROM  `membres` LEFT JOIN `civilites` USING (ID_CIVILITE ) LEFT JOIN `villes` USING (ID_VILLE ) LEFT JOIN `familles` USING (ID_FAMILLE ) WHERE ID_MEMBRE='+req.params.contact_id, function(err, rows) {
			if (err) throw err;
			obj.adulte = rows[0];
			var query = connection.query('SELECT * FROM  `adherents_adultes` WHERE ID_MEMBRE='+req.params.contact_id, function(err, rows) {
				if (err) throw err;
				obj.adhesions = rows;
				var query = connection.query('SELECT * FROM  `inscriptions_activites` LEFT JOIN activites USING (ID_ACTIVITE) WHERE ID_MEMBRE='+req.params.contact_id, function(err, rows) {
					if (err) throw err;
					obj.activites = rows;
					var idFactures = [];
					_.each(obj.adhesions, function(a) {idFactures.push(a["ID_FACTURE"]);});
					_.each(obj.activites, function(a) {idFactures.push(a["ID_FACTURE"]);});
					if (!idFactures.length)
						return res.respond(JSON.stringify(obj), 200);
					var fquery = "SELECT f.*, t.*, sum(`MONTANT_REGLEMENT`) AS `MONTANT_REGLE` FROM `factures` f \
								 LEFT JOIN reglement r USING(ID_FACTURE) \
								 LEFT JOIN types_factures t USING(`ID_TYPE_FACTURE`) \
								 GROUP BY (f.ID_FACTURE) HAVING f.`ID_FACTURE` IN ("+idFactures.join() + ")"; 
					var query = connection.query(fquery, function(err, rows) {
						if (err) throw err;
						obj.factures = rows;
						res.respond(JSON.stringify(obj), 200);
					});
					console.log("=> "+ query.sql);
				});
				console.log("=> "+ query.sql);
			});
			console.log("=> "+ query.sql);
		});
		console.log("=> "+ query.sql);

	});

	//////////////
	// enfants
	/////////////

	


	router.route('/contacts/enfants/:contact_id')
	.post(function(req, res) {
		if (req.body.operation === "Update") { // Update Enfant
			// Requete
			console.log("--- Update Enfant ---" );
			var UpdateEnfantQuery= "UPDATE enfants set ID_CIVILITE=<%= contact[\"ID_CIVILITE\"] %>, NOM_ENFANT = '<%= contact[\"NOM_ENFANT\"] %>', PRENOM_ENFANT = '<%= contact[\"PRENOM_ENFANT\"] %>', \
			NAISSANCE_ENFANT = '<%= contact[\"NAISSANCE_ENFANT\"] %>' , TEL_ENFANT = '<%=  contact[\"TEL_ENFANT\"] %>', ID_MEMBRE = <%= contact[\"ID_MEMBRE\"]  %>, \
			INFORMATIONS_MEDICALES = '<%= contact[\"INFORMATIONS_MEDICALES\"] %>' , RECOMMENDATIONS = '<%= contact[\"RECOMMENDATIONS\"] %>' , HORAIRE = '<%= contact[\"HORAIRE\"] %>', \
			DROIT_IMAGE = <%= contact[\"DROIT_IMAGE\"] %> , RENTRE_SEUL = <%= contact[\"RENTRE_SEUL\"] %>, CERTIFICAT = <%= contact[\"CERTIFICAT\"] %> WHERE ID_ENFANT = <%= contact[\"ID_ENFANT\"]  %>";
			var checkEnfantMandatoryParameter= function(enfant) { return enfant["NAISSANCE_ENFANT"] && enfant["ID_ENFANT"] && enfant["ID_MEMBRE"];};

			for (var i in req.body.enfant) {
				req.body.enfant[i] = nullToEmpty(req.body.enfant[i]);
			}
			if (req.body.enfant && checkEnfantMandatoryParameter(req.body.enfant) && req.body.enfant["ID_ENFANT"] == req.params.contact_id) {	
				var finalQuery = _.template(UpdateEnfantQuery, {
					contact: req.body.enfant
				});
				var query = connection.query(finalQuery, function(err) {
					if (err) throw err;
					res.respond(200);
				});
				console.log("=> "+ query.sql);
			} else {
				res.respond(new Error('Missing mandatory parameters'), 400);
			}
		} else if (req.body.operation === "CreateAdhesion") { // Create Adhesion
			console.log("--- Create Adhesion Enfant --- ");
			var post  = {"ID_FAMILLE": req.body.idFamille, "ID_TYPE_FACTURE": 2, "DATE_FACTURE": new Date(), 
						 "MONTANT_FACTURE":req.body.montant, "MOTIF_FACTURE": req.body.motif, "ID_MEMBRE": req.body.idMembre,
						 "REMBOURSEMENT": 0, "ANNULATION": 0};
			var query = connection.query("INSERT INTO factures SET ?", post, function(err, info) {
				var idFacture = info.insertId;
				if (err) throw err;
				post = {"ID_ENFANT":  req.params.contact_id, "ID_ANNEE": req.body.idAnnee, "ID_FACTURE": idFacture, "NUMERO_ADHERENT":  req.body.numeroAdherent};
				var query = connection.query("INSERT INTO adherents_enfants SET ?", post, function(err) {
					if (err) throw err;
					res.respond(JSON.stringify({adhesion:{ID_ENFANT: req.params.contact_id, ID_ANNEE: req.body.idAnnee, ID_FACTURE: idFacture, NUMERO_ADHERENT: req.body.numeroAdherent}}), 200);
				});
				console.log("=> "+ query.sql);
				
			});
			console.log("=> "+ query.sql);

		} else if (req.body.operation === "UpdateAdhesion") {
			console.log("--- Update Adhesion Enfant --- ");
			var query = connection.query("UPDATE adherents_enfants SET NUMERO_ADHERENT= ? WHERE ID_ANNEE=? AND ID_ENFANT=?", [req.body.numeroAdherent, req.body.idAnnee, req.params.contact_id], function(err) {
				if (err) throw err;
				res.respond(200);
			});
			console.log("=> "+ query.sql);
		} else {
			res.respond(new Error('Bad/Missing Operation'), 400);
		}
	})

	.get(function(req, res) {
		console.log("--- Get Enfant --- ");
		var obj = {};		
		var query = connection.query('SELECT * FROM `enfants` LEFT JOIN `civilites` USING (ID_CIVILITE ) LEFT JOIN `familles` USING (ID_FAMILLE ) WHERE ID_ENFANT='+req.params.contact_id, function(err, rows) {
			if (err) throw err;
			obj.enfant = rows[0];
			var query = connection.query('SELECT * FROM  `adherents_enfants` WHERE ID_ENFANT='+req.params.contact_id, function(err, rows) {
				if (err) throw err;
				obj.adhesions = rows;
				var query = connection.query('SELECT * FROM  `inscriptions_activites` LEFT JOIN activites USING (ID_ACTIVITE) WHERE ID_ENFANT='+req.params.contact_id, function(err, rows) {
					if (err) throw err;
					obj.activites = rows;
					var query = connection.query('SELECT * FROM  `inscrits_cl` WHERE ID_ENFANT='+req.params.contact_id, function(err, rows) {
						var idFactures = [];
						_.each(obj.adhesions, function(a) {idFactures.push(a["ID_FACTURE"]);});
						_.each(obj.activites, function(a) {idFactures.push(a["ID_FACTURE"]);});
						_.each(rows, function(r) {idFactures.push(r["ID_FACTURE"]);});
						if (!idFactures.length)
							return res.respond(JSON.stringify(obj), 200);
						var fquery = "SELECT f.*, t.*, sum(`MONTANT_REGLEMENT`) AS `MONTANT_REGLE` FROM `factures` f \
									 LEFT JOIN reglement r USING(ID_FACTURE) \
									 LEFT JOIN types_factures t USING(`ID_TYPE_FACTURE`) \
									 GROUP BY (f.ID_FACTURE) HAVING f.`ID_FACTURE` IN ("+idFactures.join() + ")"; 
						var query = connection.query(fquery, function(err, rows) {
							if (err) throw err;
							obj.factures = rows;
							res.respond(JSON.stringify(obj), 200);
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
	

	//////////////////////
	//// FAMILLE
	//////////////////////



	router.route('/familles')
	
	.get(function(req, res) {
		console.log("--- Get All Famille --- ");
		var query = connection.query("SELECT * FROM familles ORDER BY NOM_FAMILLE ASC", function(err, rows) {
			if (err) throw err;
			var json = JSON.stringify(rows);
			res.respond(json, 200);
		});
		console.log("=> "+ query.sql);
	})

	.post(function(req, res) {
		if (req.body.operation === "Create") {
			console.log("--- Create Famille ---");
			var post  = {"NOM_FAMILLE": req.body.nomFamille, "INSCRIPTION_FAMILLE": new Date(), "PRENOM_FAMILLE": "", "ID_QUARTIER": 1};
			var query =  connection.query("INSERT INTO familles SET ?", post, function(err, info) {
				if (err) throw err;
				res.respond(200, JSON.stringify({idFamille: info.insertId}));
			});
			console.log("=> "+ query.sql);
		} else {
			res.respond(new Error('Bad/Missing Operation'), 400);
		}
		//res.send("error");
	});





	var checkFamilleMandatoryParameter= function(contact) {
		return contact["NOM_FAMILLE"] && contact["ID_FAMILLE"];
	};

	var UpdateFamilleQuery = "UPDATE familles set NOM_FAMILLE='<%= contact[\"NOM_FAMILLE\"] %>', \
	QUOTIENT_CAF_FAMILLE = <%= contact[\"QUOTIENT_CAF_FAMILLE\"] %>, QUOTIENT_MSA_FAMILLE = <%=  contact[\"QUOTIENT_MSA_FAMILLE\"] %>, ID_QUARTIER = <%= contact[\"ID_QUARTIER\"]  %>, \
	NUMERO_CAF = '<%= contact[\"NUMERO_CAF\"] %>' , NUMERO_MSA = '<%= contact[\"NUMERO_MSA\"] %>' , AVOIR_FAMILLE = <%= contact[\"AVOIR_FAMILLE\"] %> WHERE ID_FAMILLE = <%= contact[\"ID_FAMILLE\"] %>";

	var AllContactsFamilleQuery =  "SELECT  ID_FAMILLE, ID_MEMBRE, 0 AS ID_ENFANT, ID_VILLE, ID_CIVILITE, ID_QUARTIER, NOM_MEMBRE, PRENOM_MEMBRE, \
	 NAISSANCE_MEMBRE, ADR_MEMBRE, TEL1_MEMBRE, TEL2_MEMBRE, MAIL_MEMBRE, NUM_SECU_MEMBRE, NOM_EMPLOYEUR , LIEU_TRAVAIL, TELT_MEMBRE, ALLOCATAIRE_CAF, \
	 ALLOCATAIRE_MSA, INSCRIPTION_DATE, PARENT, floor(((to_days(curdate()) - to_days(`NAISSANCE_MEMBRE`)) / 365)) AS AGE_MEMBRE, ABREVIATION_CIVILITE, NOM_CIVILITE, CP_VILLE, \
	 NOM_VILLE FROM membres LEFT JOIN villes USING(ID_VILLE) LEFT JOIN civilites USING (ID_CIVILITE) WHERE ID_FAMILLE = <%= idFamille %> \
	 UNION SELECT ID_FAMILLE, ID_MEMBRE, ID_ENFANT, 0, ID_CIVILITE, 0, NOM_ENFANT, PRENOM_ENFANT, NAISSANCE_ENFANT, 0, TEL_ENFANT, 0, 0, 0, 0, 0, 0, 0, 0,\
	 INSCRIPTION_DATE, 0, floor(((to_days(curdate()) - to_days(`NAISSANCE_ENFANT`)) / 365)), ABREVIATION_CIVILITE, NOM_CIVILITE, 0, 0 from enfants LEFT JOIN civilites USING (ID_CIVILITE) WHERE ID_FAMILLE = <%= idFamille %>";

	router.route('/familles/:famille_id')
	
	.post(function(req, res) {
		if (req.body.operation === "Update") {
			console.log("--- Update Famille ---");
			for (var i in req.body.contact) {
				req.body.contact[i] = nullToEmpty(req.body.contact[i]);
			}
			if (req.body.contact && checkFamilleMandatoryParameter(req.body.contact) && req.body.contact["ID_FAMILLE"] == req.params.famille_id) {	
				var finalQuery = _.template(UpdateFamilleQuery, {
					contact: req.body.contact
				});
				if (!req.body.contact["QUOTIENT_MSA_FAMILLE"]) {
					finalQuery = finalQuery.replace("QUOTIENT_MSA_FAMILLE = ,", "QUOTIENT_MSA_FAMILLE = NULL,");
				}
				if (!req.body.contact["QUOTIENT_CAF_FAMILLE"]) {
					finalQuery = finalQuery.replace("QUOTIENT_CAF_FAMILLE = ,", "QUOTIENT_CAF_FAMILLE = NULL,");
				}
				var query =  connection.query(finalQuery, function(err) {
					if (err) throw err;
					res.respond(200);
				});
				console.log("=> "+ query.sql);
			} else {
				res.respond(new Error('Missing mandatory parameters'), 400);
			}
		} else {
			res.respond(new Error('Bad/Missing Operation'), 400);
		}
		//res.send("error");
	})
	.get(function(req, res) {
		console.log("--- Get Famille --- ");
		var finalQuery = _.template(AllContactsFamilleQuery, {idFamille:req.params.famille_id});		
		var query = connection.query(finalQuery, function(err, rows) {
			if (err) throw err;
			var membres = rows;
			var query = connection.query('SELECT * FROM `familles` WHERE ID_FAMILLE='+req.params.famille_id, function(err, rows) {
				if (err) throw err;
				rows[0].membres = membres;
				res.respond(JSON.stringify(rows[0]), 200);
			});
			console.log("=> "+ query.sql);
		});
		console.log("=> "+ query.sql);

	});
};
/*jshint multistr: true */
module.exports = function(app, connection, router){
	var _    = require('underscore'); 
	var nullToNull = function(val) {
		if (!val && val !== 0 && val !== false && val !== '') {
			return 'NULL';
		}
		return val;
	};

	router.route('/factures')
	
	.get(function(req, res) {
		connection.query('SELECT `ID_FACTURE`, `DATE_FACTURE`, `NOM_MEMBRE`, `PRENOM_MEMBRE`, NOM_TYPE_FACTURE, MONTANT_FACTURE, MONTANT_FACTURE - sum(`reglement`.`MONTANT_REGLEMENT`) AS `MONTANT_RESTANT` FROM  `factures` LEFT JOIN types_factures USING (ID_TYPE_FACTURE) LEFT JOIN membres USING (ID_MEMBRE) LEFT JOIN reglement USING (ID_FACTURE) group by `ID_FACTURE`', function(err, rows) {
			if (err) throw err;
			var json = JSON.stringify(rows);
			res.send(json);
		});

	});

	router.route('/factures/:facture_id')
	.get(function(req, res) {
		var obj = {};
		connection.query('SELECT * FROM  `factures` LEFT JOIN types_factures USING (ID_TYPE_FACTURE) LEFT JOIN membres USING (ID_MEMBRE) LEFT JOIN villes USING(ID_VILLE) LEFT JOIN civilites USING(ID_CIVILITE) WHERE (ID_FACTURE) = '+ req.params.facture_id, function(err, rows) {
			if (err) throw err;
			obj = rows[0];

			var query = "SELECT ID_FACTURE as isAdhesionAdulte, 0 as isAdhesionEnfant, 0 as isActivtie, 0 as isCL FROM `adherents_adultes` WHERE ID_FACTURE = "+req.params.facture_id+" GROUP BY(ID_FACTURE)\
						union \
						SELECT 0,ID_FACTURE, 0, 0 FROM `adherents_enfants`  WHERE ID_FACTURE = "+req.params.facture_id+" GROUP BY(ID_FACTURE) \
						union\
						SELECT 0, 0, ID_FACTURE, 0 FROM `inscriptions_activites`  WHERE ID_FACTURE = "+req.params.facture_id+" GROUP BY(ID_FACTURE)\
						union\
						SELECT 0, 0, 0, ID_FACTURE FROM `inscrits_cl`  WHERE ID_FACTURE = "+req.params.facture_id+" GROUP BY(ID_FACTURE)";
			var reglement = "SELECT * FROM  `reglement` LEFT JOIN type_reglement USING (ID_TYPE_REGLEMENT) LEFT JOIN banque USING (ID_BANQUE) WHERE ID_FACTURE = "+req.params.facture_id +" ORDER BY ID_REGLEMENT DESC";


			connection.query(reglement, function(err, rows) {
				if (err) throw err;
				obj.reglements = rows;
				connection.query(query, function(err, rows) {
					if (err) throw err;
					var table = rows[0].isAdhesionAdulte ? "adherents_adultes" : rows[0].isAdhesionEnfant ? "adherents_enfants" : rows[0].isActivtie ? "inscriptions_activites" : rows[0].isCL ? "inscrits_cl" : "";
					switch (table) {
						case 'adherents_adultes':
						case 'adherents_enfants':
							connection.query("SELECT * FROM  "+table+" WHERE (ID_FACTURE)="+ req.params.facture_id, function(err, rows) {
								if (err) throw err;
								obj.objet = rows[0];
								obj.objet.type= table === "adherents_adultes" ? "adhesionAdulte" : "adhesionEnfant";
								var json = JSON.stringify(obj);
								res.send(json);
							});
							break;
						case 'inscriptions_activites':	
							connection.query("SELECT * FROM  inscriptions_activites LEFT JOIN activites USING (ID_ACTIVITE) WHERE (ID_FACTURE)="+ req.params.facture_id, function(err, rows) {
								if (err) throw err;
								obj.objet = rows[0];
								obj.objet.type= "activite";
								var json = JSON.stringify(obj);
								res.send(json);
							});
							break;
						case 'inscrits_cl':	
							connection.query("SELECT * FROM  inscrits_cl LEFT JOIN journees_cl USING (ID_JOURNEE) LEFT JOIN sejours_cl USING (ID_SEJOUR) WHERE (ID_FACTURE)="+ req.params.facture_id +" GROUP BY (ID_FACTURE)", function(err, rows) {
								if (err) throw err;
								obj.objet = rows[0];
								obj.objet.type= "cl";
								var json = JSON.stringify(obj);
								res.send(json);
							});
							break;
						default:
							var json = JSON.stringify(obj);
							res.send(json);
							break;
					} 
				});
		});

			
		});

	})
	.post(function(req, res) {
		if (req.body.operation === "DeleteReglement" && req.body.idReglement) {
			var query = "DELETE FROM `reglement` WHERE `ID_REGLEMENT` = "+req.body.idReglement +" AND ID_FACTURE = "+req.params.facture_id;
			connection.query(query, function(err, rows) {
				if (err) throw err;
				console.log("DeleteReglement: " + req.body.idReglement);
				var json = JSON.stringify(rows);
				res.send(json);
			});
		} else if (req.body.operation === "AddReglement" && req.body.reglement) {

			var query= "INSERT INTO reglement (`ID_REGLEMENT`, `ID_BANQUE`, `ID_TYPE_REGLEMENT`, `ID_FACTURE`, `MONTANT_REGLEMENT`, `DATE_REGLEMENT`, `COMMENTAIRE_REGLEMENT`, `CHEQUE_NUM`, `CODE_ANA`) VALUES (NULL, \
			<%= reglement[\"ID_BANQUE\"] %> , <%= reglement[\"ID_TYPE_REGLEMENT\"] %>, "+req.params.facture_id+", <%= reglement[\"MONTANT_REGLEMENT\"] %>, '<%= reglement[\"DATE_REGLEMENT\"] %>', '<%= reglement[\"COMMENTAIRE_REGLEMENT\"] %>', '<%= reglement[\"CHEQUE_NUM\"] %>', '<%= reglement[\"CODE_ANA\"] %>')";
			for (var i in req.body.reglement) {
				req.body.reglement[i] = nullToNull(req.body.reglement[i]);
			}
			req.body.reglement['ID_BANQUE'] = req.body.reglement['ID_BANQUE'] || 'NULL'; 
			req.body.reglement['ID_TYPE_REGLEMENT'] = req.body.reglement['ID_TYPE_REGLEMENT'] || 'NULL'; 
			if (req.body.reglement) {	
				var finalQuery = _.template(query, {
					reglement: req.body.reglement
				});
				console.log("--- AddReglement --- ");
				connection.query(finalQuery, function(err, rows) {
					if (err) throw err;
					console.log("AddReglement: ");
					var json = JSON.stringify(rows);
					res.send(json);
				});
			}
			
		}
	});

};
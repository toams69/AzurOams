module.exports = function(app, connection, router){
	var _ = require('underscore'); 

	router.route('/configuration')
	
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
											connection.query('SELECT * FROM  `secteurs_cl`', function(err, rows) {
												if (err) throw err;
												obj.secteurs = rows;
												connection.query('SELECT * FROM  `agrementations`', function(err, rows) {
													if (err) throw err;
													obj.agrementations = rows;
													res.send(JSON.stringify(obj));
												});
											});//
										});
									});
								});
							});
						});
						
						
					});
				});
			
		});
	});

	router.route('/configuration/villes')
	
	.get(function(req, res) {		
		connection.query('SELECT * FROM  `villes`', function(err, rows) {
			if (err) throw err;
			var json = JSON.stringify(rows);
			res.send(json);
		});

	});

	router.route('/configuration/quartiers')
	
	.get(function(req, res) {		
		connection.query('SELECT * FROM  `quartiers`', function(err, rows) {
			if (err) throw err;
			var json = JSON.stringify(rows);
			res.send(json);
		});

	});

	router.route('/configuration/civilites')
	
	.get(function(req, res) {		
		connection.query('SELECT * FROM `civilites` ', function(err, rows) {
			if (err) throw err;
			var json = JSON.stringify(rows);
			res.send(json);
		});

	});
};
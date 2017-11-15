
module.exports = function(app, connection, router){
	var _ = require('underscore'); 

	router.route('/exports/adherents')
	
	.get(function(req, res) {
		var obj = {};
		connection.query('SELECT * FROM `adherents_adultes` A LEFT JOIN membres USING(ID_MEMBRE) LEFT JOIN familles USING(ID_FAMILLE) LEFT JOIN annees_association USING(ID_ANNEE) LEFT JOIN villes USING (ID_VILLE)', function(err, rows) {
			if (err) throw err;
			obj.membres = rows;
            connection.query('SELECT * FROM `adherents_enfants` A LEFT JOIN enfants USING(ID_ENFANT) LEFT JOIN familles USING(ID_FAMILLE) LEFT JOIN annees_association USING(ID_ANNEE) LEFT JOIN membres USING(ID_MEMBRE) LEFT JOIN villes USING (ID_VILLE)', function(err, rows) {
                if (err) throw err;
                obj.enfants = rows;
                connection.query('SELECT ID_ANNEE FROM `annees_association`', function(err, rows) {
                    if (err) throw err;
                    obj.annees = rows;
                    connection.query('SELECT ID_FAMILLE FROM `familles`', function(err, rows) {
                        if (err) throw err;
                        obj.familles = rows;
                        var outputArray = [];
                        var maxEnfant = 0;
                        _.each(obj.annees, function(idAnnee) {
                            idAnnee = idAnnee['ID_ANNEE'];
                            var adherentsE = _.filter(obj.enfants, function(e) {return e['ID_ANNEE'] === idAnnee});
                            var adherentsA = _.filter(obj.membres, function(e) {return e['ID_ANNEE'] === idAnnee});
                            _.each(obj.familles, function(idFamille) {
                                idFamille = idFamille['ID_FAMILLE'];
                                var _enfants = _.filter(adherentsE, function(e) {
                                    return e['ID_FAMILLE'] === idFamille
                                });
                                var _adultes = _.filter(adherentsA, function(e) {
                                    return e['ID_FAMILLE'] === idFamille
                                });
                                if (_enfants.length || _adultes.length) {
                                   var idEnfants = [];
                                    if (_adultes.length) {
                                        _.each(_adultes, function(a) {
                                            var enfs = _.filter(_enfants, function(e) { return e['ID_MEMBRE'] === a['ID_MEMBRE'];});
                                            var outputObj = {'ID_FAMILLE': idFamille, 'ID_ANNEE': idAnnee, 'ANNEE': new Date(a['DATE_DEBUT']).getFullYear() + '-' +new Date(a['DATE_FIN']).getFullYear() };
                                            outputObj['NOM_MEMBRE'] = a['NOM_MEMBRE'];
                                            outputObj['PRENOM_MEMBRE'] = a['PRENOM_MEMBRE'];
                                            outputObj['ADR_MEMBRE'] = a['ADR_MEMBRE'];
                                            outputObj['CP_VILLE'] = a['CP_VILLE'];
                                            outputObj['NOM_VILLE'] = a['NOM_VILLE'];
                                            outputObj['NUMERO_ADHERENT'] = a['NUMERO_ADHERENT'];
                                            var d = new Date(a['NAISSANCE_MEMBRE']);
                                            outputObj['NAISSANCE_MEMBRE'] = d.getDate() +'/'+ (d.getMonth() + 1) +'/' + d.getFullYear();
                                            _.each(enfs, function(e, i) {
                                                outputObj['NOM_ENFANT '+(i+1)] = e['NOM_ENFANT'];
                                                outputObj['PRENOM_ENFANT '+(i+1)] = e['PRENOM_ENFANT'];
                                                var d = new Date(e['NAISSANCE_ENFANT']);
                                                outputObj['NAISSANCE_ENFANT '+(i+1)] = d.getDate() +'/'+ (d.getMonth() + 1) +'/' + d.getFullYear(); 
                                                outputObj['NUMERO_ADHERENT_ENFANT '+(i+1)] = e['NUMERO_ADHERENT'];
                                                maxEnfant = maxEnfant > i ? maxEnfant : i;
                                                idEnfants.push(e['ID_ENFANT']);
                                            });
                                            outputArray.push(outputObj);
                                        });
                                        _enfants = _.filter(_enfants, function(e) { return idEnfants.indexOf(e['ID_ENFANT']) === -1});
                                    }
                                    _.each(_enfants, function(e) {
                                        if (idEnfants.indexOf(e['ID_ENFANT']) === -1) {
                                            var outputObj = {'ID_FAMILLE': idFamille, 'ID_ANNEE': idAnnee, 'ANNEE': new Date(e['DATE_DEBUT']).getFullYear() + '-' + new Date(e['DATE_FIN']).getFullYear() };
                                            var enfs = _.filter(_enfants, function(_e) { return _e['ID_MEMBRE'] === e['ID_MEMBRE'];});
                                            outputObj['NOM_MEMBRE'] = e['NOM_MEMBRE'];
                                            outputObj['PRENOM_MEMBRE'] = e['PRENOM_MEMBRE'];
                                            outputObj['ADR_MEMBRE'] = e['ADR_MEMBRE'];
                                            outputObj['CP_VILLE'] = e['CP_VILLE'];
                                            outputObj['NOM_VILLE'] = e['NOM_VILLE'];
                                            outputObj['NUMERO_ADHERENT'] = '';
                                            var d = new Date(e['NAISSANCE_MEMBRE']);
                                            outputObj['NAISSANCE_MEMBRE'] = d.getDate() +'/'+ (d.getMonth() + 1) +'/' + d.getFullYear();
                                            _.each(enfs, function(_e, i) {
                                                outputObj['NOM_ENFANT '+(i+1)] = _e['NOM_ENFANT'];
                                                outputObj['PRENOM_ENFANT '+(i+1)] = _e['PRENOM_ENFANT'];
                                                var d = new Date(_e['NAISSANCE_ENFANT']);
                                                outputObj['NAISSANCE_ENFANT '+(i+1)] = d.getDate() +'/'+ (d.getMonth() + 1) +'/' + d.getFullYear(); 
                                                maxEnfant = maxEnfant > i ? maxEnfant : i;
                                                outputObj['NUMERO_ADHERENT_ENFANT '+(i+1)] = _e['NUMERO_ADHERENT'];
                                                idEnfants.push(_e['ID_ENFANT']);
                                            });
                                            outputArray.push(outputObj);
                                        }
                                    });
                                }

                            });
                        });
                        var csvWriter = require('csv-write-stream');
                        var fs = require('fs');
                        var writer = csvWriter({
                            separator: ';'
                          });
                        res.setHeader("content-type", "application/octet-stream");
                        res.setHeader("Content-Disposition", "attachment; filename=export.csv");
                        writer.pipe(res);
                        _.each(outputArray, function(o) {
                            for(var i = 0; i <  maxEnfant ; i++) {
                                if (!o['NOM_ENFANT '+ (i+1)]) {
                                    o['NOM_ENFANT '+ (i+1)] = '';
                                }
                                if (!o['PRENOM_ENFANT '+ (i+1)]) {
                                    o['PRENOM_ENFANT '+ (i+1)] = '';
                                }
                                if (!o['NAISSANCE_ENFANT '+ (i+1)]) {
                                    o['NAISSANCE_ENFANT '+ (i+1)] = '';
                                }
                                if (!o['NUMERO_ADHERENT_ENFANT '+ (i+1)]) {
                                    o['NUMERO_ADHERENT_ENFANT '+ (i+1)] = '';
                                }
                            }
                            writer.write(o);
                        });
                        writer.end();
                        //res.json(outputArray);
                    });
                });
            });
        });
	});

};
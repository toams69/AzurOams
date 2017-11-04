module.exports = function(app, connection, router){
	var mysql = require('mysql');

	router.route('/agents')
	.post(function(req, res) {
		var password = req.body.password;
		var user = req.body.user;
		var query = 'SELECT * FROM personnels WHERE PASS_PERSONNEL = MD5("'+password+'") AND LOGIN_PERSONNEL="'+user+'"';
		connection.query(query, function(err, rows, fields) {
			if (err) throw err;
			if (rows.length) {
				res.json(rows[0]);
			} else {
				res.respond(new Error('Bad/Missing Operation'), 403);
			}
		});

	});
};
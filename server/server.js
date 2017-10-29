// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var fs 		   = require('fs');
var http 	   = require('http');
var morgan     = require('morgan');
var util 	   = require('util');
var log4js     = require("log4js");
var unzip      = require("unzip");
var version    = require('./version');
var request    = require('request');



// Mysql connect
var MysqlConnection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'azuroamsv1',
  password : 'password'
});

var currentVersion = version.getVersion();
var webappPath = __dirname + '/../webapp/';

log4js.configure('log4js.configuration.json');



// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(morgan('dev')); //Logger

var theAppLog 	= log4js.getLogger("file");
var HTTPLog 	= morgan({format: "tiny", stream: { write: function(str) { theAppLog.debug(str); }}});

console.log = function(d) { //
  theAppLog.debug(d + '\n');
  //log_stdout.write(util.format(d) + '\n');
};

app.use(HTTPLog);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
		// CORS
		var oneof = false;
		if(req.headers.origin) {
			res.header('Access-Control-Allow-Origin', req.headers.origin);
			res.header('Access-Control-Allow-Credentials', "true");
			oneof = true;
		}
		if(req.headers['access-control-request-method']) {
			res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
			oneof = true;
		}
		if(req.headers['access-control-request-headers']) {
			res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
			oneof = true;
		}
		if(oneof) {
			res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
		}

		// intercept OPTIONS method
		if (oneof && req.method == 'OPTIONS') {
			//res.send(200);
			next();
		}
		else {
			next();
		}
	});
//app.use(express.cookieParser('your secret here'));
//app.use(express.session());
app.use('/', express.static(webappPath));

var port = process.env.PORT || 8094; 		// set our port


// Response monkey patch
http.ServerResponse.prototype.respond = function (content, status) {
  if ('undefined' == typeof status) { // only one parameter found
    if ('number' == typeof content || !isNaN(parseInt(content))) { // usage "respond(status)"
      status = parseInt(content);
      content = undefined;
    } else { // usage "respond(content)"
      status = 200;
    }
  }
  if (status != 200) { // error
    content = {
      "code":    status,
      "status":  http.STATUS_CODES[status],
      "message": content && content.toString() || null
    };
    if ('object' != typeof content) { // wrap content if necessary
	    content = {"result":content};
	  }
	  // respond with JSON data
	  this.send(JSON.stringify(content)+"\n", status);
  
  } else {
  	this.json(content);
  }
  
};

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here
MysqlConnection.connect();


//api Extension
fs.readdir('./models', function (err, list) {
	if (err) {
		console.log(err);
		return;
	}
	list.forEach(function (file) {
		if (!fs.lstatSync('./models/' + file).isDirectory())
			return;
		require('./models/' + file +'/api-extension')(app, MysqlConnection, router);
	});
});


// UPDATE 
router.route('/version/update').get(function(req, res) {
	// First check version
	console.log("-- Udpate --");
	request.get('http://ns3305205.ip-178-32-216.eu/html/Azuroams/version.js', function (error, response, body) {
		console.log("-- File found --");
	    if (!error && response.statusCode == 200) {
	        var version = JSON.parse(body);
		       if (version["stable-version"] !== currentVersion) {
				console.log("-- New Version found --");
				var newVersion = version["stable-version"];
				var file2 = fs.createWriteStream("./versions/az-"+newVersion+".zip");
				var request = http.get(version["stable-path"], function(resp) {
				  resp.pipe(file2);
				  fs.createReadStream('./versions/az-'+newVersion+'.zip').pipe(unzip.Extract({ path: '..' }));
				});
			} else {
				console.log("-- No new Version found --");
				res.respond(200);
			}
	    }
	});
});

// UPDATE 
router.route('/version').get(function(req, res) {
	// First check version
	console.log("-- Version --");
	request.get('http://ns3305205.ip-178-32-216.eu/html/Azuroams/version.js', function (error, response, body) {
		 if (!error && response.statusCode == 200) {
	        var version = JSON.parse(body);
			res.respond(JSON.stringify({currentVersion: currentVersion, remoteVersion: version["stable-version"] }), 200);
		} else {
			res.respond(JSON.stringify({currentVersion: currentVersion, remoteVersion: currentVersion }), 200);
		}
	});
});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server Started ' + port);
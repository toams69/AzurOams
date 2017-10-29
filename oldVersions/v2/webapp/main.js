require.config({
	//enforceDefine: true,
	paths: {
		/* RequireJS plugins */
		"text": "lib/text",
		"i18n": "lib/i18n",

		/* Giraffe dependencies */
		"jquery": "lib/jquery",
        "jquery-form":"lib/jquery.form",
        "jquery-ui": 'lib/jquery-ui',
        "jquery-dataTables": 'lib/datatable/jquery.datatables.min',
        'datatable-column-resize-plugin': 'lib/datatable/datatables.column.resize.plugin',
		'dataTables-rowReordering-plugin': 'lib/datatable/jquery.dataTables.rowReordering.plugin',
		'jquery-ui.multidatespicker': 'lib/jquery-ui.multidatespicker',

		"underscore": "lib/underscore",
		"backbone": "lib/backbone",
		"bootstrap": "lib/bootstrap/js/bootstrap.min",
		"bootstrap-validator": "lib/bootstrap-validator/js/bootstrapValidator.min",
		"bootbox": "lib/bootbox.min",
		"pnotify": "lib/pnotify.custom.min",
		"scotch-panels": "lib/scotchPanels",
		"chart": "lib/Chart.min",
		'less': 'lib/less'
	
		

	},
	map: {
		'*' : {
				'az' : 'modules/az-core/az'
			}
	},
	shim: {
		"jquery": {	exports: "jQuery"},
		
        "jquery-ui": {
            exports: "jQuery.ui",
            deps: [ "jquery" ]
        },
       
		"underscore": {
			exports: "_"
		},
		"backbone": {
			exports: "Backbone",
			deps: [ "underscore", "jquery" ]
		},
		"jquery-dataTables": {
			exports: "jquery-dataTables",
			deps : [ "jquery"]
        },
        "datatable-column-resize-plugin": {
			deps: ["jquery-dataTables"]
        },
        "dataTables-rowReordering-plugin": {
			deps: ["jquery-dataTables"]
        },
		
		"bootstrap": {
			deps: [ "jquery" ],
			exports: "jQuery.fn.modal"
		},
		"bootstrap-validator": {
			deps: [ "bootstrap", "jquery-ui" ]
		},

		"bootbox": {
			deps: [ "bootstrap", "jquery" ]
		},
		
		"pnotify": {
			deps: [ "jquery-ui" ],
			exports: "jQuery.fn.pnotify"
		},

		"jquery-ui.multidatespicker": {
			deps: [ "bootstrap", "jquery-ui" ]
		},

		"scotch-panels": {
			deps: ["jquery-ui"]
		}
		
	},
	config: {
		// i18n: {
		// 	locale: localStorage.getItem('wwe-locale') || 'en-us'
		// },
		text: {
			useXhr: function (url, protocol, hostname, port) {
				//Override function for determining if XHR should be used.
				//url: the URL being requested
				//protocol: protocol of page text.js is running on
				//hostname: hostname of page text.js is running on
				//port: port of page text.js is running on
				//Use protocol, hostname, and port to compare against the url
				//being requested.
				//Return true or false. true means "use xhr", false means
				//"fetch the .js version of this resource".
				return true;
			}
		}
	},
	waitSeconds:120
});

less = {
	relativeUrls: true
};


define('main', [
	'jquery-ui' 
	, 'underscore'
	, 'pnotify'
	, 'chart'
	, 'less'
	, 'bootstrap'
	, 'bootstrap-validator'
	, 'backbone'
	, 'bootbox'
	, 'scotch-panels'
	
	
], function(
	$, _, pnotify, Chart
) {
	"use strict";
	var Chartjs = Chart.noConflict();
	//PNotify.prototype.options.delay = 1000;

	require(["modules/az-core/controller", "modules/az-contact/controller", "modules/az-admin/controller", "modules/az-clsh/controller", "modules/az-activite/controller",  "modules/az-facture/controller"],
	 function(MainController, ContactController, AdminController, CLSHController, ActiviteController, FactureController) {
		new ContactController();
		new AdminController();

		new CLSHController();
		new ActiviteController();
		new FactureController();

		var controller = new MainController();
	});
	
});

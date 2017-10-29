/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          activite.js
 */


define([
	'underscore', 'backbone'
], function(_, Backbone) {

	var Activite = Backbone.Model.extend({

		defaults: {
			"membres":					new Backbone.Collection()
		},

		initialize: function() { 
		}

	});

	return Activite;
});

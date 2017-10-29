/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact.js
 */


define([
	'underscore', 'backbone'
], function(_, Backbone) {

	var Contact = Backbone.Model.extend({

		defaults: {
			"adhesions":					new Backbone.Collection(),
			"activites":					new Backbone.Collection(),
			"factures": 					new Backbone.Collection(),
			"parents":     					new Backbone.Collection()
		},

		initialize: function() { 
		}

	},{
		
		Type:
		{
			ADULTE:				"ADULTE"
			, ENFANT:			"ENFANT"
			//...
		}
	});

	return Contact;
});

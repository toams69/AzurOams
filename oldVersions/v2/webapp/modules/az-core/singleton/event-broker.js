/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          event-broker.js
 */

define([
	'backbone'
], function(
	Backbone
) {
	/**
	 * The eventBroker object is a singleton and an instance of the class {@link external:"Backbone.Events"}.
	 * @name eventBroker
	 * @global
	 */
	return _.extend({}, Backbone.Events);
});
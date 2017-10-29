/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          clsh-presence.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./clsh-presence.tpl.html',
	'i18n!../../nls/strings',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, az
) {

	var log = new az.Log("CLSHPresenceView");
	var CLSHPresenceView = Backbone.View.extend({
		id: "azCLSHInformation",
		className: "az-clsh-presence",

		initialize: function() {
			log.debug("initialize");
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			return this;
		},

		loading: function() {
			$(this.el).addClass("loading");
		},
		
		setCLSH: function(clsh) {

		},
		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			log.debug("remove");
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		events: {
		
		}
	});

	return CLSHPresenceView;
});

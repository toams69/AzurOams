/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          admin-desktop.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./admin-desktop.tpl.html',
	'i18n!../../nls/strings',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, az
) {
	
	var AdminDesktopView = Backbone.View.extend({

		initialize: function() {
			return this;
		},

		render: function() {
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			return this;
		},

		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		events: {
		
		}
	});

	return AdminDesktopView;
});

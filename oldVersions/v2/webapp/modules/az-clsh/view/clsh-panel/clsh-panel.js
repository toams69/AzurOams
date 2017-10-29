/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          clsh-panel.js
 */

define([
	'jquery', 'underscore',	'backbone',
	'az',
	'i18n!../../nls/strings',
	'text!./clsh-panel.tpl.html'
	//'../../singleton/clsh-manager'
], function($, _, Backbone,
		az,
		i18n,
		template
		//clshManager
		
	) {

	var log = new az.Log("CLSHPanelView");

	var CLSHPanelView = Backbone.View.extend({

		className: "az-clsh-panel",
		id: "azCLSHPanel",

		initialize: function() {
			_.bindAll(this, 'setCLSH');
			this.clsh = null;

			this.viewDecriptors = az.viewManager.get("CLSHPanel") ? az.viewManager.get("CLSHPanel") : [];
			this.views = [];
			
			this.initializeSubViews();
			// integration with interaction or clsh
			// if (this.options.clsh) {
			// 	if (this.options.clsh instanceof Contact) {
			// 		this.clsh = this.options.clsh;
			// 	}
			// }
			return this;
		},

		initializeSubViews: function() {
			this.views = [];
			_.each(this.viewDecriptors, function(viewDecriptor, i) {
				var options = viewDecriptor.options  ? viewDecriptor.options : {};
				options.clsh = this.clsh;
				options.id = this.id;
				var view = new viewDecriptor.view(options);
				view.title = viewDecriptor.title;
				view.on("clshUpdated", this.onSubviewContactUpdatedHandler, this);
				view.on("clshCreated", this.onSubviewContactCreatedHandler, this);
				this.views.push(view);
			}, this);
		},

		onSubviewContactUpdatedHandler: function(clsh) {
			// trigger an event to reload parent view
			this.trigger("clshUpdated", clsh);
		},

		onSubviewContactCreatedHandler: function(clsh) {
			// trigger an event to reload parent view
			this.trigger("clshCreated", clsh);
		},

		reloadCLSH: function() {
			if (this.clsh) {
				this.loading();
				// clshManager.getFullContact(this.clsh).then(_.bind(function(clsh) {
				// 	this.setCLSH(clsh);
				// },this));
			}
		},

		setCLSH: function(newCLSH, selectFirstTab) {
			log.debug("setCLSH()");
			if (selectFirstTab) { // If new clsh select the first Tab 
				$(".az-tab-header:first>.az-tab-top", this.el).removeClass("active");
				$(".az-tab-content:first>.az-tab-panel", this.el).removeClass("active");
				$("#" + this.id + "Tabs li:first, #" + this.id + "Panels div:first", this.el).addClass('active');
			}
			_.each(this.views, function(view) {
				if (typeof view.setCLSH === "function") {
					view.setCLSH(newCLSH);
				}
			}, this);
		},

		loading: function() {
			_.each(this.views, function(view) {
				if (typeof view.loading === "function") {
					view.loading();
				}
			}, this);
		},

		render: function() {
			var compiledTemplate = _.template(template, { i18n: i18n, id: this.id });
			$(this.el).html(compiledTemplate);
			this.renderSubView();
			return this;
		},

		renderSubView: function() {
			_.each(this.views, function(view, i) {
				var idPanel = this.id+'PanelsItem' + i;
				$("#" + this.id + "Tabs", this.el).append($("<li>").addClass('az-tab-top').append($("<button>").attr("data-toggle", "tab").attr("href", "#"+idPanel).text(view.title)));
				$("#" + this.id + "Panels", this.el).append($("<div>").addClass('az-tab-panel').addClass('az-case-tab-content').addClass('tab-pane').attr('id', idPanel).append(view.render().el));
			}, this);

			$("#" + this.id + "Tabs button", this.el).on('shown.bs.tab', _.bind(function (e) {
				var indexOfSubview = $("#" + this.id + "Tabs button", this.el).index($(e.target));
				if (indexOfSubview > -1 && indexOfSubview < this.views.length) {
					this.views[indexOfSubview].$el.trigger("shown");
				}
			}, this));
			$("#" + this.id + "Tabs li:first, #" + this.id + "Panels div:first", this.el).addClass('active');
		},

		/**
		* Cleanup the view and remove it from the DOM
		* @override
		*/
		remove: function() {
			_.each(this.views, function(view) {
				view.off("clshCreated", this.onSubviewContactCreatedHandler, this);
				view.off("clshUpdated", this.onSubviewContactUpdatedHandler);
				view.remove();
			}, this);

			if (this.clsh) {
				this.clsh.get("factures").off("reload", this.reloadCLSH, this);
				this.clsh.off("reload", this.reloadCLSH, this);
			}
			
			this.views = [];
			
			if(this.el) {
				this.undelegateEvents();
				$(this.el).removeData().unbind();
				Backbone.View.prototype.remove.call(this);
				
				this.options = null;
				this.el = null;
				this.$el = null;
			}
			
			return this;
		}

	});

	return CLSHPanelView;
});

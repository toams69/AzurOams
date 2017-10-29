/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-desktop.js
 */

define([
	'jquery', 'underscore',	'backbone',
	'az',
	'i18n!../../nls/strings',
	'text!./contact-panel.tpl.html',
	'../../model/contact',
	'../../singleton/contact-manager'
], function($, _, Backbone,
		az,
		i18n,
		template,
		Contact,
		contactManager
		
	) {

	var log = new az.Log("ContactPanelView");

	var ContactPanelView = Backbone.View.extend({

		className: "az-contact-panel",
		id: "azContactPanel",

		initialize: function() {
			_.bindAll(this, 'setContact');
			this.contact = null;

			this.viewDecriptors = az.viewManager.get("ContactPanel") ? az.viewManager.get("ContactPanel") : [];
			this.views = [];
			
			this.initializeSubViews();
			// integration with interaction or contact
			// if (this.options.contact) {
			// 	if (this.options.contact instanceof Contact) {
			// 		this.contact = this.options.contact;
			// 	}
			// }
			return this;
		},

		initializeSubViews: function() {
			this.views = [];
			_.each(this.viewDecriptors, function(viewDecriptor, i) {
				var options = viewDecriptor.options  ? viewDecriptor.options : {};
				options.contact = this.contact;
				options.id = this.id;
				var view = new viewDecriptor.view(options);
				view.title = viewDecriptor.title;
				view.on("contactUpdated", this.onSubviewContactUpdatedHandler, this);
				view.on("contactCreated", this.onSubviewContactCreatedHandler, this);
				this.views.push(view);
			}, this);
		},

		onSubviewContactUpdatedHandler: function(contact) {
			// trigger an event to reload parent view
			this.trigger("contactUpdated", contact);
		},

		onSubviewContactCreatedHandler: function(contact) {
			// trigger an event to reload parent view
			this.trigger("contactCreated", contact);
		},

		reloadContact: function() {
			if (this.contact) {
				this.loading();
				contactManager.getFullContact(this.contact).then(_.bind(function(contact) {
					this.setContact(contact);
				},this));
			}
		},

		setContact: function(newContact, selectFirstTab) {
			log.debug("setContact()");
			if (this.contact) {
				this.contact.get("factures").off("reload", this.reloadContact, this);
				this.contact.off("reload", this.reloadContact, this);
			}
			this.contact = newContact;
			if (this.contact) {
				this.contact.get("factures").on("reload", this.reloadContact, this);
				this.contact.on("reload", this.reloadContact, this);
			}
			if (selectFirstTab) { // If new contact select the first Tab 
				$(".az-tab-header:first>.az-tab-top", this.el).removeClass("active");
				$(".az-tab-content:first>.az-tab-panel", this.el).removeClass("active");
				$("#" + this.id + "Tabs li:first, #" + this.id + "Panels div:first", this.el).addClass('active');
			}
			_.each(this.views, function(view) {
				if (typeof view.setContact === "function") {
					view.setContact(newContact);
				}
			}, this);
		},

		askToSave: function() {
			var test = false;
			_.each(this.views, function(view, index) {
				if (view.askToSave) {
						test = true;
					}
			}, this);
			return test;
		},

		save: function() {
			var test = true;
			_.each(this.views, function(view, index) {
				if (view.askToSave && typeof view.save === "function") {
					if (!view.save()) {
						test = false;
					}
				}
			}, this);
			return test;
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
				view.off("contactCreated", this.onSubviewContactCreatedHandler, this);
				view.off("contactUpdated", this.onSubviewContactUpdatedHandler);
				view.remove();
			}, this);

			if (this.contact) {
				this.contact.get("factures").off("reload", this.reloadContact, this);
				this.contact.off("reload", this.reloadContact, this);
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

	return ContactPanelView;
});

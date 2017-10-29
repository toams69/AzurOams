/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-desktop.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./contact-desktop.tpl.html',
	'i18n!../../nls/strings',
	'../contact-list/contact-list',
	'../contact-panel/contact-panel',
	'../../singleton/contact-manager',
	'../ajout-contact/ajout-contact-dialog',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, ContactListView
	, ContactPanelView
	, contactManager
	, AjoutContactDialog
	, az
) {
	
	var log = new az.Log("ContactDesktopView");
	var ContactDesktopView = Backbone.View.extend({

		id: "azContactDesktop",
		className: "az-contact-directory",

		initialize: function() {
			log.debug("initialize");
			_.bindAll(this, 'onResize');
			
			// Constant for resizing
			this.minWidthLeftPanel = 370;
			this.minWidthRightPanel = 400;
			this.minHeightRightPanel = 100;
			this.minHeightLeftPanel = 100;
			this.splitterWidth = 0;

			this.initializeSubviews();
			this.contacts = contactManager.get("contactList");
			
			return this;
		},


		refreshContacts: function() {
			log.debug("refresh");
			//this.contactListView.loading();
			return contactManager.getContacts(true).then(_.bind(function() {
				this.contactListView.setContactList(this.contacts);
				if (this.contactSelected) {
					this.contactListView.selectContact(this.contactSelected);
				}
			}, this));
		},

		render: function() {
			log.debug("render");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			$(window).on('resize', _.bind(this.onWindowResize, this));
			this.renderSubviews();
			this.displayContactPanelToRight();
			this.refreshContacts();
			return this;
		},

		initializeSubviews: function() {
			log.debug("initializeSubviews");
			this.contactListView = new ContactListView();
			this.contactPanelView = new ContactPanelView();
			this.contactListView.on("contactSelected", this.onContactSelected, this);
		},

		renderSubviews: function() {
			log.debug("renderSubviews");
			this.contactListView.render();
			$(".az-contact-directory-result-grid", this.el).html(this.contactListView.el);
			this.contactListView.setContactList(this.contacts);
			this.contactPanelView.render();
			$(".az-contact-directory-bottom", this.el).html(this.contactPanelView.el);
		},

		onContactSelected: function(contact) {
			if (contact) {
				this.contactPanelView.loading();
				contactManager.getFullContact(contact).then(_.bind(function(contact) {
					this.contactSelected = contact;
					this.contactPanelView.setContact(contact);
				},this));
			}
		},

		displayContactPanelToRight: function(e) {
			log.debug("displayContactPanelToRight");
			if (this.isResizable)
				$(".az-contact-directory-top", this.el).resizable("destroy");

			$(".az-contact-directory-search-toolbar .display-vertical", this.el).hide();
			$(".az-contact-directory-search-toolbar button.display-horizontal", this.el).hide();
			$(".az-contact-directory-search-toolbar .hide-panel", this.el).show();
			$("li.display-horizontal", this.el).show();
			$(".az-contact-directory-bottom", this.el).attr('style', '').show().addClass("right");
			$(".az-contact-directory-top", this.el).attr('style', '').removeClass("maximize").addClass("left");
			this.displayMode = "vertical";
			// Set resizable
			$(".az-contact-directory-top", this.el).resizable({handles: 'e', minWidth: this.minWidthLeftPanel, resize: this.onResize});
			this.isResizable = true;
			
		},

		// Handler Method to fit panel with windows
		onWindowResize: function(e) {
			log.debug("onWindowResize");
			if (e.target === window) { // Only if resize come from window
				this.onResize(true);
			}
		},

		onResize: function(isResizingWindow) {
			log.debug("onResize");
			var $parent = $(this.el),
				$firstPanel = $(".az-contact-directory-top", this.el),
				$secondPanel = $(".az-contact-directory-bottom", this.el),
				remainingWidth = $parent.width() - $firstPanel.outerWidth() - this.splitterWidth,
				remainingHeigt = $parent.height() - $firstPanel.outerHeight() - this.splitterWidth;
			if($parent.width() > 0) {
				if(isResizingWindow && $firstPanel.outerWidth() < this.minWidthLeftPanel) {
					$firstPanel.outerWidth(this.minWidthLeftPanel);
					remainingWidth = $parent.width() - this.minWidthLeftPanel;
				} else if(remainingWidth < this.minWidthRightPanel) {
					$firstPanel.outerWidth(remainingWidth = $parent.width() - this.minWidthRightPanel - this.splitterWidth);
				}
				$secondPanel.css({
					left: $firstPanel.outerWidth() + this.splitterWidth,
					bottom: 0
				});
			} else {
				$firstPanel.removeAttr("style");
				$secondPanel.removeAttr("style");
			}
			$firstPanel.css("height", "");	
		},

		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			log.debug("remove");
			this.contactListView.off("contactSelected", this.onContactSelected, this);
			$(window).off('resize', this.onWindowResize);
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		inputAreaKeyUp: function() {
			log.debug("inputAreaKeyUp");
			this.contactListView.filter($(".az-contact-directory-top input", this.el).val());
		},

		addContactClicked: function() {
			var view = new AjoutContactDialog();
			var $modal = view.render().$el;
			$modal.modal({"backdrop": "static", "keyboard": true});
			view.on("saved", _.bind(function(idMembre) {
				$(".az-contact-directory-top input", this.el).val(view.$(".contact_nom_part input").val() + " " + view.$(".contact_prenom_part input", this.el).val());
				this.inputAreaKeyUp();
				this.refreshContacts().then(_.bind(function() {
					var find = this.contacts.find(function(c) {	return c.get("ID_MEMBRE") === idMembre;});
					this.contactListView.selectContact(find);
				}, this));
				setTimeout(_.bind(function() {
					$modal.modal('hide');
					view.remove();
					$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();
				}, this), 1000);
				
			}, this));
		},

		events: {
			"click .btn.add-contact" : "addContactClicked",
			//"keydown .az-contact-directory-top input": "textboxKeypress",
			"input .az-contact-directory-top input" : "inputAreaKeyUp",
			"click .az-contact-directory-search-toolbar .refresh-contact": "refreshContacts"
		}
	});

	return ContactDesktopView;
});

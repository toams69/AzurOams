/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          clsh-desktop.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./clsh-desktop.tpl.html',
	'i18n!../../nls/strings',
	'../clsh-panel/clsh-panel',
	'../clsh-list/clsh-list',
	'../../singleton/clsh-manager',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, CLSHPanelView
	, CLSHListView
	, clshManager
	, az
) {
	
	var log = new az.Log("CLSHDesktopView");
	var CLSHDesktopView = Backbone.View.extend({
		id: "azCLSHDesktop",
		className: "az-clsh-directory",

		initialize: function() {
			log.debug("initialize");
			_.bindAll(this, 'onResize');
			
			// Constant for resizing
			this.minWidthLeftPanel = 370;
			this.minWidthRightPanel = 400;
			this.minHeightRightPanel = 100;
			this.minHeightLeftPanel = 100;
			this.splitterWidth = 0;

			//this.clshList = clshManager.get("clshList");
			this.initializeSubviews();
		},

		initializeSubviews: function() {
			log.debug("initializeSubviews");
			this.clshListView = new CLSHListView();
			this.clshPanelView = new CLSHPanelView();
			this.clshListView.on("CLSHSelected", this.onCLSHSelected, this);
		},

		onCLSHSelected: function(clsh) {
			this.selectedCLSH = clsh;
			clshManager.getSejour(clsh.get("ID_SEJOUR")).then(_.bind(function(clsh) {
				this.clshPanelView.setCLSH(clsh);
			}, this));
		},

		render: function() {
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			this.renderSubviews();
			this.displayContactPanelToRight();
			return this;
		},

		renderSubviews: function() {
			log.debug("renderSubviews");
			this.clshListView.render();
			$(".az-clsh-directory-result-grid", this.el).html(this.clshListView.el);
			// this.clshListView.setCLSHList(this.clshList);
			this.clshPanelView.render();
			$(".az-clsh-directory-bottom", this.el).html(this.clshPanelView.el);
		},

		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			this.clshPanelView.remove();
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		displayContactPanelToRight: function(e) {
			log.debug("displayContactPanelToRight");
			if (this.isResizable)
				$(".az-clsh-directory-top", this.el).resizable("destroy");

			$(".az-clsh-directory-search-toolbar .display-vertical", this.el).hide();
			$(".az-clsh-directory-search-toolbar button.display-horizontal", this.el).hide();
			$(".az-clsh-directory-search-toolbar .hide-panel", this.el).show();
			$("li.display-horizontal", this.el).show();
			$(".az-clsh-directory-bottom", this.el).attr('style', '').show().addClass("right");
			$(".az-clsh-directory-top", this.el).attr('style', '').removeClass("maximize").addClass("left");
			this.displayMode = "vertical";
			// Set resizable
			$(".az-clsh-directory-top", this.el).resizable({handles: 'e', minWidth: this.minWidthLeftPanel, resize: this.onResize});
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
				$firstPanel = $(".az-clsh-directory-top", this.el),
				$secondPanel = $(".az-clsh-directory-bottom", this.el),
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
			//this.clshListView.off("CLSHSelected", this.onCLSHSelected, this);
			$(window).off('resize', this.onWindowResize);
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		onInputChanged: function() {
			if (this.clshListView) {
				this.clshListView.filter($(".az-clsh-directory-input-container input").val());
			}
		},

		events: {
			"input .az-clsh-directory-input-container input": 'onInputChanged'
		}
	});

	return CLSHDesktopView;
});

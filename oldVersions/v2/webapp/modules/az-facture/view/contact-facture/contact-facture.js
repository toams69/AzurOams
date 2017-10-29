/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-facture.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./contact-facture.tpl.html',
	'i18n!../../nls/strings',
	'../facture-list/facture-list',
	'../../singleton/facture-manager',
	'../page-facture/page-facture',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, FactureListView
	, factureManager
	, PageFactureView
	, az
) {

	var log = new az.Log("ContactFactureView");
	var ContactFactureView = Backbone.View.extend({
		id: "azContactFacture",
		className: "az-contact-facture",

		initialize: function() {
			_.bindAll(this, 'onResize', 'onWindowResize');
			log.debug("initialize");

			this.viewDecriptors = az.viewManager.get("ContactFacturePanel") ? az.viewManager.get("ContactFacturePanel") : [];
			this.views = [];
			this.initializeSubViews();
			this.id = "azContactFacture";
			this.minHeightTopPanel = 185;
			this.minHeightBottomPanel = 140;
			this.splitterHeight = 0;
			return this;
		},

		initializeSubViews: function() {
			this.factureListView = new FactureListView({gridColumns: [{id: "ID_FACTURE", title:i18n.facture_grid_id_label},{id: "DATE_FACTURE", title:i18n.facture_grid_date_label},
			{id: "MONTANT_FACTURE", title:i18n.facture_grid_montant_label}, {id: "NOM_TYPE_FACTURE", title:i18n.facture_grid_type_label}, {id: "MOTIF_FACTURE", title:i18n.facture_grid_motif_label}, 
			{id: "STATUT", title: ""}]});
		
	
			this.factureListView.on("factureSelected", this.onFactureSelected, this);
			this.views = [];
			_.each(this.viewDecriptors, function(viewDecriptor) {
				var options = viewDecriptor.options  ? viewDecriptor.options : {};
				options.facture = this.facture;
				options.id = this.id;
				var view = new viewDecriptor.view(options);
				view.title = viewDecriptor.title;
				view.on("contactUpdated", this.onSubviewContactUpdatedHandler, this);
				view.on("contactCreated", this.onSubviewContactCreatedHandler, this);
				this.views.push(view);
			}, this);


		},

		onFactureSelected: function(facture) {
			_.each(this.views, function(view) {
				if (typeof view.loading === "function") {
					view.loading();
				}
			}, this);
			if (facture) {
				factureManager.getFacture(facture.get("ID_FACTURE")).then(_.bind(function(f) {
					this.setFacture(f);
				},this));
			} else {
				this.setFacture(null);
			}
		},

		reloadFacture: function() {
			if (this.contact) {
				this.contact.get("factures").trigger("reload");
			}
			this.onFactureSelected(this.factureSelected);
		},

		setFacture: function(facture) {
			if (this.factureSelected) {
				this.factureSelected.off("reload", this.reloadFacture, this);
			}
			this.factureSelected = facture;
			if (this.factureSelected) {
				this.factureSelected.on("reload", this.reloadFacture, this);
			}
			_.each(this.views, function(view) {
				if (typeof view.setFacture === "function") {
					view.setFacture(this.factureSelected);
				}
			}, this);
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n, id: this.id });
			this.$el.html(tpl);
			this.renderSubViews();

			$(this.el).on("shown", _.bind(function(e) {
				if (e.target !== this.el) {
					e.stopPropagation();
					e.preventDefault();
					return;
				}
				if (this.factureListView) {
					this.factureListView.$el.trigger("shown");
				}
			}, this));
			$(".middle-area", this.el).resizable({handles: 's', minHeight: this.minHeightTopPanel, resize: this.onResize});
			this.displayDetailPanelToBottom();

			return this;
		},

		renderSubViews: function() {
			this.factureListView.render();
			$(".contact-facture-list-area", this.el).html(this.factureListView.el);

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


		// Handler Method to fit panel with windows
		onWindowResize: function(e) {
			if (e.target === window) { // Only if resize come from window
				setTimeout(_.bind(function() {
					this.onResize(true);
				}, this), 100);
			}
		},

		onResize: function(isResizingWindow) {
			var $parent = $(this.el),
				$firstPanel = $(".middle-area", this.el),
				$secondPanel = $(".bottom-area", this.el),
				remainingHeigt = $parent.height() - $firstPanel.outerHeight() - this.splitterHeight;

			if($parent.height() > 0) {
				if(isResizingWindow && $firstPanel.outerHeight() < this.minHeightTopPanel) {
					$firstPanel.outerHeight(this.minHeightTopPanel);
					remainingHeigt = $parent.height() - this.minHeightTopPanel;
				} else if(remainingHeigt < this.minHeightBottomPanel) {
					$firstPanel.outerHeight(remainingHeigt = $parent.height() - this.minHeightBottomPanel - this.splitterHeight);
				}
				$secondPanel.css({
					top: $firstPanel.outerHeight() + this.splitterHeight
				});
			}
			this.factureListView.updateDataTableDisplay();
			$firstPanel.css("width", "");
		},


		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			log.debug("remove");
			if (this.factureSelected) {
				this.factureSelected.off("reload", this.reloadFacture, this);
			}
			this.factureListView.off("factureSelected", this.onFactureSelected, this);
			this.factureListView.remove();
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		events: {
			"click .btn-print": "imprimerFacture"
		},

		imprimerFacture: function() {
			var pageFacture = new PageFactureView({facture: this.factureSelected, contact: this.contact});
			pageFacture.render();
			az.Utils.print(pageFacture.$el);
		},

		loading: function() {
			log.debug("loading");
			$(this.el).addClass("loading");
			this.factureListView.setFactureList(null);
			_.each(this.views, function(view) {
				if (typeof view.setFacture === "function") {
					view.setFacture(null);
				}
			}, this);
		},

		setContact: function(contact) {
			$(this.el).removeClass("loading");
			this.contact = contact;
			this.factureListView.setFactureList(contact.get("factures"));
		},

		hideDetailPanel: function() {
			$(".az-contact-facture-toolbar .hide-panel", this.el).hide();
			$(".az-contact-facture-toolbar .display-horizontal", this.el).show();
			$(".middle-area", this.el).addClass("maximize");
			$(".bottom-area", this.el).hide();
			this.factureListView.updateDataTableDisplay();
		},

		displayDetailPanelToBottom: function() {
			$(".az-contact-facture-toolbar .hide-panel", this.el).show();
			$(".az-contact-facture-toolbar .display-horizontal", this.el).hide();
			$(".middle-area", this.el).removeClass("maximize");
			$(".bottom-area", this.el).show();
			this.factureListView.updateDataTableDisplay();
		}
	});

	return ContactFactureView;
});

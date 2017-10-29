/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          desktop.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./desktop.tpl.html',
	'i18n!../../nls/strings',
	'../../model/logger',
	'../../singleton/view-manager',
	'../../singleton/agent',
	'../../singleton/configuration',
	'../../singleton/event-broker',
	'bootbox'
], function(
	$, _, Backbone
	, template
	, i18n
	, Log
	, viewManager
	, user
	, configuration
	, eventBroker
	, bootbox
) {
	var log = new Log("DesktopView");
	var DesktopView = Backbone.View.extend({

		initialize: function() {
			log.debug("initialize");
			this.views = [];
			this.viewDecriptors = viewManager.get("DesktopRegion") ? viewManager.get("DesktopRegion") : [];
			this.viewDecriptors = _.sortBy(this.viewDecriptors, function (view) {
				return view.order ? view.order : Number.MAX_VALUE;
			});
			this.initializeSubviews();

			// Alert Global
			eventBroker.on("notif", this.onNotify, this);
		},

		render: function() {
			log.debug("render");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			this.renderSubviewsButton();
			$(".download-link", this.el).hide();
			$(".user-info",this.el).text(user.get("NOM_PERSONNEL")+ " "+ user.get("PRENOM_PERSONNEL"));

			if (configuration.get("version") != configuration.get("remoteVersion")) {
				setTimeout(function() {
					$(".download-link", this.el).show();
					eventBroker.trigger("notif", {type: "alert", title: 'Nouvelle version disponible', msg: 'Une Nouvelle version de Azuroams est disponible ! ^_^'});
				}, PNotify.prototype.options.delay);
			}
			$('.quick-link ul li:first', this.el).click();
			$('.quick-link').scotchPanel({
                containerSelector: '.desktop',
                direction: 'left',
                duration: 300,
                transition: 'ease',
                //hoverSelector: '.menu-link, .quick-link',
                clickSelector: '.menu-link, .quick-link li',
                distanceX: '300px',
                enableEscapeKey: true
            });
		},

		initializeSubviews: function() {
			log.debug("initializeSubviews");
			_.each(this.viewDecriptors, function(viewDecriptor) {
				var view = new viewDecriptor.view(viewDecriptor.options);
				view.title = viewDecriptor.title;
				view.isDefault = viewDecriptor.isDefault;
				view.icon = viewDecriptor.icon;
				this.views.push(view);
			}, this);
		},

		renderSubviewsButton: function() {
			log.debug("renderSubviewsButton");
			$(".quick-link ul", this.el).empty();
			_.each(this.views, function(view) {
				var $li = $("<li></li>").addClass("link").attr("title", view.title);
				var $icon = $("<i></i>").addClass("fa").addClass(view.icon).addClass("fa-2x");
				var $text = $("<span></span>").text(view.title);
				$(".quick-link ul", this.el).append($li.append($icon).append($text));
				$li.on("click", _.bind(function() {
					$(".quick-link li", this.el).removeClass("active");
					$li.addClass("active");
					this.displayView(view);
					$(".current-link", this.el).empty().append($("<i></i>").addClass("fa").addClass(view.icon)).append($("<div></div>").text(view.title));
				}, this));
			}, this);
		},

		displayView: function(view) {
			log.debug("displayView");
			_.each(this.views, function(v) {
				if (v.isRendered) {
					v.$el.hide();
				}
			}, this);
			if (!view.isRendered) {
				$(".desktop-container", this.el).append(view.render().el);
				view.isRendered = true;
			}
			view.$el.show();
			if (typeof view.refresh === "function") {
				view.refresh();
			}
		},

		/**
		* notif.level [info|alert|error|success]
		* notif.msg message
		* notif.title title
		*/
		onNotify: function(notif) {
			if (notif) {
				new PNotify({
					title: notif.title,
					text: notif.msg,
					type: notif.level,
					styling: 'bootstrap3'
				});
			}
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
			"click .exit-link": 'exitClicked',
			"click .download-link": 'updateClicked'
		},

		doLogin: function () {
		
		},

		exitClicked: function() {
			location.reload();
		},

		updateClicked: function() {
			bootbox.confirm(i18n.mettre_a_jour_confirmation, _.bind(function(result) {
				if (result) {
					log.debug("update App");
					configuration.upload().then(function() {
						setTimeout(function() {
							location.reload();
						});
					});
				}
			}, this));
		},

		showMainPage: function(data) {
		
		},

		handleError: function(data) {
		
		}
	});

	return DesktopView;
});

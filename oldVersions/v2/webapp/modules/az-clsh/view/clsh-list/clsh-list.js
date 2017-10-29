/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          clsh-list.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./clsh-list.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/clsh-manager',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, clshManager
	, az
) {

	var log = new az.Log("CLSHListView");
	var CLSHListView = Backbone.View.extend({
		id: "azCLSHList",
		className: "az-clsh-list",

		initialize: function() {
			log.debug("initialize");
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			clshManager.getSecteurs().then(_.bind(function(data) {
				this.setSecteursList(data);
			}, this));
			return this;
		},

		setSecteursList: function(secteurs) {
			$(".secteursList", this.el).empty();
			secteurs.each(function(s) {
				var $li = $("<li></li>").addClass("secteurTitle open").html('<i class="fa fa-folder-open"></i>'+s.get("NOM_SECTEUR"));
				var $ul = $("<ul></ul>").addClass("sejoursList").attr("data-secteur-id", s.get("ID_SECTEUR"));
				$(".secteursList", this.el).append($li.append($ul));
				$("i", $li).on("click", function() {
					if ($("i", $li).hasClass("fa-folder-open")) {
						$("i", $li).removeClass("fa-folder-open").addClass("fa-folder");
					} else {
						$("i", $li).removeClass("fa-folder").addClass("fa-folder-open");
					}
					$ul.toggle();
				});
			}, this);
			clshManager.getSejours().then(_.bind(function(data) {
				this.sejours = data;
				this.setSejoursList(data);
			}, this));
		},

		filter: function(filter) {
			this._filter = filter;
			this.setSejoursList(this.sejours);
		},

		setSejoursList: function(sejours) {
			$(".secteursList .sejoursList", this.el).empty();
			if (!sejours)
				return;
			sejours.each(function(s) {
				if (!this._filter || (s.get("NOM_SEJOUR") && s.get("NOM_SEJOUR").indexOf(this._filter) !== -1)) {
					var $li = $("<li></li>").addClass("sejourTitle").text(s.get("NOM_SEJOUR"));
					$(".secteursList .sejoursList[data-secteur-id='"+s.get("ID_SECTEUR")+"']", this.el).append($li);
					$li.on("click", _.bind(function() {
						$(".secteursList .sejourTitle", this.el).removeClass("active");
						$li.addClass("active");
						this.selectedSejour = s;
						this.trigger("CLSHSelected", this.selectedSejour);
					}, this));
				}
			}, this);
		},

		loading: function() {
			$(this.el).addClass("loading");
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

	return CLSHListView;
});

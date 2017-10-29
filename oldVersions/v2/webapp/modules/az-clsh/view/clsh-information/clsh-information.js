/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          clsh-information.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./clsh-information.tpl.html',
	'i18n!../../nls/strings',
	'az',
	"jquery-ui.multidatespicker"
], function(
	$, _, Backbone
	, template
	, i18n
	, az
) {

	var log = new az.Log("CLSHInformationView");
	var CLSHInformationView = Backbone.View.extend({
		id: "azCLSHInformation",
		className: "az-clsh-information",

		initialize: function() {
			log.debug("initialize");
			_.bindAll(this, 'onDateSelected');
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n, id: this.id });
			this.$el.html(tpl);
			$(".az-clsh-information-secteur select", this.el).empty();
			$(".az-clsh-information-secteur select", this.el).append($("<option>", {value: 0, text: "---"}).text("---"));
			az.configuration.get("secteurs").each(function(secteur) {
				$(".az-clsh-information-secteur select", this.el).append($("<option>", {value: secteur.get("ID_SECTEUR"), text: secteur.get("NOM_SECTEUR")}).text(secteur.get("NOM_SECTEUR")));
			}, this);

			$(".az-clsh-information-agrementation select", this.el).empty();
				$(".az-clsh-information-agrementation select", this.el).append($("<option>", {value: 0, text: "---"}).text("---"));

			az.configuration.get("agrementations").each(function(agrementation) {
				$(".az-clsh-information-agrementation select", this.el).append($("<option>", {value: agrementation.get("ID_AGREMENTATION"), text: agrementation.get("NUMERO_AGREMENTATION")}).text(agrementation.get("NUMERO_AGREMENTATION")));
			}, this);

			$(".az-clsh-information-empty-clsh", this.el).show();
			$(".az-clsh-information-content", this.el).hide();
			$('.date-picker', this.el).multiDatesPicker();
			$('.date-picker', this.el).hide();
			return this;
		},

		loading: function() {
			$(this.el).addClass("loading");
		},
		
		setCLSH: function(clsh) {
			$(this.el).removeClass("loading");
			this.headers = [];
			this.journees = [];
			
			if (clsh) {
				$(".az-clsh-information-empty-clsh", this.el).hide();
				$(".az-clsh-information-content", this.el).show();
				$(".az-clsh-information-nom input", this.el).val(clsh.get("NOM_SEJOUR"));
				$(".az-clsh-information-code input", this.el).val(clsh.get("CODE_ANA"));
				$(".az-clsh-information-secteur select", this.el).val(clsh.get("ID_SECTEUR"));
				$(".az-clsh-information-agrementation select", this.el).val(clsh.get("ID_AGREMENTATION"));
				this.setJourneesSejour(clsh);
				$('.date-picker').multiDatesPicker('destroy');
				if (this.journees.length)
					$('.date-picker', this.el).multiDatesPicker({ changeMonth: true, changeYear: true, defaultDate: this.journees[0], onSelect: this.onDateSelected });
				else
					$('.date-picker', this.el).multiDatesPicker({ changeMonth: true, changeYear: true, onSelect: this.onDateSelected});
				$('.date-picker').multiDatesPicker('addDates', this.journees);

			} else {
				$(".az-clsh-information-empty-clsh", this.el).show();
				$(".az-clsh-information-content", this.el).hide();
			}
		},

		onDateSelected: function(date) {
			console.log("coucou");
			if (this.journees.indexOf(date) === -1) {

			} else {
				
			}
		},

		setJourneesSejour: function(clsh) {
			$(".az-clsh-information-journees table thead tr, .az-clsh-information-journees table tbody").empty();
			this.headers = [];
			$(".az-clsh-information-journees table thead tr").append($("<th>", {title: "Modifier les dates"}).append($("<i>", {class: "fa fa-calendar", style: "display:inline-block;margin-right:5px;"})).append($("<div>", {style: "display:inline-block;"}).text("Jour")));

			_.each(clsh.get("tableTarif").table, function(t) {
				if (!_.find(this.headers, function(h) { return t["ID_PERIODE_QUOTIDIENNE"] === h["ID_PERIODE_QUOTIDIENNE"]; })) {
					$(".az-clsh-information-journees table thead tr").append($("<th>", {title: t["INTITULE_PERIODE"]}).text(t["ABREVIATION_PERIODE"]));
					this.headers.push(t);
				}
			}, this);


			_.each(clsh.get("journees"), function(j) {
				var $row = $("<tr>");
				this.journees.push(new Date(j["DATE_JOURNEE"]));
				var text = az.Utils.dateFormat(new Date(j["DATE_JOURNEE"]), "dddd dd mmmm yyyy");
				$row.append($("<td>", {title: text}).text(text));
				_.each(this.headers, function(h) {
					var find = _.find(j.periodes, function(p) { return p["ID_PERIODE_QUOTIDIENNE"] === h["ID_PERIODE_QUOTIDIENNE"];});
					if (find)
						$row.append($("<td>", {title: ""}).text("X").addClass("selected"));
					else
						$row.append($("<td>", {title: ""}).text(""));
				}, this);
				$(".az-clsh-information-journees table tbody").append($row);
			}, this);

			this.setTableListeners();

		},


		setTableListeners: function() {
			// Add click listeners
			$(".az-clsh-information-journees table tbody tr td:not(:first-child)", this.el).on("click", function(e) {
				if (!$(e.target).hasClass("selected")) {
					$(e.target).addClass("selected").text("X");
				} else {
					$(e.target).removeClass("selected").text("");
				}
			});
			$(".az-clsh-information-journees table tbody tr td:first-child", this.el).on("click", function(e) {
				var $row = $(e.target).parent();
				if (!$("td:not(:first-child)", $row).hasClass("selected")) {
					$("td:not(:first-child)", $row).addClass("selected").text("X");
				} else {
					$("td:not(:first-child)", $row).removeClass("selected").text("");
				}
			});

			$(".az-clsh-information-journees table thead tr th:not(:first-child)", this.el).on("click", _.bind(function(e) {

				var index = $(e.target).index() + 1;
				if (!$($(".az-clsh-information-journees table tbody tr td:nth-child("+index +")", this.el)[0]).hasClass("selected")) {
					$(".az-clsh-information-journees table tbody tr td:nth-child("+index +")", this.el).addClass("selected").text("X");
				} else {
					$(".az-clsh-information-journees table tbody tr td:nth-child("+index+")", this.el).removeClass("selected").text("");
				}
			}, this));

			$(".az-clsh-information-journees table thead tr th:first-child", this.el).on("click", _.bind(function(e) {
				$('.date-picker', this.el).toggle();
			}, this));
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

	return CLSHInformationView;
});

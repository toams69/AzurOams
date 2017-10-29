/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          clsh-inscription.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./clsh-inscription.tpl.html',
	'text!./clsh-inscription-print.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/clsh-manager',
	'az'
], function(
	$, _, Backbone
	, template
	, templatePrint
	, i18n
	, clshManager
	, az
) {

	var log = new az.Log("CLSHInscriptionView");
	var CLSHInscriptionView = Backbone.View.extend({
		id: "azCLSHInformation",
		className: "az-clsh-inscription",

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
			var journees = clsh.get("journees");
			this.clsh = clsh;
			log.debug("setCLSH");
			this.journees = journees;
			$(".journee_cl", this.el).empty();
			_.each(journees, function(j) {
				var text = az.Utils.dateFormat(new Date(j["DATE_JOURNEE"]), "dddd dd mmmm yyyy");
				$(".journee_cl", this.el).append($("<option>", {value: j["ID_JOURNEE"], text: text}).text(text));
			}, this);
			this.setJournee();
			
		},


		setJournee: function() {
			$(".inscrits-list table thead, .inscrits-list table tbody", this.el).empty();
			$(".total table thead, .total table tbody", this.el).empty();
			var idJournee = parseInt($(".journee_cl", this.el).val());
			var journee = _.find(this.journees, function(j) {
				return j["ID_JOURNEE"] == idJournee;
			});
			if (journee) {
				this.journee = journee;
				var $row = $("<tr></tr>");
				var $row2 = $("<tr></tr>");
				$row.append($("<th></th>").text("Nom"));
				$row.append($("<th></th>").text("Prénom"));
				_.each(journee.periodes, function(p) {
					$row.append($("<th style='text-align: center;'></th>").text(p["ABREVIATION_PERIODE"]));
					$row2.append($("<th style='text-align: center;'></th>").text(p["ABREVIATION_PERIODE"]));
					p.total = 0;
				}, this); 
				$(".inscrits-list table thead", this.el).append($row);
				$(".total table thead", this.el).append($row2);
				_.each(journee.inscrits, function(i) {
					var $row = $("<tr></tr>");
					$row.append($("<td></td>").text(i["NOM_ENFANT"]));
					$row.append($("<td></td>").text(i["PRENOM_ENFANT"]));
					_.each(journee.periodes, function(p) {
						var find = _.find(i.periodes, function(ip) {
							return p["ID_PERIODE_QUOTIDIENNE"] === ip["ID_PERIODE_QUOTIDIENNE"];
						});
						if (find) {
							p.total ++;
							$row.append($("<td style='text-align: center;'></td>").text("X"));
						} else {
							$row.append($("<td></td>").text(""));
						}

					});

					$(".inscrits-list table tbody", this.el).append($row);
				}, this); 
				var $row2 = $("<tr></tr>");
				_.each(journee.periodes, function(p) {
					$row2.append($("<td style='text-align: center;'></td>").text(p.total));
				});
				$(".total table tbody", this.el).append($row2);
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
			"change .journee_cl": "onJourneeChanged",
			"click .btn-print": "imprimer"
		},

		onJourneeChanged: function() {
			this.setJournee();
		},

		imprimer: function() {
			var tpl = _.template(templatePrint);
			var $div = $("<div>").html(tpl);
			$(".info-clsh-container", $div).text(this.clsh.get("NOM_SEJOUR") +"\n" +  az.Utils.dateFormat(new Date(this.journee["DATE_JOURNEE"]), "dddd dd mmmm yyyy"));

			if (this.journee) {
				var nbAM = 0,
					nbR = 0,
					nbM = 0;
				_.each(this.journee.inscrits, function(i, index) {
					var $row = $("<tr></tr>");
					$row.append($("<td></td>").text(index + 1));
					$row.append($("<td></td>").text(i["NOM_ENFANT"]));
					$row.append($("<td></td>").text(i["PRENOM_ENFANT"]));
					// M
					var isPresentM = _.find(i.periodes, function(p) { return p["ID_PERIODE_QUOTIDIENNE"] === 1 || p["ID_PERIODE_QUOTIDIENNE"] === 2 || p["ID_PERIODE_QUOTIDIENNE"] === 5 || p["ID_PERIODE_QUOTIDIENNE"] === 6;});
					$row.append($("<td></td>").text(isPresentM ? "X" : ""));
					if (isPresentM)
						nbM++;
					// R
					var isPresentR = _.find(i.periodes, function(p) { return p["ID_PERIODE_QUOTIDIENNE"] === 2 || p["ID_PERIODE_QUOTIDIENNE"] === 4 || p["ID_PERIODE_QUOTIDIENNE"] === 6;});
					$row.append($("<td></td>").text(isPresentR ? "X" : ""));
					if (isPresentR)
						nbR++;
					// AM
					var isPresentAM = _.find(i.periodes, function(p) { return p["ID_PERIODE_QUOTIDIENNE"] === 3 || p["ID_PERIODE_QUOTIDIENNE"] === 4 || p["ID_PERIODE_QUOTIDIENNE"] === 5 || p["ID_PERIODE_QUOTIDIENNE"] === 6;});
					$row.append($("<td></td>").text(isPresentAM ? "X" : ""));
					if (isPresentAM)
						nbAM++;
					// Infos
					$row.append($("<td></td>").text(""));
					$row.append($("<td></td>").text(""));
					$row.append($("<td></td>").text(""));
					$row.append($("<td></td>").text(""));
				
					$(".inscrits-list table tbody", $div).append($row);
				}, this); 
				var $row = $("<tr></tr>");
				$row.append($("<td></td>"));
				$row.append($("<td></td>").text("Total"));
				$row.append($("<td></td>"));

				$row.append($("<td></td>").text(nbM));
				$row.append($("<td></td>").text(nbR));
				$row.append($("<td></td>").text(nbAM));

				$row.append($("<td></td>").text(""));
				$row.append($("<td></td>").text(""));
				$row.append($("<td></td>").text(""));
				$row.append($("<td></td>").text(""));
				$(".inscrits-list table tbody", $div).append($("<tr style=\"height:20px;\"><td style=\"height:20px;border:none;\"></td></tr>")).append($row);
			}

			az.Utils.print($div);
		}
	});

	return CLSHInscriptionView;
});

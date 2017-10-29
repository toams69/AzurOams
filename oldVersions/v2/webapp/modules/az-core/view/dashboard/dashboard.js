/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          dashboard.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./dashboard.tpl.html',
	'i18n!../../nls/strings',
	'az',
	'chart'
], function(
	$, _, Backbone
	, template
	, i18n
	, az
	, Chart
) {
	
	var DasboardView = Backbone.View.extend({

		initialize: function() {
			this.factureClosedColor= "#0095E1";
			this.factureClosedHoverColor= "#00A9FF";
			this.factureOpenColor= "#CACACA";
			this.factureOpenHoverColor= "#f1f1f1";
			this.facturePartiallyClosedColor= "#6CCDFF";
			this.facturePartiallyClosedHoverColor= "#B4E5FF";


			this.hommeColor= "#075500";
			this.hommeHoverColor= "#0A7700";
			this.garconColor= "#00CA16";
			this.garconHoverColor= "#5ED26B";

			this.femmeColor= "#FFBB00";
			this.femmeHoverColor= "#FFE089";
			this.filleColor= "#F7E033";
			this.filleHoverColor= "#F7EFAE";
			return this;
		},

		render: function() {
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);


			az.configuration.get("annees").each(function(a) {
				var text = (new Date(a.get("DATE_DEBUT")).getUTCFullYear()) + " - " + (new Date(a.get("DATE_FIN")).getUTCFullYear());
				$(".factures-stats .anneeSelect", this.el).append($("<option>", {value: a.get("ID_ANNEE"), text: text}).text(text));
				$(".membres-stats .anneeSelect", this.el).append($("<option>", {value: a.get("ID_ANNEE"), text: text}).text(text));
			}, this);



			this.setFactureStats();
			this.setMembreStats();
			this.setInscriptionStats();
			return this;
		},

		setInscriptionStats: function() {
			$(".last-inscription", this.el).addClass("loading");
			$(".last-inscription table tbody", this.el).empty();
			var number = $(".last-inscription .number-elem", this.el).val();
			az.statsManager.getInscriptionStats(number).then(_.bind(function(inscriptions) {
				_.each(inscriptions, function(inscription) {
					var $row = $("<tr></tr>");
					var type = "";
					switch (inscription.objet["type"] ) {
						case 'adhesionAdulte':
							type = "Adhésion";
						break;
						case 'adhesionEnfant':
							type = "Adhésion";
						break;
						case 'activite':
							type = "Inscription Activité";
						break;
						case 'cl':
							type = "Inscription Centre de Loisir";
						break;
					}
					
					$row.append($("<td></td>").text(type));
					$row.append($("<td></td>").text(inscription.objet["ID_ENFANT"] ? inscription.objet["NOM_ENFANT"] : inscription.objet["NOM_MEMBRE"]));
					$row.append($("<td></td>").text(inscription.objet["ID_ENFANT"] ? inscription.objet["PRENOM_ENFANT"] : inscription.objet["PRENOM_MEMBRE"]));
					$row.append($("<td></td>").text(az.Utils.dateFormat(new Date(inscription.facture["DATE_FACTURE"]), "dd/mm/yyyy")));

					$(".last-inscription table tbody", this.el).append($row);
					$row.on("click", _.bind(function() {
						$("tr", this.el).removeClass("active");
						$row.addClass("active");
					}, this));

				}, this);
				$(".last-inscription", this.el).removeClass("loading");
			}, this));
			
		},

		setFactureStats: function() {
			$(".factures-stats", this.el).addClass("loading");
			$("#myFactureChart", this.el).empty();
			var anneeSelected = $(".factures-stats .anneeSelect").val();
			az.statsManager.getFactureStats(anneeSelected).then(_.bind(function(d) {
				var ctx = $("#myFactureChart", this.el).get(0).getContext("2d");
				$(".nombreTotalFacture", this.el).text(d.nbFactures);
				var data = [{
			        value: d.facturesRegle,
			        color: this.factureClosedColor,
			        highlight: this.factureClosedHoverColor
			        //,label: "Réglée"
			    },
			    {
			        value: d.facturesNonRegle,
			        color: this.factureOpenColor,
			        highlight: this.factureOpenHoverColor
			        //,label: "Non réglée"
			    },
			    {
			        value: d.facturesPartiellementRegle,
			        color: this.facturePartiallyClosedColor,
			        highlight: this.facturePartiallyClosedHoverColor
			        //,label: "Partiellement"
			    }];
			    var options = {
				    //Boolean - Whether we should show a stroke on each segment
				    segmentShowStroke : true,
				    //String - The colour of each segment stroke
				    segmentStrokeColor : "#fff",
				    //Number - The width of each segment stroke
				    segmentStrokeWidth : 2,
				    //Number - The percentage of the chart that we cut out of the middle
				    percentageInnerCutout : 80, // This is 0 for Pie charts
				    //Number - Amount of animation steps
				    animationSteps : 100,
				    //String - Animation easing effect
				    animationEasing : "easeOutBounce",
				    //Boolean - Whether we animate the rotation of the Doughnut
				    animateRotate : true,
				    //Boolean - Whether we animate scaling the Doughnut from the centre
				    animateScale : false,
				    //String - A legend template
				    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
				};
				var myPieChart = new Chart(ctx).Pie(data,options);
				$(".factures-stats", this.el).removeClass("loading");
			}, this));
		},

		setMembreStats: function() {
			$(".membres-stats", this.el).addClass("loading");
			$("#membreChart", this.el).empty();
			var anneeSelected = $(".membres-stats .anneeSelect").val();
			az.statsManager.getMembreStats(anneeSelected).then(_.bind(function(d) {
				var ctx = $("#membreChart", this.el).get(0).getContext("2d");
				$(".nombreTotalInscrit", this.el).text(d.nbMembres);
				var data = [{
			        value: d.homme,
			        color: this.hommeColor,
			        highlight: this.hommeHoverColor
			        //,label: "Réglée"
			    },
			    {
			        value: d.garcon,
			        color: this.garconColor,
			        highlight: this.garconHoverColor
			        //,label: "Non réglée"
			    },
			    {
			        value: d.fille,
			        color: this.filleColor,
			        highlight: this.filleHoverColor
			        //,label: "Partiellement"
			    },
			    {
			        value: d.femme,
			        color: this.femmeColor,
			        highlight: this.femmeHoverColor
			        //,label: "Partiellement"
			    }
			    ];
			    var options = {
				    //Boolean - Whether we should show a stroke on each segment
				    segmentShowStroke : true,
				    //String - The colour of each segment stroke
				    segmentStrokeColor : "#fff",
				    //Number - The width of each segment stroke
				    segmentStrokeWidth : 2,
				    //Number - The percentage of the chart that we cut out of the middle
				    percentageInnerCutout : 80, // This is 0 for Pie charts
				    //Number - Amount of animation steps
				    animationSteps : 100,
				    //String - Animation easing effect
				    animationEasing : "easeOutBounce",
				    //Boolean - Whether we animate the rotation of the Doughnut
				    animateRotate : true,
				    //Boolean - Whether we animate scaling the Doughnut from the centre
				    animateScale : false,
				    //String - A legend template
				    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
				};
				var myPieChart = new Chart(ctx).Pie(data,options);
				$(".membres-stats", this.el).removeClass("loading");
			}, this));
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
			"click .factures-stats .apply": "setFactureStats",
			"click .w-configuration": "onConfigurationClick",
			"click .last-inscription .apply": "setInscriptionStats",
			"click .membres-stats .apply": "setMembreStats"
		},

		onConfigurationClick: function(e) {
			if (e.target.className != "btn apply" && e.target.className != "btn cancel") {
				e.preventDefault();
				e.stopPropagation();
			}
		}
	});

	return DasboardView;
});

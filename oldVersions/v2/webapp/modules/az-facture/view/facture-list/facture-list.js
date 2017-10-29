/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          facture-list.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'../../model/facture',
	'text!./facture-list.tpl.html',
	'i18n!../../nls/strings',
	'az',
	'datatable-column-resize-plugin'
], function(
	$, _, Backbone
	, Facture
	, template
	, i18n
	, az
) {
	
	var log = new az.Log("FactureListView");
	var FactureListView = Backbone.View.extend({
		id: "azFactureList",
		className:"az-facture-list-view",

		initialize: function(options) {
			log.debug("initialize");
			_.bindAll(this, 'updateDataTableDisplay');
			this.gridColumns = options.gridColumns ? options.gridColumns : [{id: "ID_FACTURE", title:i18n.facture_grid_id_label},{id: "NOM_MEMBRE", title:i18n.facture_grid_nom_label},
								{id: "PRENOM_MEMBRE", title:i18n.facture_grid_prenom_label},{id: "DATE_FACTURE", title:i18n.facture_grid_date_label},
								{id: "MONTANT_FACTURE", title:i18n.facture_grid_montant_label}, {id: "NOM_TYPE_FACTURE", title:i18n.facture_grid_type_label}, {id: "MONTANT_REGLE", title: ""}];
			return this;
		},

		render: function() {
			log.debug("render");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			this.setDataTable(this.gridColumns);


			// Bind function
			$("table", this.el).click( _.bind(function (e) {
				log.debug("table click");
				if (this.dataTable) {
					// Get the position of the current data from the node
					var aPos = null;
					// DESKTOP-3300
					aPos = this.dataTable.fnGetPosition(e.target.tagName.toUpperCase() === "DIV" ? e.target.parentNode : e.target);
					if (aPos) {
						var facture = this.factureList.at(aPos[0]);
						if (this.selectedFacture != facture) {
							this.selectedFacture = facture;
							this.onSelectedFactureChanged();
						}
					}
				}
			}, this));
			$(this.el).on("shown", _.bind(function(e) {
				if (e.target !== this.el) {
					e.stopPropagation();
					e.preventDefault();
					return;
				}
				if (this.dataTable) {
					this.updateDataTableDisplay();
				}
			}, this));
			// Styling the pagination
			$(".ui-icon.ui-icon-circle-arrow-e", this.el).addClass("fa fa-chevron-circle-right").removeClass("ui-icon").removeClass("ui-icon-circle-arrow-e");
			$(".ui-icon.ui-icon-circle-arrow-w", this.el).addClass("fa fa-chevron-circle-left").removeClass("ui-icon").removeClass("ui-icon-circle-arrow-w");
			$(window).on("resize", this.updateDataTableDisplay);
			setTimeout(this.updateDataTableDisplay, 200);
			return this;
		},

		onSelectedFactureChanged: function() {
			log.debug("onSelectedFactureChanged");
			// Add class to sublime selected item
			if (this.dataTable) {
				$(this.dataTable.fnGetNodes()).removeClass("active");
				if (this.selectedFacture) {
					var index = this.factureList.indexOf(this.selectedFacture);	
					$(this.dataTable.fnGetNodes(index)).addClass("active");
				}
			}
			this.trigger("factureSelected", this.selectedFacture);
		},

		selectFacture: function(facture) {
			if (!this.factureList) {
				return;
			}
			this.selectedFacture = this.factureList.find(function(c) {
				return c.get("ID_FACTURE") === facture.get("ID_FACTURE");
			});
		
			if (this.dataTable) {
				$(this.dataTable.fnGetNodes()).removeClass("active");
				if (this.selectedFacture) {
					var index = this.factureList.indexOf(this.selectedFacture);	
					$(this.dataTable.fnGetNodes(index)).addClass("active");
					this.trigger("factureSelected", this.selectedFacture);
				}
			}
		},

		setDataTable: function(customColumn) {
			log.debug("setDataTable");
			if (customColumn.length) {
				this.gridColumns = customColumn;
				this.aoColumns = [];
				_.each(this.gridColumns, function(column) {
					if (column.id === "STATUT"){
						var mRender = function(data, type, full) {
							switch (data) {
								case 0:
									var title ="A Réglé. \nRestant: "+full._facture.get("MONTANT_FACTURE")+" €";
									return $("<div>").append($("<i data-placement=\"left\">").addClass("fa fa-circle-o").attr("title", title)).html();
								case 1:
									var title ="Partiellement régle. \nRestant: "+(full._facture.get("MONTANT_FACTURE") - full._facture.get("MONTANT_REGLE"))+" €";
									return $("<div>").append($("<i data-placement=\"left\">").addClass("fa fa-adjust").attr("title", title)).html();
								case 2:
									var title ="Réglé. \nRestant: 0 €";
									return $("<div>").append($("<i data-placement=\"left\">").addClass("fa fa-circle").attr("title", title)).html();
							}
							return "";
						};
						this.aoColumns.push({sTitle: column.title, mData: column.id, mRender: mRender});
					} else if (column.id === "DATE_FACTURE") {
						var mRender = function(data, type) {
							if (type === "sort") {
								var date = data.split(_.escape("/"));
								return (new Date(date[1]+"/"+date[0]+"/"+date[2])).getTime();
							}
							return data;
						};
						this.aoColumns.push({sTitle: column.title, mData: column.id, mRender: mRender});
					} else if (column.id === "MOTIF_FACTURE") {
						var mRender = function(data, type) {
							return $("<div>").append($("<div>").addClass("motif-column").html(data)).html();
						};
						this.aoColumns.push({sTitle: column.title, mData: column.id, mRender: mRender});
					} else{
						this.aoColumns.push({sTitle: column.title, mData: column.id});
					}
				}, this);
				if (this.dataTable)
					this.dataTable.fnDestroy();
				this.dataTable = $("table", this.el).dataTable({
					"bPaginate": true,
					"iDisplayLength": 50,
					"bLengthChange": false,
					"bJQueryUI": true,
					"bFilter": false,
					"bSort": true,
					"sScrollY": 200,
					"bInfo": false,
					"sDom": "Rlfrtip",
					"oLanguage": { "sZeroRecords": i18n.no_items_found },
					"bAutoWidth": false,
					"aaSorting": [[ 0, "desc" ]],
					"aoColumns": this.aoColumns,
					"fnRowCallback": function( nRow) {
						$('td', nRow).each(function() {
							$(this).attr("title", $(this).text());
						});
						return nRow;
					}
				});
			}
		},

		setFactureList: function(factureList) {
			log.debug("setFactureList");
			this.factureList = factureList;
			if (this.dataTable) {
				this.dataTable.fnClearTable();
				
				
				var factureGridList = [];
				if (this.factureList) {
					this.factureList.each(function(facture) {
						var obj = {_facture: facture };
						_.each(this.gridColumns, function(column) {
							if (column.id === "STATUT") 
								obj[column.id] = facture.get("MONTANT_REGLE") ? facture.get("MONTANT_REGLE") < facture.get("MONTANT_FACTURE") ? 1 : 2 : 0;
							else
								obj[column.id] = facture.get(column.id) ? _.escape(facture.get(column.id)) : "";
						}, this);
						factureGridList.push(obj);
					}, this);
					if (factureGridList.length)
						this.dataTable.fnAddData(factureGridList);
				}
				
				this.trigger("factureSelected", null);
				this.updateDataTableDisplay();
				this.dataTable.fnDraw();

				if (this.selectedFacture) {
					this.selectFacture(this.selectedFacture);
				}
			}
			setTimeout(_.bind(function() {
				$("table i", this.el).tooltip();
			}, this), 1000);
		},

		filter: function(string) {
			log.debug("filter " + string);
			this.dataTable.fnFilter( string );
		},

		updateDataTableDisplay: function() {
			log.debug("updateDataTableDisplay");
			$('div.dataTables_scrollBody', this.el).css('height', '');
			var height = Math.round(this.$el.height() - $(".dataTables_scrollHeadInner", this.el).height()) + 'px';
			if (height) {
				$('div.dataTables_scrollBody', this.el).css('max-height', height);
			} else {
				$('div.dataTables_scrollBody', this.el).css('max-height', '');
			}
			
			setTimeout(_.bind(function() {
				$('div.dataTables_scrollHeadInner, div.dataTables_scrollHeadInner table', this.el).css('width', '');
				this.dataTable.fnAdjustColumnSizing();
			}, this), 200);

		},

		/**
		 * Cleanup the view and remove it from the DOM
		 * @override
		 */
		remove: function() {
			log.debug("remove");
			$(window).off("resize", this.updateDataTableDisplay);
			this.undelegateEvents();
			$(this.el).removeData().unbind();
			Backbone.View.prototype.remove.call(this);
			return this;
		},

		events: {
		
		}
	});

	return FactureListView;
});

/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-desktop.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'../../model/contact',
	'text!./contact-list.tpl.html',
	'i18n!../../nls/strings',
	'az',
	'datatable-column-resize-plugin'
], function(
	$, _, Backbone
	, Contact
	, template
	, i18n
	, az
) {
	
	var log = new az.Log("ContactListView");
	var ContactListView = Backbone.View.extend({
		id: "azContactList",
		className:"az-contact-list-view",

		initialize: function() {
			log.debug("initialize");
			_.bindAll(this, 'updateDataTableDisplay');
			return this;
		},

		render: function() {
			log.debug("render");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			this.setDataTable([{id: "ABREVIATION_CIVILITE", title:i18n.contact_grid_civilite_label},{id: "NOM_MEMBRE", title:i18n.contact_grid_nom_label},
								{id: "PRENOM_MEMBRE", title:i18n.contact_grid_prenom_label},{id: "AGE_MEMBRE", title:i18n.contact_grid_age_label}]);


			// Bind function
			$("table", this.el).click( _.bind(function (e) {
				log.debug("table click");
				if (this.dataTable) {
					// Get the position of the current data from the node
					var aPos = null;
					// DESKTOP-3300
					aPos = this.dataTable.fnGetPosition( e.target );
					if (aPos) {
						var contact = this.contactList.at(aPos[0]);
						if (this.selectedContact != contact) {
							this.selectedContact = contact;
							this.onSelectedContactChanged();
						}
					}
				}
			}, this));

			// Styling the pagination
			$(".ui-icon.ui-icon-circle-arrow-e", this.el).addClass("fa fa-chevron-circle-right").removeClass("ui-icon").removeClass("ui-icon-circle-arrow-e");
			$(".ui-icon.ui-icon-circle-arrow-w", this.el).addClass("fa fa-chevron-circle-left").removeClass("ui-icon").removeClass("ui-icon-circle-arrow-w");
			$(window).on("resize", this.updateDataTableDisplay);
			setTimeout(this.updateDataTableDisplay, 200);
			return this;
		},

		onSelectedContactChanged: function() {
			log.debug("onSelectedContactChanged");
			// Add class to sublime selected item
			if (this.dataTable) {
				$(this.dataTable.fnGetNodes()).removeClass("active");
				if (this.selectedContact) {
					var index = this.contactList.indexOf(this.selectedContact);	
					$(this.dataTable.fnGetNodes(index)).addClass("active");
				}
			}
			this.trigger("contactSelected", this.selectedContact);
		},

		selectContact: function(contact) {
			this.selectedContact = this.contactList.find(function(c) {
				return (c.get("type") === contact.get("type")) && (c.get("type") === Contact.Type.ADULTE ? c.get("ID_MEMBRE") === contact.get("ID_MEMBRE") :  c.get("ID_ENFANT") === contact.get("ID_ENFANT"));
			});
			if (this.dataTable) {
				$(this.dataTable.fnGetNodes()).removeClass("active");
				if (this.selectedContact) {
					var index = this.contactList.indexOf(this.selectedContact);	
					$(this.dataTable.fnGetNodes(index)).addClass("active");
					this.trigger("contactSelected", this.selectedContact);
				}
			}
		},

		setDataTable: function(customColumn) {
			log.debug("setDataTable");
			if (customColumn.length) {
				this.gridColumns = customColumn;
				this.aoColumns = [];
				_.each(this.gridColumns, function(column) {
					this.aoColumns.push({sTitle: column.title, mData: column.id});
				}, this);
				if (this.dataTable)
					this.dataTable.fnDestroy();
				this.dataTable = $("table", this.el).dataTable({
					"bPaginate": true,
					"iDisplayLength": 50,
					"bLengthChange": false,
					"bJQueryUI": true,
					"bFilter": true,
					"bSort": true,
					"sScrollY": 200,
					"bInfo": false,
					"sDom": "Rlfrtip",
					"oLanguage": { "sZeroRecords": i18n.no_items_found },
					"bAutoWidth": false,
					"aaSorting": [[ 1, "asc" ]],
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

		setContactList: function(contactList) {
			log.debug("setContactList");
			this.contactList = contactList;
			if (this.dataTable) {
				this.dataTable.fnClearTable();
				this.selectedContactId = null;
				
				var contactGridList = [];
				this.contactList.each(function(contact) {
					var obj = {_contact: contact };
					_.each(this.gridColumns, function(column) {
						obj[column.id] = contact.get(column.id) ? _.escape(contact.get(column.id)) : "";
					}, this);
					contactGridList.push(obj);
				}, this);
				if (contactGridList.length)
					this.dataTable.fnAddData(contactGridList);
				
				this.updateDataTableDisplay();
				this.dataTable.fnDraw();
			}
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
			// this.dataTable.fnDraw();
			if (this.datatable) {
				this.dataTable.fnAdjustColumnSizing();
			}
			setTimeout(_.bind(function() {
				$('div.dataTables_scrollHeadInner, div.dataTables_scrollHeadInner table', this.el).css('width', '');
			}, this), 200);
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

	return ContactListView;
});

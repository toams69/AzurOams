/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          reglement-facture.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'../add-reglement-dialog/add-reglement-dialog',
	'text!./reglement-facture.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/facture-manager',
	'az',
	'bootbox'
], function(
	$, _, Backbone,
	AddReglementDialog
	, template
	, i18n
	, factureManager
	, az
	, bootbox
) {

	var log = new az.Log("ReglementFactureView");
	var ReglementFactureView = Backbone.View.extend({
		id: "azSample",
		className: "az-reglement-facture",

		initialize: function() {
			log.debug("initialize");
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n });
			this.$el.html(tpl);
			$(".az-facture-reglement-information-part", this.el).hide();
			$(".az-facture-reglement-empty-facture", this.el).show();
			return this;
		},

		loading: function() {
			log.debug("loading");
			$(this.el).addClass("loading");
			$(".az-facture-reglement-information-part", this.el).hide();
			$(".az-facture-reglement-empty-facture", this.el).hide();
		},

		setFacture: function(facture) {
			$(this.el).removeClass("loading");
			log.debug("setFacture");
			this.facture = facture;
			$(".az-facture-reglement-information-part table tbody", this.el).empty();

			if (this.facture) {
				$(".az-facture-reglement-information-part", this.el).show();
				$(".az-facture-reglement-empty-facture", this.el).hide();
				_.each(this.facture.get('reglements'), function(r) {
					var $row = $("<tr></tr>");
					$row.append($("<td></td>").text(r["ID_REGLEMENT"]));
					$row.append($("<td></td>").text(az.Utils.dateFormat(new Date(r["DATE_REGLEMENT"]), "dd/mm/yyyy")));
					$row.append($("<td></td>").text(r["MONTANT_REGLEMENT"]+ " €"));
					$row.append($("<td></td>").text(r["NOM_TYPE_REGLEMENT"]));
					var $lastColumn = $("<td></td>").html('<i class="fa fa-info-circle" title="" data-placement="left"></i>');
					$row.append($lastColumn);
					
					var tooltip = "";
					tooltip += r["NOM_TYPE_REGLEMENT"] +"\n";

					if (r["CODE_ANA"]) {
						tooltip += i18n.reglement_code_ana_label + ": " + r["CODE_ANA"] +"\n";
					}
					if (r["CHEQUE_NUM"]) {
						tooltip += i18n.reglement_numero_cheque_label + ": " +r["CHEQUE_NUM"] +"\n";
					}
					if (r["NOM_BANQUE"]) {
						tooltip += i18n.reglement_banque_label + ": " +r["NOM_BANQUE"] +"\n";
					}
					if (r["COMMENTAIRE_REGLEMENT"]) {
						tooltip += i18n.reglement_commentaire_label + ": " +r["COMMENTAIRE_REGLEMENT"] +"\n";
					}

					if (r["ENCAISSE_DATE"]) {
						var title= "";
						title += i18n.reglement_encaisse_label + ": " + az.Utils.dateFormat(new Date(r["ENCAISSE_DATE"]), "dd/mm/yyyy") +"\n";
						if (r["BORDERAU_NUM"]) {
							title += i18n.reglement_borderau_label + ": " + r["BORDERAU_NUM"];
						}
						$lastColumn.append('<i class="fa fa-check" title="" data-toggle="tooltip" data-placement="left"></i>');
						//<i class="fa fa-check"></i>
						$("i.fa-check", $row).attr("title", title);
					}

					$("i.fa-info-circle", $row).attr("title", tooltip);
					$("i", $row).tooltip();


					$(".az-facture-reglement-information-part table tbody", this.el).append($row);
					$row.on("click", _.bind(function() {
						$("tr", this.el).removeClass("active");
						$row.addClass("active");
						this.selectedReglement = r;
					}, this));

				}, this);

			} else {
				$(".az-facture-reglement-information-part", this.el).hide();
				$(".az-facture-reglement-empty-facture", this.el).show();

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
			"click .btn-delete": "deleteReglement",
			"click .btn-add": "addReglement"
		},

		deleteReglement: function() {
			if (this.selectedReglement) {
				bootbox.confirm(i18n.reglement_supprimer_confirmation, _.bind(function(result) {
					if (result) {
						log.debug("Delete Reglement");
						factureManager.deleteReglement(this.selectedReglement).then(
							_.bind(function() {
								this.selectedReglement = null;
								this.facture.trigger("reload");
							}, this)
						);
					}
				}, this)); 
			}
		},

		addReglement: function() {
			var view = new AddReglementDialog({contact: this.contact, facture:this.facture});
			var $modal = view.render().$el;
			$modal.modal({"backdrop": "static", "keyboard": true});
			view.on("saved", _.bind(function() {
				this.facture.trigger("reload");
				setTimeout(_.bind(function() {
					$modal.modal('hide');
					view.remove();
					$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();
				}, this), 1000);
				
			}, this));
		}
	});

	return ReglementFactureView;
});

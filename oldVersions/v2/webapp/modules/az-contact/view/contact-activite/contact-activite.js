/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-activite.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'../../model/contact',
	'../contact-adhesion/contact-adhesion',
	'text!./contact-activite.tpl.html',
	'i18n!../../nls/strings',
	'../../singleton/contact-manager',
	'az',
	'bootbox'
], function(
	$, _, Backbone,
	Contact
	, ContactAdhesionView
	, template
	, i18n
	, contactManager
	, az
	, bootbox
) {

	var log = new az.Log("ContactActiviteView");
	var ContactActiviteView = Backbone.View.extend({
		id: "azContactFamille",
		className: "az-contact-information",

		initialize: function() {
			log.debug("initialize");
			this.anneeEnCours = az.configuration.get("anneeEnCours");
			return this;
		},

		render: function() {
			log.debug("initialize");
			var tpl = _.template(template, { i18n: i18n, id: this.id });
			this.$el.html(tpl);
			$(".az-contact-information-activite", this.el).hide();

			az.configuration.get("annees").each(function(a) {
				var text = (new Date(a.get("DATE_DEBUT")).getUTCFullYear()) + " - " + (new Date(a.get("DATE_FIN")).getUTCFullYear());
				$(".az-contact-information-activite .annee-select", this.el).append($("<option>", {value: a.get("ID_ANNEE"), text: text}).text(text));
			}, this);
			$(".az-contact-information-activite .annee-select", this.el).val(az.configuration.get("anneeEnCours").get("ID_ANNEE"));
			return this;
		},

		createValidators: function() {
			try {
				if (this.bootstrapValidator)
					this.bootstrapValidator.destroy();
			} catch (e) {

			}
			// Create validator
			var $form = $('.contact-adherent-part', this.el);
			$form.bootstrapValidator({
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
					numeroAdherent: {
						validators: {
							notEmpty: {message: i18n.contact_information_champ_requis_tooltip},
							digits: {message: i18n.adhesion_erreur_numero_tooltip}
						}
					}
		        }
		    });
			this.bootstrapValidator = $form.data('bootstrapValidator');
		},

		setContact: function(contact) {
			$(this.el).removeClass("loading");
			clearTimeout(this.alertTimer);
			this.contact = contact;
			$(".reset-contact", this.el).prop("disabled", true);
			$(".save-contact", this.el).prop("disabled", true);
			if (contact) {
				$(".az-contact-information-empty-contact", this.el).hide();
				$(".az-contact-information-activite", this.el).show();
				this.checkAdhesion();
				this.displayActivite();
			} else {
				$(".az-contact-information-empty-contact", this.el).show();
				$(".az-contact-information-activite", this.el).hide();
				$("button.add-cl-contact", this.el).hide();
				$("button.add-activite-contact", this.el).hide();
				$("button.adhesion", this.el).hide();
			}
			this.createValidators();
		},

		checkAdhesion: function() {
			var adhesion = this.contact.get("adhesions").find(_.bind(function(a) {
				return a.get("ID_ANNEE") === this.anneeEnCours.get("ID_ANNEE");
			}, this));
			if (adhesion) {
				$(".contact-adherent-part", this.el).show();
				$(".contact-non-adherent-part", this.el).hide();
				$(".contact-adherent-part .numero-adherent input", this.el).val(adhesion.get("NUMERO_ADHERENT"));
				if (this.contact.get("type") === Contact.Type.ADULTE)
					$("button.add-cl-contact", this.el).hide();
				else
					$("button.add-cl-contact", this.el).show();
				$("button.add-activite-contact", this.el).show();
				$("button.adhesion", this.el).hide();

			} else {
				$(".contact-adherent-part", this.el).hide();
				$(".contact-non-adherent-part", this.el).show();

				$("button.add-cl-contact", this.el).hide();
				$("button.add-activite-contact", this.el).hide();
				$("button.adhesion", this.el).show();
			}
		},

		displayActivite: function() {
			$(".contact-adherent-part .activites", this.el).empty();
			var activites = this.contact.get("activites").filter(_.bind(function(a) {
				return a.get("ID_ANNEE") === this.anneeEnCours.get("ID_ANNEE");
			}, this));
			_.each(activites, function(a, index) {
				var text = a.get("NOM_ACTIVITE");
				var className = index%2 === 0 ? "odd" : "even";
				var $li = $("<li>", {value: a.get("ID_ACTIVITE"), title: text}).html(text+'<i title="Supprimer l\'inscription" class="fa fa-times"></i>').addClass(className);
				$(".contact-adherent-part .activites", this.el).append($li);
				$li.on("click", _.bind(function() {
					this.deleteInscription(a);
				}, this));
			}, this);
			// $(".contact-adherent-part .activites li", this.el).on("click", _.bind(function(e) {
			// 	$(".contact-adherent-part .activites li", this.el).removeClass("active");
			// 	$(e.target).addClass("active");
			// },this));
		},

		deleteInscription: function(activite) {
			if (activite) {
				bootbox.confirm(i18n.inscription_supprimer_confirmation, _.bind(function(result) {
					if (result) {
						log.debug("Delete Inscription");
						az.activiteManager.deleteInscription(activite.get("ID_INSCRIPTION_ACTIVITE")).then(
							_.bind(function() {
								this.contact.trigger("reload");
								new PNotify({
									title: i18n.delete_inscription_notif_success_title,
									text: i18n.delete_inscription_notif_success_text,
									type: 'success',
									styling: 'fontawesome'
								});
							}, this)
						);
					}
				}, this)); 
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
			"click .az-contact-information-toolbar .reset-contact": "onResetClicked",
			"click .az-contact-information-toolbar .save-contact": "onSaveCliked",
			"click .az-contact-information-toolbar .add-activite-contact": 'onInscriptionActiviteClicked',
			"change .annee-select": "onAnneeChanged",
			"input .numero-adherent input": "onNumeroMembreChanged",
			"click .adhesion": "onAdhesionClicked"
		},

		onAnneeChanged: function() {
			this.anneeEnCours = az.configuration.get("annees").find(_.bind(function(a) {return a.get("ID_ANNEE") === parseInt($(".annee-select", this.el).val());}, this));
			this.checkAdhesion();
			this.displayActivite();
		},

		onNumeroMembreChanged: function() {
			$(".reset-contact", this.el).prop("disabled", false);
			$(".save-contact", this.el).prop("disabled", false);
		},

		onResetClicked: function() {
			this.setContact(this.contact);
		},
		
		onSaveCliked:function() {

			if (!this.bootstrapValidator) {
				return;
			}
			this.bootstrapValidator.validate();
			if (!this.bootstrapValidator || !this.bootstrapValidator.isValid()) {
			 	this.displayInfoMessage("error", i18n.contact_bad_update_request);
			 	return;
			}

			var adhesion = this.contact.get("adhesions").find(_.bind(function(a) {
				return a.get("ID_ANNEE") === this.anneeEnCours.get("ID_ANNEE");
			}, this));
			var numeroAdherent = parseInt($(".contact-adherent-part .numero-adherent input", this.el).val());
			contactManager.updateAdhesion(numeroAdherent, this.contact, this.anneeEnCours).then(
				_.bind(function() {
					adhesion.set("NUMERO_ADHERENT", numeroAdherent);
					this.displayInfoMessage("success", i18n.contact_updated);
					this.setContact(this.contact);
				}, this)
			);
		},

		onAdhesionClicked: function() {
			var view = new ContactAdhesionView({contact: this.contact, annee:this.anneeEnCours});
			var $modal = view.render().$el;
			$modal.modal({"backdrop": "static", "keyboard": true});
			view.on("saved", _.bind(function() {
				$modal.modal('hide');
				view.remove();
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
				this.setContact(this.contact);
				new PNotify({
					title: i18n.adhesion_notif_success_title,
					text: i18n.adhesion_notif_success_text,
					type: 'success',
					styling: 'fontawesome'
				});
			}, this));
		},

		onInscriptionActiviteClicked: function() {
			var view = new az.Activite.Dialog.InscriptionDialog({contact: this.contact, annee:this.anneeEnCours});
			var $modal = view.render().$el;
			$modal.modal({"backdrop": "static", "keyboard": true});
			view.on("saved", _.bind(function() {
				this.contact.trigger("reload");
				new PNotify({
					title: i18n.inscription_notif_success_title,
					text: i18n.inscription_notif_success_text,
					type: 'success',
					styling: 'fontawesome'
				});
				setTimeout(_.bind(function() {
					$modal.modal('hide');
					view.remove();
					$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();
				}, this), 1000);
			}, this));
		},

		displayInfoMessage: function(type, message) {
			$(this.el).addClass("alert-displayed");
			switch(type) {
				case 'success':
					$(".alert-container", this.el).empty().append($("<div></div>").addClass("alert alert-success").attr("role", "alert").text(message));
				break;
				case 'error':
					$(".alert-container", this.el).empty().append($("<div></div>").addClass("alert alert-danger").attr("role", "alert").text(message));
				break;
			}
			this.alertTimer = setTimeout(_.bind(function() {
				$(".alert-container", this.el).empty();
				$(this.el).removeClass("alert-displayed");
			}, this), az.configuration.get("alert-timeout"));
		}
	});

	return ContactActiviteView;
});

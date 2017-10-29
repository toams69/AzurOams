/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-information.js
 */

define([
	'jquery', 'underscore', 'backbone', 
	'text!./contact-information.tpl.html',
	'i18n!../../nls/strings',
	'../../model/contact',
	'../../singleton/contact-manager',
	'az'
], function(
	$, _, Backbone
	, template
	, i18n
	, Contact
	, contactManager
	, az
) {

	var log = new az.Log("ContactInformationView");
	var ContactInformationView = Backbone.View.extend({

		id: "azContactInformation",
		className: "az-contact-information",

		initialize: function() {
			log.debug("initialize");
			return this;
		},

		render: function() {
			log.debug("render");
			var tpl = _.template(template, { i18n: i18n, id: this.id });
			this.$el.html(tpl);
			$(".az-contact-information-adulte", this.el).hide();
			$(".az-contact-information-enfant", this.el).hide();
			// Create Civilites select
			az.configuration.get("civilites").each(function(v) {
				$(".az-contact-information-civilite select", this.el).append($("<option>", {value: v.get("ID_CIVILITE"), text: v.get("ABREVIATION_CIVILITE")}).text(v.get("ABREVIATION_CIVILITE")));
			}, this);

			//this.createValidators();
			return this;
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



		searchVille: function(cdp) {
			$(".az-contact-information-ville select", this.el).empty();
			if (!cdp || cdp.length < 4) {
				$(".az-contact-information-ville", this.el).hide();
				return;
			}
			$(".az-contact-information-ville", this.el).show();
			var villes = az.configuration.get("villes").filter(function(v) {
				return v.get("CP_VILLE") === cdp;
			});
			_.each(villes, function(v) {
				$(".az-contact-information-ville select", this.el).append($("<option>", {value: v.get("ID_VILLE"), text: v.get("NOM_VILLE")}).text(v.get("NOM_VILLE")));
			}, this);
		},

		createValidators: function(type) {
			try {
				if (this.bootstrapValidator)
					this.bootstrapValidator.destroy();
			} catch (e) {

			}
			// Create validator
			var $form = type === Contact.Type.ADULTE ? $('.az-contact-information-form .az-contact-information-adulte', this.el) : $('.az-contact-information-form .az-contact-information-enfant', this.el);
			$form.bootstrapValidator({
		        feedbackIcons: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },
		        fields: {
		            nom: {
						validators: {
							notEmpty: {message: i18n.contact_information_champ_requis_tooltip}
						}
					},
					prenom: {
						validators: {
							notEmpty: {message: i18n.contact_information_champ_requis_tooltip}
						}
					},
					naissance: {
						validators: {
							notEmpty: {message: i18n.contact_information_champ_requis_tooltip},
							date: {
								format: 'DD/MM/YYYY',
								message: i18n.contact_information_erreur_date_tooltip
							}
						}
					},
					codePostal: {
						validators: {
							notEmpty: {message: i18n.contact_information_champ_requis_tooltip}
						}
					},
					telephone: {
						validators: { //
							regexp: {
								regexp: /^[0-9]{2}[-\s\.]{0,1}[0-9]{2}[-\s\.]{0,1}[0-9]{2}[-\s\.]{0,1}[0-9]{2}[-\s\.]{0,1}[0-9]{2}[-\s\.]{0,1}$/,
								message: i18n.contact_information_erreur_tel_tooltip
							}
						}
					},
					time: {
						validators: {
							regexp: {
								regexp: /^[0-9]{2}[:]{1}[0-9]{2}[:]{1}[0-9]{2}$/,
								message: i18n.contact_information_erreur_time_tooltip
							}
						}
					},
					email: {
						validators: {
							emailAddress: {message: i18n.contact_information_erreur_email_tooltip}
						}
					}
		        }
		    });
			this.bootstrapValidator = $form.data('bootstrapValidator');
		},

		loading: function() {
			$(this.el).addClass("loading");
		},

		setContact: function(contact) {
			$(this.el).removeClass("loading");
			$(".reset-contact", this.el).prop("disabled", true);
			$(".save-contact", this.el).prop("disabled", true);
			$(".az-contact-information-adulte", this.el).hide();
			$(".az-contact-information-enfant", this.el).hide();
			$(".az-contact-information-empty-contact", this.el).hide();

			if (contact) {
				this.currentContact = contact;
				if (contact.get("type") === Contact.Type.ENFANT) {
					this.setEnfant(contact);
				} else if (contact.get("type") === Contact.Type.ADULTE) {
					this.setAdulte(contact);
				}
				this.createValidators(contact.get("type"));
			} else {
				$(".az-contact-information-empty-contact", this.el).show();
			}
			
		},

		setEnfant: function(enfant) { // 
			$(".az-contact-information-enfant", this.el).show();
			$(".az-contact-information-enfant .az-contact-information-nom .form-control", this.el).val(enfant.get("NOM_ENFANT"));
			$(".az-contact-information-enfant .az-contact-information-prenom .form-control", this.el).val(enfant.get("PRENOM_ENFANT"));
			$(".az-contact-information-enfant .az-contact-information-date-naissance .form-control", this.el).val(az.Utils.dateFormat(new Date(enfant.get("NAISSANCE_ENFANT")), "dd/mm/yyyy"));
			$(".az-contact-information-enfant .az-contact-information-telephone .form-control", this.el).val(enfant.get("TEL_ENFANT"));
			$(".az-contact-information-enfant .az-contact-information-civilite .form-control", this.el).val(enfant.get("ID_CIVILITE"));

			$(".az-contact-information-enfant .az-contact-information-certificat-medical input", this.el).prop('checked', enfant.get("CERTIFICAT") === 1);
			$(".az-contact-information-enfant .az-contact-information-droit-image input", this.el).prop('checked', enfant.get("DROIT_IMAGE") === 1);
			$(".az-contact-information-enfant .az-contact-information-rentre-seul .az-contact-information-rentre-seul-checkbox", this.el).prop('checked', enfant.get("RENTRE_SEUL") === 1);
			if (enfant.get("RENTRE_SEUL") === 1) {
				$(".az-contact-information-enfant .az-contact-information-rentre-seul .az-contact-information-rentre-seul-input", this.el).val(enfant.get("HORAIRE"));
				$(".az-contact-information-enfant .az-contact-information-rentre-seul .az-contact-information-rentre-seul-input", this.el).show();
			} else {
				$(".az-contact-information-enfant .az-contact-information-rentre-seul .az-contact-information-rentre-seul-input", this.el).hide();
			}
			$(".az-contact-information-enfant .az-contact-information-recomemndation.form-control", this.el).val(enfant.get("RECOMMENDATIONS"));
			$(".az-contact-information-enfant .az-contact-information-info-medical.form-control", this.el).val(enfant.get("INFORMATIONS_MEDICALES"));

			if (enfant.get("parents")) {
				enfant.get("parents").each(function(p) {
					var fullName  =p.get("ABREVIATION_CIVILITE") +" "+ p.get("PRENOM_MEMBRE") + " " + p.get("NOM_MEMBRE");
					$(".az-contact-information-residence select", this.el).append($("<option>", {value: p.get("ID_MEMBRE"), text: fullName}).text(fullName));
				}, this);
				$(".az-contact-information-residence select", this.el).val(enfant.get("ID_MEMBRE"));
			}
		},

		setAdulte: function(adulte) {
			$(".az-contact-information-adulte", this.el).show();

			$(".az-contact-information-adulte .az-contact-information-civilite .form-control", this.el).val(adulte.get("ID_CIVILITE"));
			$(".az-contact-information-adulte .az-contact-information-nom .form-control", this.el).val(adulte.get("NOM_MEMBRE"));
			$(".az-contact-information-adulte .az-contact-information-prenom .form-control", this.el).val(adulte.get("PRENOM_MEMBRE"));

			$(".az-contact-information-adulte .az-contact-information-date-naissance .form-control", this.el).val(az.Utils.dateFormat(new Date(adulte.get("NAISSANCE_MEMBRE")), "dd/mm/yyyy"));
			$(".az-contact-information-adulte .az-contact-information-telephone .form-control", this.el).val(adulte.get("TEL1_MEMBRE"));
			$(".az-contact-information-adulte .az-contact-information-telephone2 .form-control", this.el).val(adulte.get("TEL2_MEMBRE"));

			$(".az-contact-information-adulte .az-contact-information-email .form-control", this.el).val(adulte.get("MAIL_MEMBRE"));
			$(".az-contact-information-adulte .az-contact-information-adresse .form-control", this.el).val(adulte.get("ADR_MEMBRE"));
			$(".az-contact-information-adulte .az-contact-information-cdp .form-control", this.el).val(adulte.get("CP_VILLE"));

			$(".az-contact-information-adulte .az-contact-information-secu .form-control", this.el).val(adulte.get("NUM_SECU_MEMBRE"));
			$(".az-contact-information-adulte .az-contact-information-employeur .form-control", this.el).val(adulte.get("NOM_EMPLOYEUR"));
			$(".az-contact-information-adulte .az-contact-information-lieu-travail .form-control", this.el).val(adulte.get("LIEU_TRAVAIL"));
			$(".az-contact-information-adulte .az-contact-information-telephone-travail .form-control", this.el).val(adulte.get("TELT_MEMBRE"));

			$(".az-contact-information-adulte .az-contact-information-parent input", this.el).prop('checked', adulte.get("PARENT") === 1);
			$(".az-contact-information-adulte .az-contact-information-allocataire-caf input", this.el).prop('checked', adulte.get("ALLOCATAIRE_CAF") === 1);
			$(".az-contact-information-adulte .az-contact-information-allocataire-msa input", this.el).prop('checked', adulte.get("ALLOCATAIRE_MSA") === 1);

			this.searchVille(adulte.get("CP_VILLE"));
			$(".az-contact-information-ville select", this.el).val(adulte.get("ID_VILLE"))
		},

		events: {
			"click .az-contact-information-toolbar .reset-contact": "onResetClicked",
			"click .az-contact-information-toolbar .save-contact": "onSaveCliked",
			"input .az-contact-information-adulte input": "onAdulteInformationChanged",
			"change .az-contact-information-adulte select": "onAdulteInformationChanged",
			"input .az-contact-information-enfant input": "onEnfantInformationChanged",
			"change .az-contact-information-enfant select": "onEnfantInformationChanged",
			"input .az-contact-information-adulte .az-contact-information-cdp input": "onCDPChanged",
			"click .az-contact-information-enfant .az-contact-information-rentre-seul-checkbox": "onRentreSeulChanged",
			"click .az-contact-information-enfant input[type='checkbox']": "onEnfantInformationChanged",
			"click .az-contact-information-adulte input[type='checkbox']": "onAdulteInformationChanged",
			"keyup textarea": "onEnfantInformationChanged"
		},

		onRentreSeulChanged: function() {
			if ($(".az-contact-information-enfant .az-contact-information-rentre-seul-checkbox", this.el).is(":checked")) {
				$(".az-contact-information-enfant .az-contact-information-rentre-seul .az-contact-information-rentre-seul-input", this.el).show();
			} else {
				$(".az-contact-information-enfant .az-contact-information-rentre-seul .az-contact-information-rentre-seul-input", this.el).hide();
				$(".az-contact-information-enfant .az-contact-information-rentre-seul i", this.el).hide();
				$(".az-contact-information-enfant .az-contact-information-rentre-seul small", this.el).hide();
				$(".az-contact-information-enfant .az-contact-information-rentre-seul .az-contact-information-rentre-seul-input", this.el).val("00:00:00");
			}
		},

		onCDPChanged: function() {
			this.searchVille($(".az-contact-information-adulte .az-contact-information-cdp input", this.el).val());
		},

		onEnfantInformationChanged: function() {
			$(".reset-contact", this.el).prop("disabled", false);
			$(".save-contact", this.el).prop("disabled", false);
		},

		onAdulteInformationChanged: function() {
			$(".reset-contact", this.el).prop("disabled", false);
			$(".save-contact", this.el).prop("disabled", false);
		},

		onResetClicked: function() {
			this.setContact(this.currentContact);
		},

		onSaveCliked: function() {
			if (!this.bootstrapValidator) {
				return;
			}
			this.bootstrapValidator.validate();
			if (!this.bootstrapValidator || !this.bootstrapValidator.isValid()) {
			 	this.displayInfoMessage("error", i18n.contact_bad_update_request);
			 	return;
			}
			var newContact = new Contact(this.currentContact.attributes);

			if (newContact.get("type") === Contact.Type.ADULTE) {
				var $adulteForm = $(".az-contact-information-adulte", this.el);
				var dateNaissance = $(".az-contact-information-date-naissance .form-control", $adulteForm).val().split("/");
				// Get new values
				newContact.set("ID_CIVILITE", $(".az-contact-information-civilite .form-control", $adulteForm).val());
				newContact.set("NOM_MEMBRE", $(".az-contact-information-nom .form-control", $adulteForm).val());
				newContact.set("PRENOM_MEMBRE", $(".az-contact-information-prenom .form-control", $adulteForm).val());
				newContact.set("NAISSANCE_MEMBRE", dateNaissance[2] + "-" + dateNaissance[1]+ "-"+ dateNaissance[0]);
				newContact.set("TEL1_MEMBRE", $(".az-contact-information-telephone .form-control", $adulteForm).val());
				newContact.set("TEL2_MEMBRE", $(".az-contact-information-telephone2 .form-control", $adulteForm).val());
				newContact.set("MAIL_MEMBRE", $(".az-contact-information-email .form-control", $adulteForm).val());
				newContact.set("ADR_MEMBRE", $(".az-contact-information-adresse .form-control", $adulteForm).val());
				newContact.set("ID_VILLE", $(".az-contact-information-ville select", this.el).val());
				newContact.set("CP_VILLE", $(".az-contact-information-cdp input", $adulteForm).val());
				newContact.set("NUM_SECU_MEMBRE", $(".az-contact-information-secu .form-control", $adulteForm).val());
				newContact.set("NOM_EMPLOYEUR", $(".az-contact-information-employeur .form-control", $adulteForm).val());
				newContact.set("LIEU_TRAVAIL", $(".az-contact-information-lieu-travail .form-control", $adulteForm).val());
				newContact.set("TELT_MEMBRE", $(".az-contact-information-telephone-travail .form-control", $adulteForm).val());
				newContact.set("PARENT", $(".az-contact-information-parent input", $adulteForm).is(":checked") ? 1 : 0);
				newContact.set("ALLOCATAIRE_CAF", $(".az-contact-information-allocataire-caf input", $adulteForm).is(":checked") ? 1 : 0);
				newContact.set("ALLOCATAIRE_MSA", $(".az-contact-information-allocataire-msa input", $adulteForm).is(":checked") ? 1 : 0);
				// save the contact
				contactManager.saveAdulte(newContact).then(_.bind(function() {
					this.displayInfoMessage("success",i18n.contact_updated);
					this.setContact(newContact);
				}, this));
			}
			if (newContact.get("type") === Contact.Type.ENFANT) { 
				var $enfantForm = $(".az-contact-information-enfant", this.el);
				var dateNaissance = $(".az-contact-information-date-naissance .form-control", $enfantForm).val().split("/");
				newContact.set("NAISSANCE_ENFANT", dateNaissance[2] + "-" + dateNaissance[1]+ "-"+ dateNaissance[0]);
				newContact.set("ID_CIVILITE", $(".az-contact-information-civilite .form-control", $enfantForm).val());
				newContact.set("PRENOM_ENFANT", $(".az-contact-information-prenom .form-control", $enfantForm).val());
				newContact.set("NOM_ENFANT", $(".az-contact-information-nom .form-control", $enfantForm).val());
				newContact.set("TEL_ENFANT", $(".az-contact-information-telephone .form-control", $enfantForm).val());
				newContact.set("ID_MEMBRE", $(".az-contact-information-residence .form-control", $enfantForm).val());
				newContact.set("INFORMATIONS_MEDICALES", $(".az-contact-information-recomemndation", $enfantForm).val());
				newContact.set("RECOMMENDATIONS", $(".az-contact-information-info-medical", $enfantForm).val());
				newContact.set("RENTRE_SEUL", $(".az-contact-information-rentre-seul-checkbox", $enfantForm).is(":checked") ? 1 : 0);
				newContact.set("DROIT_IMAGE", $(".az-contact-information-droit-image input", $enfantForm).is(":checked") ? 1 : 0);
				newContact.set("CERTIFICAT", $(".az-contact-information-certificat-medical input", $enfantForm).is(":checked") ? 1 : 0);
				newContact.set("HORAIRE",$(".az-contact-information-rentre-seul .az-contact-information-rentre-seul-input", $enfantForm).val());
				newContact.set("ID_MEMBRE", $(".az-contact-information-residence select", $enfantForm).val());

				// save the contact
				contactManager.saveEnfant(newContact).then(_.bind(function() {
					this.displayInfoMessage("success",i18n.contact_updated);
					this.setContact(newContact);
				}, this));
			}
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
			setTimeout(_.bind(function() {
				$(".alert-container", this.el).empty();
				$(this.el).removeClass("alert-displayed");
			}, this), az.configuration.get("alert-timeout"));
		}
	});

	return ContactInformationView;
});

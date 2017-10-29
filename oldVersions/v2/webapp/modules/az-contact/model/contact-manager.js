/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          contact-manager.js
 */


define([
	'underscore', 'backbone', './contact', "az"
], function(_, Backbone, Contact, az) {
	var Log = new az.Log("ContactManager");
	var ContactManager = Backbone.Model.extend({

		initialize: function() { 
			this.set("contactList", new Backbone.Collection());
			this.set("familleList", new Backbone.Collection());
		},

		getFamilles: function() {
			var ajax = { type: "GET", url: "/api/familles", contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				if (data) {
					this.get("familleList").reset();
					_.each(data, function(d) {
						this.get("familleList").add(d);
					}, this);
				}
				return this.get("familleList");
			},this));
		},

		createFamille: function(nomFamille) {
			var ajax = { type: "POST", url: "/api/familles", contentType: 'application/json; charset=UTF-8'};
			ajax.data = JSON.stringify({ 
				nomFamille: nomFamille,
				operation:"Create"
			});
			return $.ajax(ajax);
		},

		createAdulte: function(idFamille, nom, prenom, naissance, civilite) {
			var ajax = { type: "POST", url: "/api/contacts", contentType: 'application/json; charset=UTF-8'};
			ajax.data = JSON.stringify({ 
				idFamille: idFamille,
				nom: nom,
				prenom: prenom,
				naissance: naissance,
				civilite: civilite,
				operation:"CreateAdulte"
			});
			return $.ajax(ajax);
		},

		createEnfant: function(idFamille, nom, prenom, naissance, civilite) {
			var ajax = { type: "POST", url: "/api/contacts", contentType: 'application/json; charset=UTF-8'};
			ajax.data = JSON.stringify({ 
				idFamille: idFamille,
				nom: nom,
				prenom: prenom,
				naissance: naissance,
				civilite: civilite,
				operation:"CreateEnfant"
			});
			return $.ajax(ajax);
		},

		// Get contacts
		// Return a collection of contact
		getContacts: function(refresh) {
			if (refresh) {
				var ajax = { type: "GET", url: "/api/contacts", contentType: 'application/json; charset=UTF-8'};
				return $.ajax(ajax).then(_.bind(function(data) {
					data = JSON.parse(data);
					if (data) {
						this.get("contactList").reset();
						_.each(data, function(d) {
							var contact = new Contact(d);
							if (!contact.get("ID_ENFANT")) {
								contact.set("type", Contact.Type.ADULTE);
							}else {
								contact.set("type", Contact.Type.ENFANT);
							}

							this.get("contactList").add(contact);
						}, this);
					}
					return this.get("contactList");
				},this));
			} else {
				return $.when(this.get("contactList"));
			}
		},

		getFullContact: function(contact) {
			if (contact.get("type") === Contact.Type.ADULTE) {
				return this.getFullAdulte(contact);
			} else {
				return this.getFullEnfant(contact).then(_.bind(function(contact) {
					return this.getFamille(contact.get("ID_FAMILLE")).then(_.bind(function(famille) {
						if (famille) {
							famille.get("membres").each(function(d) {
								if (d.get("PARENT"))
									contact.get("parents").add(d);
							}, this);
						}
						return $.when(contact);
					}, this));
				}, this));
			}
		},

		getFullAdulte: function(adulte) {
			if (!adulte) {
				return;
			}
			var idContact = adulte.get("ID_MEMBRE");
			var ajax = { type: "GET", url: "/api/contacts/adultes/"+idContact, contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				if (data && data.adulte) {
					adulte.set(data.adulte);
					adulte.get("adhesions").reset();
					adulte.get("activites").reset();
					adulte.get("factures").reset();
					if (data.adhesions) {
						_.each(data.adhesions, function(a) {
							adulte.get("adhesions").add(a);
						});
					}
					if (data.activites) {
						_.each(data.activites, function(a) {
							adulte.get("activites").add(a);
						});
					}
					if (data.factures) {
						_.each(data.factures, function(f) {
							if (az.Facture && az.Facture.Facture) {
								f = new az.Facture.Facture(f);
							}
							if (f.get("DATE_FACTURE"))
								f.set("DATE_FACTURE", az.Utils.dateFormat(new Date(f.get("DATE_FACTURE")), "dd/mm/yyyy"));
							adulte.get("factures").add(f);
						});
					}
					return adulte;
				}
				return null;
			},this));
		},

		getFullEnfant: function(enfant) {
			if (!enfant) {
				return;
			}
			var idContact = enfant.get("ID_ENFANT");
			var ajax = { type: "GET", url: "/api/contacts/enfants/"+idContact, contentType: 'application/json; charset=UTF-8'};
			return $.ajax(ajax).then(_.bind(function(data) {
				data = JSON.parse(data);
				if (data && data.enfant) {
					enfant.set(data.enfant);
					enfant.get("adhesions").reset();
					enfant.get("activites").reset();
					enfant.get("factures").reset();
					if (data.adhesions) {
						_.each(data.adhesions, function(a) {
							enfant.get("adhesions").add(a);
						});
					}
					if (data.activites) {
						_.each(data.activites, function(a) {
							enfant.get("activites").add(a);
						});
					}
					if (data.factures) {
						_.each(data.factures, function(f) {
							if (az.Facture && az.Facture.Facture) {
								f = new az.Facture.Facture(f);
							}
							if (f.get("DATE_FACTURE"))
								f.set("DATE_FACTURE", az.Utils.dateFormat(new Date(f.get("DATE_FACTURE")), "dd/mm/yyyy"));
							enfant.get("factures").add(f);
						});
					}
					return enfant;
				}
				return null;
			},this));
		},


		saveAdulte: function(adulte) {
			if (adulte) {
				var ajax = { type: "POST", url: "/api/contacts/adultes/"+adulte.get("ID_MEMBRE"), contentType: 'application/json; charset=UTF-8'};
				ajax.data = JSON.stringify({ adulte: adulte.attributes, operation:"Update"});
				return $.ajax(ajax).then(_.bind(function(data) {
					Log.debug(data);
				}, this));
			}
		},

		saveEnfant: function(enfant) {
			if (enfant) {
				var ajax = { type: "POST", url: "/api/contacts/enfants/"+enfant.get("ID_ENFANT"), contentType: 'application/json; charset=UTF-8'};
				ajax.data = JSON.stringify({ enfant: enfant.attributes, operation:"Update"});
				return $.ajax(ajax).then(_.bind(function(data) {
					Log.debug(data);
				}, this));
			}
		},

		createAdhesion: function(contact, montant, annee, numeroAdherent) {
			if (contact) {
				var text = (new Date(annee.get("DATE_DEBUT")).getUTCFullYear()) + " - " + (new Date(annee.get("DATE_FIN")).getUTCFullYear());
				var motif = "Adhésion à l'association pour l'année "+text;
				var idAnnee = annee.get("ID_ANNEE");
				var ajax = {};
				if (contact.get("type") === Contact.Type.ADULTE) {
					ajax = { type: "POST", url: "/api/contacts/adultes/"+contact.get("ID_MEMBRE"), contentType: 'application/json; charset=UTF-8'};
				} else {
					ajax = { type: "POST", url: "/api/contacts/enfants/"+contact.get("ID_ENFANT"), contentType: 'application/json; charset=UTF-8'};
				}
				ajax.data = JSON.stringify(
				{ 
					idFamille: contact.get("ID_FAMILLE"),
					montant: montant,
					numeroAdherent: numeroAdherent,
					idAnnee: idAnnee,
					motif: motif, 
					idMembre: contact.get("ID_MEMBRE"),
					operation:"CreateAdhesion"
				});
				return $.ajax(ajax).then(_.bind(function(data) {
					Log.debug(data);
					data = JSON.parse(data);
					contact.get("adhesions").add(data.adhesion);
				}, this));
			}
		},

		updateAdhesion: function(numeroAdherent, contact, annee) {
			if (contact) {
				var idAnnee = annee.get("ID_ANNEE");
				var ajax = {};
				if (contact.get("type") === Contact.Type.ADULTE) {
					ajax = { type: "POST", url: "/api/contacts/adultes/"+contact.get("ID_MEMBRE"), contentType: 'application/json; charset=UTF-8'};
				} else {
					ajax = { type: "POST", url: "/api/contacts/enfants/"+contact.get("ID_ENFANT"), contentType: 'application/json; charset=UTF-8'};
				}
				ajax.data = JSON.stringify(
				{ 
					numeroAdherent: numeroAdherent,
					idAnnee: idAnnee,
					idMembre: contact.get("ID_MEMBRE"),
					operation:"UpdateAdhesion"
				});
				return $.ajax(ajax).then(_.bind(function(data) {
					Log.debug(data);
				}, this));
			}
		},

		getFamille: function(id) {
			if (id) {
				var membres = new Backbone.Collection();
				var ajax = { type: "GET", url: "/api/familles/"+id, contentType: 'application/json; charset=UTF-8'};
				return $.ajax(ajax).then(_.bind(function(data) {
					data = JSON.parse(data);
					if (data) {
						var famille = new Backbone.Model(data);
						_.each(data.membres, function(d) {
							membres.add(d);
						}, this);
						famille.set("membres", membres);
						return famille;
					}
					return null;
				},this));
			}
		},

		saveFamille: function(contact) {
			if (contact) {
				var ajax = { type: "POST", url: "/api/familles/"+contact.get("ID_FAMILLE"), contentType: 'application/json; charset=UTF-8'};
				ajax.data = JSON.stringify({ contact: contact.attributes, operation:"Update"});
				return $.ajax(ajax).then(_.bind(function(data) {
					Log.debug(data);
				}, this));
			}
		},

	});

	return ContactManager;
});

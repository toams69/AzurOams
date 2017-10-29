define([
	'az', './view/inscription-dialog/inscription-dialog', './singleton/activite-manager'
], function(
	AZ, InscriptionDialog, activiteManager
) {
	
	AZ.Activite = {
		Dialog: {
			InscriptionDialog: InscriptionDialog
		}
	};
	AZ.activiteManager = activiteManager;
	
	return AZ;
});
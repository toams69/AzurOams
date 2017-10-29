define([
	'az',
	'./singleton/facture-manager',
	'./model/facture'
], function(
	AZ,
	factureManager,
	Facture
) {
	
	AZ.Facture = {
		Facture: Facture
	};
	AZ.factureManager = factureManager;
	
	return AZ;
});
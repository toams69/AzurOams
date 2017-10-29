define([
	'az',
	'./singleton/contact-manager'
], function(
	AZ, contactManager
) {
	
	AZ.Contact = {
		
	};
	
	AZ.contactManager = contactManager;
	return AZ;
});
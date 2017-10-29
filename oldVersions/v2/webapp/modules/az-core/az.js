
define([
	'./model/logger',
	'./singleton/agent',
	'./singleton/view-manager',
	'./singleton/event-broker',
	'./singleton/configuration',
	'./singleton/stats-manager',
	'./common/utils'
], function(
	Logger,
	agent,
	viewManager,
	eventBroker,
	configuration,
	statsManager,
	Utils
) {
	var AZ = window.az;
	AZ.Main = {
		
	};
	
	AZ.Log = Logger;
	// Singletion
	AZ.agent = agent;
	AZ.viewManager = viewManager;
	AZ.eventBroker = eventBroker;
	AZ.configuration = configuration;
	AZ.statsManager = statsManager;
	AZ.Utils = Utils;
	return AZ;
});
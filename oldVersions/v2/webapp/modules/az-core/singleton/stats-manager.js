/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          stats-manager.js
 */

define([
	'../common/stats-manager'
], function(
	StatsManager
) {
	/**
	 * The statsManager object is a singleton and an instance of the class {@link Main.StatsManager}.
	 * @name statsManager
	 * @global
	 */
	return new StatsManager();
});
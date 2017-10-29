/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          view-manager.js
 */

define([
	'../common/view-manager'
], function(
	ViewManager
) {
	/**
	 * The viewManager object is a singleton and an instance of the class {@link Main.ViewManager}.
	 * @name viewManager
	 * @global
	 */
	return new ViewManager();
});
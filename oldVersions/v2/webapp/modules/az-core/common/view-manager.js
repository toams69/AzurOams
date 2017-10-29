/*!
 * @License Azuroams
 * Copyright (c) 2013 EPartner
 * All rights reserved.
 * USER NAME:          Thomas Pariaud <tpariaud@gmail.com>
 * FILE NAME:          view-manager.js
 */

define([
	'underscore', 'backbone'
], function(
	_, Backbone
) {

	/**
	 * This class manages the regions and the views.
	 * 
	 * For instance, to automatically instantiate the view
	 * "CustomWorkspaceView" (which inherits from the class {@link external:"Backbone.View"})
	 * in the region "AgentDesktopWorkspace" when it is needed,
	 * just add a new view descriptor at the module initialisation time.
	 * @example
	 * var CustomWorkspaceView = Backbone.View.extend({
	 * 	render: function() {
	 * 		$(this.el).html('<div>My custom view</div>');
	 * 	}
	 * });
	 * 
	 * viewManager.add("AgentDesktopWorkspace", [{
	 * 	name: "CustomWorkspaceView",
	 * 	view: CustomWorkspaceView,
	 * 	title: "Extension"
	 * }]);
	 * @constructor Main.ViewManager
	 * @augments external:"Backbone.Model"
	 * @memberof Main
	 */
	var ViewManager = Backbone.Model.extend(
	/** @lends Main.ViewManager# */
	{

		/**
		 * Initializes the ViewManager.
		 * @return {Main.ViewManager} Itself.
		 * @ignore
		 */
		initialize: function() {
			this.viewsByRegion = {};
			return this;
		},

		/**
		 * Adds view descriptors to a region. The view is then automatically added when the region need to be instantiated.
		 * For instance, to automatically instantiate the view
		 * "CustomWorkspaceView" (which inherits from the class {@link external:"Backbone.View"})
		 * in the region "AgentDesktopWorkspace" when it is needed,
		 * just add a new view descriptor at the module initialisation time.
		 * @example
		 * var CustomWorkspaceView = Backbone.View.extend({
		 * 	render: function() {
		 * 		$(this.el).html('<div>My custom view</div>');
		 * 	}
		 * });
		 * 
		 * viewManager.add("AgentDesktopWorkspace", [{
		 * 	view: CustomWorkspaceView,
		 * 	title: "Extension"
		 * }]);
		 * @param {string} regionName The region name.
		 * @param {object[]} views The descriptors of the views.
		 * @return {Main.ViewManager} Itself.
		 */
		add: function(regionName, views) {
			console.debug("add('" + regionName + "', ...)");

			var viewDecriptors = this.viewsByRegion[regionName];
			if(!viewDecriptors) {
				viewDecriptors = this.viewsByRegion[regionName] = [];
			}
			for(var i = 0; i < views.length; i++) {
				var view = views[i];
				viewDecriptors.push(view);
			}
			return this;
		},

		/**
		 * Get the view descriptor for a specific region.
		 * @param {string} regionName The region name.
		 * @return {ChainOfCommand} The added command which can be chain with add().
		 */
		get: function(regionName) {
			console.debug("add('" + regionName + "', ...)");

			return this.viewsByRegion[regionName];
		},
		
		//, viewDescriptorByViewInstance: {},
		
		/**
		 * Add a view in a specify DOM element. This is to dynamically add a new view.
		 * @example
		 * // To show the "AgentStateView" panel in the HTML tag: <div id="myCustomAgentState"></div>
		 * var agentStateView = viewManager.addView($("#myCustomAgentState"), viewManager.CommonView.AgentStateView);
		 * @param {HTMLElement} domElement The HTML container element where the view will be appended.
		 * @param {string} viewName The path to the view. I.e.: "module/wwe-main/view/agent-state-view/agent-state-view".
		 * Or a predefined value {@link Main.ViewManager.CommonView}.
		 * @param {object} [context] A specific contextual object used when the view is instantiated.
		 * @return {Backbone.View} The instantiated view or null if an error occurs.
		 */
		addView: function(domElement, viewName, context) {
			if(domElement) {
				var ViewClass = null;
				try { ViewClass = require(viewName); } catch(e) {}
				if(ViewClass) {
					try {
						var viewInstance = (context ? new ViewClass(context) : new ViewClass(context));
						if(viewInstance instanceof Backbone.View) {
							$(domElement).append(viewInstance.render().el);
							return viewInstance;
						}
					} catch(e) {
						if(console)
							console.error("Cannot add the view '" + viewName + "': " + e);
					}
				}
				$(domElement).append("Cannot find the specify view:" + viewName);
			}
			return null;
		},

		/**
		 * Erase all the view of viewManager.
		 * @return {Main.CommandManager} Itself.
		 */
		reset: function() {
			console.debug("reset()");

			this.viewsByRegion = {};
			return this;
		},

		/**
		 * Remove a view instantiated with {@link Main.ViewManager#addView}.
		 * @example
		 * // To remove the previously instantiated view:
		 * viewManager.removeView(agentStateView);
		 * @param {Backbone.View} viewInstance The instantiated view to remove.
		 * @return {Backbone.View} The instantiated view.
		 */
		removeView: function(viewInstance) {
			if(viewInstance)
				try {
					viewInstance.remove();
				} catch(e) {
					if(console)
						console.error("Cannot remove the view: " + e);
				}
		},

		/**
		 * Dump the customizable regions and its views.
		 * @ignore
		 */
		dump: function() {
			var regionNames = Object.keys(this.viewsByRegion).sort();
			var result = "Views and Regions in wikimarkup:\n";
			result += "{|\n|-\n! Region\n! Views\n";
			for(var i = 0; i < regionNames.length; i++) {
				var viewDecriptorName = regionNames[i];
				var viewDecriptors = this.viewsByRegion[viewDecriptorName];
				if(viewDecriptors) {
					result += "|-\n";
					result += "| " + viewDecriptorName + "\n";
					result += "| ";
					for(var j = 0; j < viewDecriptors.length; j++) {
						var viewDecriptor = viewDecriptors[j];
						if(j > 0) result += ", ";
						if(viewDecriptor.name)
							result += viewDecriptor.name;
						else
							result += "Unamed";
					}
					result += "\n";
				}
			}
			result += "|}";

			console.log(result);
		}
	});

	return ViewManager;
});

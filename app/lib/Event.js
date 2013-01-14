/**
 * Handle global events for the SmartWFM.
 *
 * @author Morris Jobke
 * @since 0.10
 */
Ext.define('SmartWFM.lib.Event', {
	singleton: true,

	/**
	 * List of events and event handlers
	 *
	 * @protected
	 * @type Object
	 * @since 0.10
	 */
	events: {
		'activateFolder': [],		// args: path, [newHistoryIndex]
		'tabSwitched': [],			// args: path
		'settingsChanged': [],		// args: [changed settings]
		'newTab': [],				// args: path, activate
		'clearFilter': [],
		'applyFilter': [],			// args: useAsRegex, caseSensitive
		'refresh': []				// args: path
	},

	/**
	 * Indicated activation state of event manager
	 *
	 * @protected
	 * @type Boolean
	 * @since 0.10
	 */
	activated: true,

	/**
	 * Fire an event
	 *
	 * @param {String} component The name of the component
	 * @param {String} eventName The name of the event
	 * @param {Mixed} [moreOptions] Append more options if the event requires it
	 *
	 * @return {Mixed} The value of the config option OR the defaultValue if the config option doesn't exist.
	 *
	 * @since 0.10
	 */
	fire: function (component, eventName) {
		console.groupCollapsed('SmartWFM.lib.Event.fire()');
		console.debug('Arguments: ', arguments);
		if (this.activated && this.events[eventName] !== undefined) {
			console.log('Event found');
			// remove two elements from start
			var args = [];
			var i;
			for (i = 2; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			var ev;
			console.groupEnd();
			for (i = 0; i < this.events[eventName].length; i++) {
				ev = this.events[eventName][i];
				//if (component !== ev['component']) {
					ev['callback'].apply(ev['scope'], args);
				//}
			}
		} else {
			console.groupEnd();
		}
	},

	/**
	 * Register a new event handler.
	 *
	 * @param {String} component The name of the component
	 * @param {String} eventName The name of the event
	 * @param {Object} opt The options object with callback and scope
	 *
	 * @since 0.10
	 */
	register: function (component, eventName, opt) {
		console.groupCollapsed('SmartWFM.lib.register()');
		console.debug('Arguments: ', arguments);

		var callback = opt['callback'];
		var scope = opt['scope'];
		if (callback === undefined) {
			console.warn('Event not registered because callback function is undefined');
			console.groupEnd();

			return false;
		}
		if (this.events[eventName] !== undefined) {
			this.events[eventName].push({
				callback: callback,
				//component: component,
				scope: scope
			});
		} else {
			console.warn('Event not registered because event is not available');
			console.groupEnd();

			return false;
		}
		console.groupEnd();
	},


	/**
	 * Activate all events
	 *
	 * @since 0.10
	 */
	activate: function() {
		this.activated = true;
	},

	/**
	 * Deactivate all events
	 *
	 * @since 0.10
	 */
	deactivate: function() {
		this.activated = false;
	}
});
/**
 * This class manages components. You can register components and then define in the config, where they should placed.
 *
 * @author Morris Jobke
 * @since 0.10
*/
Ext.define('SmartWFM.lib.Component', {
	singleton: true,

	/**
	 * An array to hold all registered components
	 *
	 * @protected
	 * @type Object
	 * @since 0.10
	 */
	components: {
		'toolbar': {},
		'statusbar': {},
		'widget': {}
	},

	/**
	 * Get components by type
	 *
	 * @param {String} cmpType The component type
	 * @param {String} cmpName The name of component
	 *
	 * @return {Array} A list of components or 'undefined' if an error occurs
	 *
	 * @since 0.10
	 */
	get: function (cmpType, cmpName) {
		if(this.components[cmpType] !== undefined && this.components[cmpType][cmpName] !== undefined) {
			return this.components[cmpType][cmpName];
		}
		console.warn('Component not found - cmpType: ' + cmpType + ' cmpName: ' + cmpName);
		return undefined;
	},

	/**
	 * Add a new component to the global component store
	 *
	 * @param {String} cmpType The type of component. Possible values are: toolbar, statusbar and widget
	 * @param {String} cmpName The name of component
	 * @param {Object} cmp The component object
	 *
	 * @return {Boolean} True if everything went fine, else false
	 *
	 * @since 0.10
	 */
	register: function (cmpType, cmpName, cmp) {
		if(this.components[cmpType] !== undefined) {
			this.components[cmpType][cmpName] = cmp;
		} else {
			console.warn('Can\'t register component ', cmp, ' using the given type ', cmpType);
			return false;
		}
		return true;
	}
})
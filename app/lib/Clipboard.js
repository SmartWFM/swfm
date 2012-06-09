/**
 * This class handles some clipboard stuff.
 *
 * @author Morris Jobke
 * @since 0.10
*/
Ext.define('SmartWFM.lib.Clipboard', {
	singleton: true,

	/**
	 * Data of the clipboard
	 *
	 * @protected
	 * @type Mixed
	 * @since 0.10
	 */
	cbData: undefined,

	/**
	 * Get data from clipboard
	 *
	 * @return {Mixed} The value you put to the clipboard
	 *
	 * @since 0.10
	 */
	get: function () {
		console.groupCollapsed('SmartWFM.lib.Clipboard.get()');
		console.debug('Return: ', this.cbData);
		console.groupEnd();
		return this.cbData;
	},

	/**
	 * Pop data from clipboard
	 *
	 * @return {Mixed} The value you put to the clipboard
	 *
	 * @since 0.10
	 */
	pop: function () {
		console.groupCollapsed('SmartWFM.lib.Clipboard.pop()');
		console.debug('Return: ', this.cbData);
		console.groupEnd();
		var data = this.cbData;
		this.cbData = undefined;
		return data;
	},

	/**
	 * Put data to Clipboard
	 *
	 * @param {String} command The name of the command
	 * @param {Mixed} data The clipboard data
	 * @param {Object} callback The callback function
	 *
	 * @since 0.10
	 */
	put: function (command, data, callback) {
		console.groupCollapsed('SWFM.Clipboard.put()');
		console.debug('Arguments: ', arguments);
		console.groupEnd();
		this.cbData = {
			command: command,
			data: data,
			callback: callback
		};
	}
})
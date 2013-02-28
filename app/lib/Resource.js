/**
 * TODO
 *
 * @author Morris Jobke
 * @since 0.11
*/
Ext.define('SmartWFM.lib.Resource', {
	singleton: true,

	requires: [
		'SmartWFM.lib.Url'
	],

	/**
	 * Load CSS files dynamically.
	 *
	 * @param {String} arguments This function uses the join function from the
	 * url class to join the given params to a valid url and loads the file
	 *
	 * @since 0.11
	 */
	loadCSS: function () {
		console.groupCollapsed('SmartWFM.lib.Resource.loadCSS()');
		console.debug('Arguments: ', arguments);

		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('link');
		style.rel = 'stylesheet';
		style.type = 'text/css';

		// join the arguments to get an valid url
		style.href = SmartWFM.lib.Url.join.apply(this, arguments);

		head.appendChild(style);

		console.groupEnd();
	},

	/**
	 * Load JS files dynamically.
	 *
	 * @param {String} arguments This function uses the join function from the
	 * url class to join the given params to a valid url and loads the file
	 *
	 * @since 0.11
	 */
	loadJS: function () {
		console.groupCollapsed('SmartWFM.lib.Resource.loadJS()');
		console.debug('Arguments: ', arguments);

		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');

		// join the arguments to get an valid url
		script.src = SmartWFM.lib.Url.join.apply(this, arguments);

		head.appendChild(script);

		console.groupEnd();
	}
})
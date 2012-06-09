/**
 * Handle all the URL stuff for us.
 *
 * @author Morris Jobke
 * @since 0.10
 */
 Ext.define('SmartWFM.lib.Url', {
	singleton: true,

	requires: [
		'SmartWFM.lib.Path',
		'SmartWFM.lib.Config'
	],

	/**
	 * Return an URL for an icon
	 *
	 * @param {String} name Name of icon
	 * @param {String} [type] Type of icon (default: 'mimetype')
	 * @param {String} [size] Size of icon (default: '64x64')
	 *
	 * @return {String} The URL for the given icon
	 *
	 * @since 0.10
	 */
	getIcon: function(name, type, size) {
		if (type === undefined) {
			type = 'mimetype';
		}
		if (size === undefined) {
			size = '64x64';
		}

		return this.joinTheme('icons', size, type, name);
	},

	/**
	 * Encode an URL
	 *
	 * @param {String} url URL
	 * @param {Object} params Parameter to encode
	 *
	 * @return {String} The URL
	 *
	 * @since 0.10
	 */
	encode: function (url, params) {
		return url + '?' + Ext.Object.toQueryString(params);
	},

	/**
	 * Join an URL
	 *
	 * @param {String} arguments URL components to join
	 *
	 * @return {String} The URL
	 *
	 * @since 0.10
	 */
	join: function () {
		//  DIY - use same code from SmartWFM.lib.Path.join
		var tmp = SmartWFM.lib.Path.join.apply(SmartWFM.lib.Path, arguments);

		if (tmp.charAt(0) === '/') {
			return tmp;
		} else {
			var baseUrl = SmartWFM.lib.Config.get('baseUrl');
			//check if the baseUrl is already in the generated url
			var re = new RegExp('^' + baseUrl);
			if (re.test(tmp)) {
				return tmp;
			} else {
				if (baseUrl.charAt(baseUrl.length - 1) !== '/') {
					baseUrl += '/';
				}
				return baseUrl + tmp;
			}
		}
	},

	/**
	 * Join an URL for the theme
	 *
	 * @param {String} arguments File to get URL in 'theme' folder
	 *
	 * @return {String} The URL
	 *
	 * @since 0.10
	 */
	joinTheme: function () {
		var theme = SmartWFM.lib.Config.get('theme');
		var args = ['resources', 'themes', theme];
		for (var i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}

		return this.join.apply(this, args);
	}
});
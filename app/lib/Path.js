/**
 * Contains path-related functionallity.
 *
 * @author Morris Jobke
 * @since 0.10
 */
Ext.define('SmartWFM.lib.Path', {
	singleton: true,

	/**
	 * Join a path
	 *
	 * @param {String} args Path components to join
	 *
	 * @since 0.10
	 */
	join: function() {
		/* convert arguments to an Array (http://stackoverflow.com/questions/2091138/why-doesnt-join-work-with-function-arguments),
		 * join it with slash and
		 * replace all multiple slashes with a single slash
		 */
		return Array.prototype.slice.call(arguments).join('/').replace(/\/+/g, '/');
	},

	/**
	 * Get the Name of the given file/directory
	 *
	 * @param {String} path Path to extract name
	 *
	 * @since 0.10
	 */
	getName: function(path, defaultValue) {
		// split path at '/'
		var splittedPath = path.split('/');
		// clean empty strings
		var cleanedSplittedPath = Ext.Array.clean(splittedPath);
		var size = cleanedSplittedPath.length;
		if (size > 0)
			return cleanedSplittedPath[size-1];
		else
			return defaultValue;
	},

	/**
	 * Get the basepath of the given file/directory
	 *
	 * @param {String} path Path to extract basepath
	 *
	 * @since 0.11
	 */
	getBasepath: function(path) {
		// split path at '/', remove last element and join with '/'
		var path = path.split('/').slice(0, -1).join('/');
		if (path == '') {
			return '/';
		} else {
			return path;
		}
	}
});
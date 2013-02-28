/**
 * Contains mimetype-related functionallity.
 *
 * @author Morris Jobke
 * @since 1.0
 */
Ext.define('SmartWFM.lib.Mimetype', {
	singleton: true,

	/**
	 * Normalizes a Mimetype
	 *
	 * @param {String} args Mimetype to normailze
	 *
	 * @since 1.0
	 */
	normalize: function(mimetype) {
		switch(mimetype) {
			case 'text/javascript':
			case 'application/javascript':
				return 'text/javascript';
			default:
				return mimetype;
		}
	}
});
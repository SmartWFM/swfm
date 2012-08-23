/**
 * This class handles all the icon stuff for us.
 *
 * @author Morris Jobke
 * @since 0.10
 */
Ext.define('SmartWFM.lib.Icon', {
	singleton: true,

	requires: ['SmartWFM.lib.Url'],

	/**
	 * An array to hold all the icons e.g. action icons and mime-type icons
	 *
	 * @protected
	 * @type Object
	 */
	icons: {
		'action': {
			basePath: 'actions',
			icons: {},
			size: []
		},
		'place': {
			basePath: 'places',
			icons: {},
			size: []
		},
		'mime': {
			basePath: 'mimetypes',
			icons: {},
			size: []
		}
	},


	// development-only-begin
	/* Adding stuff to the constructor to load dynamically all specified icons */
	constructor: function() {
		this.callParent();

		// loading config file
		Ext.require('SmartWFM.config.Icons');
	},
	// development-only-end

	/**
	 * Get the URL for the specified icon.
	 *
	 * @param {String} name The name of the icon
	 * @param {String} [type] The type of the icon, possible values are: action, place or mime. (default: "mime"
	 * @param {String} [size] The size of the icon, possible values are: 32x32, 64x64, ... (default: "64x64" (see SmartWFM.lib.Url.getIcon()))
	 *
	 * @return {String} The URL for the icon
	 *
	 * @since 0.10
	 */
	get: function(name, type, size) {
		if(type === undefined) {
			type = 'mime';
		}

		if(this.icons[type] === undefined) {
			console.error('Icon-type not found');
			return false;
		}

		var fileName = '';

		if (this.icons[type]['icons'][name] === undefined) {
			if (type === 'mime') {
				// try to find if there is a global icon for this type of files
				var mimeGroup = name.split('/')[0];
				for (mimeGroup in this.icons[type]['icons']) {
					if (mimeGroup === name) {
						// gloabl mime-type found
						fileName = this.icons[type]['icons'][name]['image'];
						break;
					}
				}
				// nothing found, load unknown image
				if (fileName === '') {
					// use 'unknown' mime-type icon
					fileName = this.icons[type]['icons']['unknown']['image'];
				}
			} else {
				if (this.icons[type]['icons']['not_found'] !== undefined) {
					fileName = this.icons[type]['icons']['not_found']['image'];
				} else {
					console.log('No icon found. Return blank');

					return Ext.BLANK_IMAGE_URL;
				}
			}
		} else {
			fileName = this.icons[type]['icons'][name]['image'];
		}

		return SmartWFM.lib.Url.getIcon(fileName, this.icons[type].basePath, size);
	},

	/**
	 * Load a set of icons
	 *
	 * @param {String} type The type of the icon, possible value are: action, place or mime
	 * @param {Array} icons A list of icons, the key is the name of the icon; e.g. {'copy': {image: 'copy.png'}, 'move': {image: 'move.png'}}
	 * @param {Array} sizes The size of the icon, possible value are: 32x32, 64x64, ...
	 *
	 * @return {Boolean} true = everything is ok | false = an error occurs
	 *
	 * @since 0.10
	 *
	 * @todo adding some checks
	 */
	load: function(type, icons, sizes) {
		if (this.icons[type] === undefined) {
			console.warning('No icons given');
			return false;
		}

		/* ToDo adding some checks */
		this.icons[type]['size'] = sizes;
		this.icons[type]['icons'] = icons;

		return true;
	}
});
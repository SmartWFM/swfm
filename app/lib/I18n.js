/**
 * This class does the translation for SmartWFM.
 *
 * @author Morris Jobke
 * @since 0.10
*/
Ext.define('SmartWFM.lib.I18n', {
	singleton: true,

	requires: [
		'SmartWFM.lib.Config',
		'Ext.window.MessageBox'
	],

	/**
	 * The current language - will be overwritten by receiveLanguage
	 *
	 * @private
	 * @type String
	 *
	 * @since 0.10
	 */
	lang: 'en',

	/**
	 * An array to hold all the language strings
	 *
	 * @private
	 * @type Array
	 *
	 * @since 0.10
	 */
	i18n: {},

	/**
	 * Set the language.
	 *
	 * @param {String} lang The language id (e.g. en, de).
	 *
	 * @since 0.10
	 */
	set: function(lang) {
		this.lang = lang;
	},

	constructor: function() {
		this.callParent();

		// loading config file
		this.receiveLanguage();
	},

	/**
	 * Getting language setting
	 *
	 * @private
	 * @since 0.10
	 */
	receiveLanguage: function() {
		if(SmartWFM.lib.Config.get('setting.load.enable') == true) {
			// todo
			/*
			// JSON data to request the language set in settings
			var data = '{"jsonrpc":"2.0","method":"setting.load","params":{"swfm.language":"string-select"}}';
			// regex to parse result
			var langRegex = /"swfm.language":"(\w*)"/;

			// we need to re-implement this synchronous call, because in the
			// very early state of loading no libraries are loaded, but we need
			// it

			// create HTTP request object
			var xmlHttpObject = false;
			if(typeof XMLHttpRequest != 'undefined') {
				xmlHttpObject = new XMLHttpRequest();
			}
			if(!xmlHttpObject) {
				try {
					xmlHttpObject = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch(e) {
					try {
						xmlHttpObject = new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch (e) {
						xmlHttpObject = null;
					}
				}
			}

			// prepare request
			xmlHttpObject.open('post', SWFM.Config.get('command_url') + '?data=' + data, false);	// third parameter: synchronous call

			// send request
			xmlHttpObject.send(data);		// waits for response

			if(xmlHttpObject.readyState == 4) {	// successful response
				var response = xmlHttpObject.responseText;
				langRegex.exec(response);		// parse response text
				if(RegExp.$1 != '')	{			// if response contain a language, set it
					console.debug('[Setting] Language setting successful loaded:', RegExp.$1);
					SWFM.I18N.setLang(RegExp.$1);
					console.groupEnd();
					return;
				}
			}*/
		}

		// browser language detection
		if(SmartWFM.lib.Config.get('i18n.useBrowserLang') == true) {
			var userLang = (navigator.language) ? navigator.language : navigator.userLanguage;
			this.set(userLang.substring(0,2));
			console.debug('[SmartWFM.lib.I18n] Language setting successful loaded:', this.lang);
		}

		// dynamically load language file
		Ext.Ajax.request({
			async: false,
			url: 'i18n/'+this.lang+'.json',
			success: function(response) {
				if (this.i18n[this.lang] === undefined)
					this.i18n[this.lang] = {};
				this.i18n[this.lang] = Ext.JSON.decode(response.responseText);
			},
			failure: function(response) {
				console.warn('[SmartWFM.lib.I18n] translation for "' + this.lang + '" couldn\'t be loaded');
			},
			scope: this
		});
	},

	/**
	 * Get translation.
	 *
	 * @param {String} group The name of the group
	 * @param {String} text The string or identifier to be translated.
	 *
	 * @return {String} The translated string/idetifier
	 *
	 * @since 0.10
	 */
	get: function(group, text) {
		// development
		// loads dynamically missing translation
		// many (!!!) requests
		// todo
		if ( this.lang != 'en' && group != '' && (
				this.i18n[this.lang] === undefined ||
				this.i18n[this.lang][group] === undefined
			) ) {
			// dynamically load language file
			Ext.Ajax.request({
				async: false,
				url: 'app/i18n/'+this.lang+'/'+group+'.json',
				success: function(response) {
					if (this.i18n[this.lang] === undefined)
						this.i18n[this.lang] = {};
					this.i18n[this.lang][group] = Ext.JSON.decode(response.responseText);
				},
				failure: function(response) {
					console.warn('[SmartWFM.lib.I18n] translation for "' + group + '" couldn\'t be loaded');
				},
				scope: SmartWFM.lib.I18n
			});
		}
		// development end
		return (group != '' && this.i18n[this.lang] !== undefined && this.i18n[this.lang][group] !== undefined) ? this.i18n[this.lang][group][text] || text : text;
	},

	/**
	 * Translates the text of the initial loading mask
	 *
	 * @private
	 *
	 * @since 0.10
	 */
	replaceLoadingTitle: function() {
		var el = Ext.get('loadingTitle');
		el.update(this.get('swfm', el.dom.innerHTML));
	},

	/**
	 * Translates the buttontext of the Ext.MessageBox
	 *
	 * @private
	 *
	 * @since 0.10
	 */
	translateMessageBox: function() {
		Ext.Msg.buttonText = {
			yes: SmartWFM.lib.I18n.get('swfm.button', 'Yes'),
			no: SmartWFM.lib.I18n.get('swfm.button', 'No'),
			ok: SmartWFM.lib.I18n.get('swfm.button', 'OK'),
			cancel: SmartWFM.lib.I18n.get('swfm.button', 'Cancel')
		};
	}
});

Ext.onReady(function() {
	// translate initial loading mask
	SmartWFM.lib.I18n.replaceLoadingTitle();
	// translate Ext.MessageBox buttons
	SmartWFM.lib.I18n.translateMessageBox();
});
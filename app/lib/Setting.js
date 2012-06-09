/**
 * Handle the user settings
 *
 * @author Morris Jobke
 * @since 0.10
*/
Ext.define('SmartWFM.lib.Setting', {
	singleton: true,

	requires: [
		'SmartWFM.lib.RPC',
		'SmartWFM.lib.Config'
	],

	/**
	 * list with all config options:
	 * config key => value
	 *
	 * @private
	 * @type Object
	 *
	 * @since 0.10
	 */
	setting: {},

	/**
	 * list with all config options:
	 * config key => value
	 *
	 * @private
	 * @type Object
	 *
	 * @since 0.10
	 */
	settingMap: {},

	/**
	 * Get settingMap
	 *
	 * @return {Object} The settingMap object
	 *
	 * @since 0.10
	 */
	getSettingMap: function () {
		return this.settingMap;
	},

	/**
	 * Get a setting object
	 *
	 * @param {String} name The name of the setting, it should be a unique name.
	 *
	 * @return {Mixed} The settings object | undefined = settings object not found
	 *
	 * @since 0.10
	 */
	get: function (name) {
		console.groupCollapsed('SmartWFM.lib.Setting.get()');
		console.debug('Arguments: ', arguments);

		if (this.setting[name] !== undefined) {
			console.groupEnd();
			return this.setting[name];
		}
		console.groupEnd();
		return undefined;
	},

	/**
	 * Get the value of a setting object
	 *
	 * @param {String} name The name of the setting, it should be a unique name.
	 * @param {Mixed} defaultValue The default value returned if setting isn't available.
	 *
	 * @return {Mixed} The value of the setting object.
	 *
	 * @since 0.10
	 */
	getValue: function (name, defaultValue) {
		// TODO store defaultValue
		console.groupCollapsed('SmartWFM.lib.Setting.getValue()');
		console.debug('Arguments: ', arguments);

		if (this.setting[name] !== undefined) {
			console.groupEnd();
			return this.setting[name]['value'];
		}

		console.groupEnd();
		if (typeof(defaultValue) === 'undefined') {
			return undefined;
		} else {
			return defaultValue;
		}
	},

	/**
	 * Load the stored settings from the backend
	 *
	 * @param {String} [callback] Call this function after reading was done
	 *
	 * @return {Boolean} True = success | False = an error occurs
	 *
	 * @since 0.10
	 */
	load: function (callback) {
		console.groupCollapsed('SmartWFM.lib.Setting.load()');
		console.debug('Arguments: ', arguments);

		if (SmartWFM.lib.Config.get('setting.load.enable') === true) {
			var t = {};
			for (var k in this.setting) {
				if (typeof(k) === "string") {
					t[k] = this.setting[k]['type'];
				}
			}
			SmartWFM.lib.RPC.request({
				action: 'setting.load',
				params: t,
				successCallback: function(result) {
					console.warn(result);
					for (var k in result) {
						if (typeof(k) === 'string') {
							SmartWFM.lib.Setting.setValue(k, result[k]);
						}
					}
				},
				successScope: this,
				callback: function() {
					if (this.swfmCallback !== undefined) {
						this.swfmCallback();
					}
				},
				scope: {
					swfmCallback: callback
				}
			});
		}
		console.groupEnd();
	},

	/**
	 * Register a new setting.
	 *
	 * @param {String} name The name of the setting, it should be a unique name.
	 * @param {String} cmpName The name of the component.
	 * @param {String} grpName The name of the group.
	 * @param {String} optName The name of config option.
	 * @param {Object} option Options for the setting (label, default, value).
	 *
	 * @since 0.10
	 */
	register: function (name, cmpName, grpName, optName, option) {
		console.groupCollapsed('SmartWFM.lib.Setting.register()');
		console.debug('Arguments: ', arguments);

		if (this.settingMap[cmpName] === undefined || this.settingMap[cmpName]['items'][grpName] === undefined) {
			console.groupEnd();
			return false;
		}
		setting = {
			label: 'n/a',
			value: undefined,
			type: undefined,
			'default': undefined,	// have to be put in quotes for opera and yui - reseverd word
			data: undefined
		};

		Ext.apply(setting, option);

		if(setting['value'] === undefined)
			setting['value'] = setting['default'];

		this.settingMap[cmpName]['items'][grpName]['items'][optName] = name;
		this.setting[name] = setting;

		console.groupEnd();
	},

	/**
	 * Register a new component with settings.
	 *
	 * @param {String} cmpName The name of the component.
	 * @param {Object} option The options for the component setting (title).
	 *
	 * @since 0.10
	 */
	registerComponent: function (cmpName, option) {
		console.groupCollapsed('SmartWFM.lib.Setting.registerComponent()');
		console.debug('Arguments: ', arguments);

		if (this.settingMap[cmpName] === undefined) {
			this.settingMap[cmpName] = {
				label: option['label'] || 'n/a',
				items: {}
			};
		}

		console.groupEnd();
	},

	/**
	 * Register a new setting group.
	 *
	 * @param {String} cmpName The name of the component.
	 * @param {String} grpName The name of the group.
	 * @param {Object} option The options for the setting group (label).
	 *
	 * @since 0.10
	 */
	registerGroup: function (cmpName, grpName, option) {
		console.groupCollapsed('SmartWFM.lib.Setting.registerGroup()');
		console.debug('Arguments: ', arguments);

		if (this.settingMap[cmpName] === undefined) {
			console.groupEnd();

			return false;
		}
		if (this.settingMap[cmpName]['items'][grpName] === undefined) {
			this.settingMap[cmpName]['items'][grpName] = {
				label: option['label'] || 'n/a',
				items: {}
			};
		}

		console.groupEnd();
	},

	/**
	 * Set the value of a setting object.
	 *
	 * @param {String} name The name of the setting, it should be a unique name.
	 * @param {String} grpName The name of the group.
	 * @param {Object} option The options for the setting group (label).
	 *
	 * @return {Boolean} status
	 *
	 * @since 0.10
	 */
	setValue: function (name, value) {
		console.groupCollapsed('SmartWFM.lib.Setting.setValue()');
		console.debug('Arguments: ', arguments);

		if (this.setting[name] !== undefined && typeof(this.setting[name]['value']) === typeof(value)) {
			this.setting[name]['value'] = value;

			console.groupEnd();

			return true;
		} else {
			console.groupEnd();

			return false;
		}
	},

	/**
	 * Store the settings
	 *
	 * @param {Function} callback Call this function after reading was done
	 *
	 * @return {Boolean} status
	 *
	 * @since 0.10
	 */
	store: function (callback) {
		console.groupCollapsed('SmartWFM.lib.Setting.store()');
		console.debug('Arguments: ', arguments);

		if (SmartWFM.lib.Config.get('setting.save.enable') === true) {
			var t = {};
			for (var k in this.setting) {
				if (typeof(k) === 'string') {
					t[k] = this.setting[k]['value'];
				}
			}
			console.groupEnd();
			SmartWFM.lib.RPC.request({
				action: 'setting.save',
				params: t,
				successCallback: callback,
				errorCallback: callback
			});
		} else {
			console.groupEnd();
		}

	}
})
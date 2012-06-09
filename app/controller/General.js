/**
 * Handles general actions
 */
Ext.define('SmartWFM.controller.General', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Config',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Setting'
	],

	init: function() {
		this.registerSettings();
	},

	registerSettings: function() {
		// register the settings for the swfm core
		SmartWFM.lib.Setting.registerComponent('swfm', {label: SmartWFM.lib.I18n.get('swfm', 'SmartWFM')});

		// language options
		SmartWFM.lib.Setting.registerGroup('swfm', 'language', {label: SmartWFM.lib.I18n.get('swfm', 'Language Options')});
		SmartWFM.lib.Setting.register(
			'swfm.language',
			'swfm',
			'language',
			'language',
			{
				label: SmartWFM.lib.I18n.get('swfm', 'Language'),
				type: 'string-select',
				'default': SmartWFM.lib.Config.get('lang'),		// have to be put in quotes for opera and yui - reseverd word
				data: [
					{
						title: SmartWFM.lib.I18n.get('swfm.language', 'English'),
						value: 'en'
					},
					{
						title: SmartWFM.lib.I18n.get('swfm.language', 'German (Deutsch)'),
						value: 'de'
					}
				]
			}
		);

		// file options
		SmartWFM.lib.Setting.registerGroup('swfm', 'files', {label: SmartWFM.lib.I18n.get('swfm', 'File Options')});
		SmartWFM.lib.Setting.register(
			'swfm.files.showHidden',
			'swfm',
			'files',
			'showHidden',
			{
				label: SmartWFM.lib.I18n.get('swfm', 'Show hidden files'),
				type: 'bool',
				'default': false	// have to be put in quotes for opera and yui - reseverd word
			}
		);

		// control options
		SmartWFM.lib.Setting.registerGroup('swfm', 'controls', {label: SmartWFM.lib.I18n.get('swfm', 'Controls')});
		SmartWFM.lib.Setting.register(
			'swfm.controls.action',
			'swfm',
			'controls',
			'action',
			{
				label: SmartWFM.lib.I18n.get('swfm', 'Action'),
				type: 'select',
				'default': 1,	// have to be put in quotes for opera and yui - reseverd word
				data: [
					{
						title: SmartWFM.lib.I18n.get('swfm', 'Left click'),
						value: 1
					},
					{
						title: SmartWFM.lib.I18n.get('swfm', 'Right click'),
						value: 2
					},
					{
						title: SmartWFM.lib.I18n.get('swfm', 'Double click'),
						value: 3
					}
				]
			}
		);

		SmartWFM.lib.Setting.register(
			'swfm.controls.contextMenu',
			'swfm',
			'controls',
			'contextMenu',
			{
				label: SmartWFM.lib.I18n.get('swfm', 'Context menu'),
				type: 'select',
				'default': 2,	// have to be put in quotes for opera and yui - reseverd word
				data: [
					{
						title: SmartWFM.lib.I18n.get('swfm', 'Left click'),
						value: 1
					},
					{
						title: SmartWFM.lib.I18n.get('swfm', 'Right click'),
						value: 2
					},
					{
						title: SmartWFM.lib.I18n.get('swfm', 'Double click'),
						value: 3
					}
				]
			}
		);
	}
});
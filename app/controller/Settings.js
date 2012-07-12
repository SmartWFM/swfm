/**
 * Handles settings window actions
 */
Ext.define('SmartWFM.controller.Settings', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon'
	],

	refs: [{
		ref: 'settingsWindow',
		selector: 'settingsWindow'
	}],

	init: function() {
		this.registerMenuItems();
		this.control({
			'settingsWindow button[action=apply]': {
				click: this.applySettings
			},
			'settingsWindow button[action=cancel]': {
				click: this.cancel
			}
		});
	},

	registerMenuItems: function() {
		var settingEdit = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.setting', 'Edit settings'),
			icon: SmartWFM.lib.Icon.get('settings.edit', 'action', '32x32'),
			handler: function () {
				Ext.create('SmartWFM.view.settings.Window').show();
			}
		});
		SmartWFM.lib.Menu.add('setting.edit', settingEdit);
	},

	applySettings: function() {

	},

	cancel: function() {
		this.getSettingsWindow().close();
	}
});
/**
 * Window to configure all settings
 */
Ext.define('SmartWFM.view.settings.Window', {
	extend: 'Ext.window.Window',
	alias: 'widget.settingsWindow',

	requires: [
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Event',
		'SmartWFM.lib.Setting'
	],
	title: SmartWFM.lib.I18n.get('plugin.setting', 'Settings'),
	layout: 'accordion',
	width: 400,
	maximizable: true,
	constrain: true,
	buttons: [
		Ext.create('Ext.button.Button', {
			text: SmartWFM.lib.I18n.get('plugin.setting', 'Apply'),
			action: 'apply',
			handler: function(b) {
				var window = b.up('window');
				// apply settings
				var fields = window.query('field[swfmSettingId]');
				var changedSettings = [];
				for(var i in fields) {
					var field = fields[i];
					var swfmSettingId = field['swfmSettingId'];
					var value = field.getValue();
					if(SmartWFM.lib.Setting.getValue(swfmSettingId) != value) {
						SmartWFM.lib.Setting.setValue(swfmSettingId, value);
						changedSettings.push(swfmSettingId);
					}
				}
				if(changedSettings.length != 0)
				{
					// save settings and fire event
					SmartWFM.lib.Setting.store();
					SmartWFM.lib.Event.fire('plugin.setting.window', 'settingsChanged', changedSettings);
				}
				b.up('window').close();
			}
		}),
		Ext.create('Ext.button.Button', {
			text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
			action: 'cancel'
		})
	],

	initComponent: function() {
		// see comment in ExtJS 4.1 doc for Ext.getBody()
		this.height = Ext.getBody().getHeight() / 1.2;

		var SettingMap = SmartWFM.lib.Setting.getSettingMap();
		var components = [];
		for(var cmpName in SettingMap) {
			var component = SettingMap[cmpName];
			var groups = [];
			for(var grpName in component['items']) {
				var group = component['items'][grpName];
				var options = [];
				for(var optName in group['items']) {
					var option = group['items'][optName];
					var setting = SmartWFM.lib.Setting.get(option);
					switch(setting['type']) {
						case 'bool':
							options.push(Ext.create('Ext.form.field.Checkbox', {
								swfmSettingId: 	option,
								fieldLabel: 	setting['label'],
								checked: 		setting['value'],
								// seems to be a bug - see comment on doc for this config
								// checked seems to be leading instead of value
								// http://www.sencha.com/forum/showthread.php?176561-checkbox-default-value
								width: 			350,
								labelWidth:		150
							}));
							break;
						case 'integer':
							options.push(Ext.create('Ext.form.field.Number', {
								swfmSettingId: 	option,
								fieldLabel: 	setting['label'],
								value: 			setting['value'],
								width: 			350,
								labelWidth:		150
							}));
							break;
						case 'select':
						case 'string-select':
							options.push(Ext.create('Ext.form.field.ComboBox', {
								swfmSettingId:	option,
								fieldLabel:		setting['label'],
								value:			setting['value'],
								forceSelection:	true,		// restrict selection to value in list
								editable:		false,
								width: 			350,
								labelWidth:		150,
								displayField:	'title',
								valueField:		'value',
								store:			Ext.create('Ext.data.Store', {
													fields:	['title', 'value'],
													data:	setting['data']
												})
							}));
							break;
					}
				}

				groups.push(Ext.create('Ext.form.FieldSet', {
					title: 			group['label'],
					collapsible: 	true,
					autoHeight: 	true,
					defaults: 		{ width: 210 },
					defaultType: 	'textfield',
					items: 			options
				}));
			}

			components.push(Ext.create('Ext.panel.Panel', {
				title: 			component['label'],
				autoScroll: 	true,
				border: 		false,
				items: 			groups
			}));
		}
		this.items = components;
		this.callParent();
	}

});

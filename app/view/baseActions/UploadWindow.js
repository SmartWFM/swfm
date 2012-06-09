Ext.define('SmartWFM.view.baseActions.UploadWindow', {
	extend: 'Ext.window.Window',

	requires: [
		'SmartWFM.lib.I18n'
	],

	title: SmartWFM.lib.I18n.get('plugin.baseActions', 'Upload'),

	layout: 'fit',
	width: 450,
	height: 80,
	plain: true,
	border: false,
	closable: false,
	items: [{
		xtype: 'form',
		border: false,
		bodyStyle: {'background-color': 'transparent'}, // only way not to have a white background
		url: SmartWFM.lib.Config.get('commandUrl'),
		items: [{
			xtype: 'hiddenfield',
			name: 'path'
		},{
			xtype: 'fileuploadfield',
			name: 'file',
			fieldLabel: SmartWFM.lib.I18n.get('plugin.baseActions', 'File'),
			labelWidth: 50,
			anchor: '100%',
			buttonText: SmartWFM.lib.I18n.get('plugin.baseActions', 'Select file')
		}]
	}],

	buttons: [{
		text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Upload'),
		handler: function() {
			var win = this.up('window');
			var form = win.down('form').getForm();
			if(form.isValid()) {
				form.submit({
					params: {
						command: 'upload'
					},
					waitMsg: SmartWFM.lib.I18n.get('plugin.baseActions', 'Uploading ...'),
					success: function() {
						win.hide();
						SmartWFM.lib.Event.fire(
							'',
							'refresh'
						);
					},
					failure: function(form, action) {
						Ext.Msg.show({
							title: SmartWFM.lib.I18n.get('swfm.error', 'An error occured'),
							msg: SmartWFM.lib.I18n.get('swfm.error', action.result.msg),
							icon: Ext.Msg.WARNING,
							buttons: Ext.Msg.OK
						});
					}
				});
			}
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
		handler: function(){
			this.up('window').close();
		}
	}]

});
Ext.define('SmartWFM.view.baseActions.ProgressWindow', {
	extend: 'Ext.window.Window',

	requires: [
		'SmartWFM.lib.I18n'
	],

	buttons: [{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
		handler: function() {
			this.up('window').close();
		}
	}],

	items: [{
		xtype: 'progressbar',
		plain: true
	}],
	width: 300,
	closable: false,
	resizable: false,
	plain: true,
	border: false
});
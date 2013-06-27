/**
 * Window to display CKEditor
 */
Ext.define('SmartWFM.view.ckeditor.Window', {
	extend: 'Ext.window.Window',
	alias: 'widget.ckeditor',

	requires: [
		'SmartWFM.lib.I18n',
		'Ext.ux.form.field.CodeMirror'
	],
	title: SmartWFM.lib.I18n.get('plugin.ckeditor', 'CKEditor'),
	layout: 'fit',
	maximizable: true,
	border: false,
	plain: true,
	constrain: true,
	bodyStyle: {
		background: '#fff'
	},

	buttonAlign: 'center',
	buttons: [
		{
			text: SmartWFM.lib.I18n.get('swfm.button', 'Previous'),
			action: 'previous'
		},
		{
			text: SmartWFM.lib.I18n.get('swfm.button', 'Next'),
			action: 'next'
		},
		{
			text: SmartWFM.lib.I18n.get('swfm.button', 'Save'),
			disabled: true,
			action: 'save'
		}
	],

	initComponent: function() {
		// see comment in ExtJS 4.1 doc for Ext.getBody()
		var body = Ext.getBody();
		this.height 	= body.getHeight() / 1.2;
		this.width 		= body.getWidth() / 1.2;
		this.callParent(arguments);
		console.log('sad')
	},

	items: [{
		xtype: 	'form',
		layout: 'fit',
		items: 	[{
			xtype:	'ckeditorField'
		}]
	}],
});

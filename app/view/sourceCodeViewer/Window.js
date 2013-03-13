/**
 * Window to display source code
 */
Ext.define('SmartWFM.view.sourceCodeViewer.Window', {
	extend: 'Ext.window.Window',
	alias: 'widget.sourceCodeViewer',

	requires: [
		'SmartWFM.lib.I18n',
		'Ext.ux.form.field.CodeMirror'
	],
	title: SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Source Code Viewer'),
	layout: 'fit',
	maximizable: true,
	border: false,
	plain: true,
	constrain: true,
	bodyStyle: {
		background: '#fff'
	},

	initComponent: function() {
		// see comment in ExtJS 4.1 doc for Ext.getBody()
		var body = Ext.getBody();
		this.height 	= body.getHeight() / 1.2;
		this.width 		= body.getWidth() / 1.2;
		this.callParent(arguments);
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

	items: [{
		xtype: 	'form',
		layout: 'fit',
		items: 	[{
			xtype: 			'codemirror',
			name: 			'content',
			pathModes: 		'codemirror-2.38/mode',
			pathExtensions: 'codemirror-2.38/lib/util',
			mode: 			'text/plain',
			checkChange: 	function() {
				var me = this,
					w = me.up('window');
				if(w){
					// wait some time to pass the initialization of the editor
					setTimeout(function() {
						var b = me.getModifiedState();
						w.down('button[action=save]').setDisabled(!b);
					}, 100);
				}
			},
		}]
	}],
});

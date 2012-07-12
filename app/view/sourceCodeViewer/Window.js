/**
 * Window to display source code
 */
Ext.define('SmartWFM.view.sourceCodeViewer.Window', {
	extend: 'Ext.window.Window',
	alias: 'widget.sourceCodeViewer',

	requires: [
		'SmartWFM.lib.I18n',
		'Ext.ux.SimpleIFrame'
	],
	title: SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Source Code Viewer'),
	layout: 'fit',
	maximizable: true,
	border: false,
	plain: true,

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
			text: SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Previous'),
			action: 'previous'
		},
		{
			text: SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Next'),
			action: 'next'
		}
	],

	items: [{
		xtype: 'simpleiframe'
	}]
});

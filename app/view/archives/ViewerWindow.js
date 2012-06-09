/**
 * Window to display source code
 */
Ext.define('SmartWFM.view.archives.ViewerWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.archiveViewer',

	requires: [
		'SmartWFM.lib.I18n'
	],
	title: SmartWFM.lib.I18n.get('plugin.archives', 'Archive Viewer'),
	layout: 'fit',
	maximizable: true,
	border: false,
	plain: true,

	initComponent: function() {
		// see comment in ExtJS 4.1 doc for Ext.getBody()
		var body = Ext.getBody();
		this.height 	= body.getHeight() / 1.2;
		this.callParent(arguments);
	},

	buttonAlign: 'right',
	buttons: [
		{
			text: SmartWFM.lib.I18n.get('plugin.archives', 'Extract all'),
			action: 'extractAll'
		},
		{
			text: SmartWFM.lib.I18n.get('plugin.archives', 'Extract selected'),
			action: 'extractSelected'
		}
	]
});

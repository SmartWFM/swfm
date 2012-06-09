/**
 * Window to show property-value pairs of file info
 */
Ext.define('SmartWFM.view.fileInfo.Window', {
	extend: 'Ext.window.Window',
	alias: 'widget.fileInfoWindow',
	requires: [
		'SmartWFM.lib.I18n'
	],
	title: SmartWFM.lib.I18n.get('plugin.fileInfo', 'File info'),
	layout: 'fit',
	width: 400,
	maximizable: true,
	border: false,
	plain: true,

	initComponent: function() {
		// see comment in ExtJS 4.1 doc for Ext.getBody()
		var body = Ext.getBody();
		this.height 	= body.getHeight() / 1.2;
		this.callParent(arguments);
	},

	items: [{
		xtype: 'gridpanel',
		columns: [{
			header: SmartWFM.lib.I18n.get('plugin.fileInfo', 'Property'),
			menuDisabled: true,
			dataIndex: 'property',
			renderer: function(value) {
				return SmartWFM.lib.I18n.get('plugin.fileInfo', value)
			}
		},{
			dataIndex: 'value',
			header: SmartWFM.lib.I18n.get('plugin.fileInfo', 'Value'),
			menuDisabled: true
		}],
		forceFit: true,
		enableColumnHide: false,
		viewConfig: {
			loadingText: SmartWFM.lib.I18n.get('swfm', 'Loading ...')
		},

		store: Ext.create('Ext.data.ArrayStore', {
			fields: [
				'property',
				'value'
			]
		})
	}]
});

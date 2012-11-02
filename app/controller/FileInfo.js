/**
 * This is a file info controller. It adds a menu entry to have access to more
 * information about a specific file.
 */
Ext.define('SmartWFM.controller.FileInfo', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Path',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.lib.RPC',
		'SmartWFM.view.fileInfo.Window'
	],

	init: function() {
		this.registerMenuItems();
	},

	registerMenuItems: function() {
		var fileInfo = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.fileInfo', 'File info'),
			icon: SmartWFM.lib.Icon.get('file.info', 'action', '32x32'),
			disabled: true,
			initComponent: function() {
				this.callParent();

				var selection = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().down('dataview, gridpanel').getSelectionModel().getSelection();
				// show if only one item is selected and this isn't a directory
				if(selection.length == 1 && !selection[0]['data']['isDir'])
					this.setDisabled(false);
			},
			handler: function () {
				Ext.create('SmartWFM.view.fileInfo.Window').show();
				SmartWFM.app.getController('FileInfo').loadData();
			}
		});
		SmartWFM.lib.Menu.add('fileInfo', fileInfo);
	},

	loadData: function() {
		var selectedNode = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().down('dataview, gridpanel').getSelectionModel().getSelection()[0];
		if(selectedNode) {
			var data = selectedNode['data'];
			var path = SmartWFM.lib.Path.join(data['path'], data['name']);
			// show loading mask
			Ext.ComponentQuery.query('fileInfoWindow > gridpanel')[0].getView().setLoading(true);
			SmartWFM.lib.RPC.request({
				action: 'file.info',
				params: path,
				callback: function() {
					// remove loading mask
					Ext.ComponentQuery.query('fileInfoWindow > gridpanel')[0].getView().setLoading(false);
				},
				successCallback: function(result) {
					// load data
					Ext.ComponentQuery.query('fileInfoWindow > gridpanel')[0].getStore().loadRawData(result);
				}
			});
		}

	}
});
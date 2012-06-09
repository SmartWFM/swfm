// buggy
// http://www.sencha.com/forum/showthread.php?199888-4.1.0-updateInfo-is-not-a-function-when-adding-a-model-instance-to-a-node

Ext.define('SmartWFM.view.bookmarks.View', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.bookmarks',

	title: SmartWFM.lib.I18n.get('widget.bookmarks', 'Bookmarks'),
	autoscroll: true,
	displayField: 'name',

	requires: [
		'SmartWFM.lib.Icon',
		'SmartWFM.store.bookmarks.Bookmarks'
	],

	initComponent: function() {
		this.store = Ext.create('SmartWFM.store.bookmarks.Bookmarks');
		this.callParent(arguments);
	},

	// store: Ext.create('SmartWFM.store.bookmarks.Bookmarks'),

	hideHeaders: true,

	columns: [{
		header: 'Name',
		dataIndex: 'name'
	},{
		xtype: 'actioncolumn',
		align: 'right',
		items: [{
			tooltip: SmartWFM.lib.I18n.get('widget.bookmarks', 'Rename bookmark'),
			icon: SmartWFM.lib.Icon.get('bookmarks.rename', 'action', '16x16'),
			handler: function(grid, rowIndex, colIndex) {
				var record = grid.getStore().getAt(rowIndex);
				var path = record.get('location');
				var name = record.get('name');

				SmartWFM.app.getController('Bookmarks').openAddWindow(name, path);
			}
		},{
			icon: SmartWFM.lib.Icon.get('bookmarks.delete', 'action', '16x16'),
			tooltip: SmartWFM.lib.I18n.get('widget.bookmarks', 'Remove bookmark'),
			handler: function(grid, rowIndex, colIndex) {
				grid.getStore().removeAt(rowIndex);
			}
		}]
	}],

	dockedItems: [{
		xtype: 'toolbar',
		border: false,
		dock: 'top',
		items: [
			{
				xtype: 'button',
				text: SmartWFM.lib.I18n.get('widget.bookmarks', 'Add'),
				icon: SmartWFM.lib.Icon.get('bookmarks.add', 'action', '16x16'),
				action: 'add'
			}
		]
	}]
});

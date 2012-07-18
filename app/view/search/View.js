Ext.define('SmartWFM.view.search.View', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.search',

	title: SmartWFM.lib.I18n.get('widget.search', 'Search'),
	autoscroll: true,
	displayField: 'name',
	forceFit: true,

	requires: [
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.store.search.Search'
	],

	store: Ext.create('SmartWFM.store.search.Search'),

	columns: [{
		header: SmartWFM.lib.I18n.get('widget.search', 'Name'),
		dataIndex: 'name',
		xtype: 'templatecolumn',
		tpl: '<img src="{icon}" height="10px" title="" /> {name}'
	},{
		header: SmartWFM.lib.I18n.get('widget.search', 'Location'),
		dataIndex: 'location'
	}],

	dockedItems: [{
		xtype: 'toolbar',
		border: false,
		dock: 'top',
		items: [
			{
				xtype: 'textfield',
				name: 'searchTerm',
				width: 120
			},
			{
				xtype: 'button',
				text: SmartWFM.lib.I18n.get('widget.search', 'Search'),
				action: 'search'
			}
		]
	}]
});

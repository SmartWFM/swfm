Ext.define('SmartWFM.view.treeMenu.TreeMenu', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.treemenu',

	requires: [
		'SmartWFM.store.treeMenu.Folders'
	],

	store: Ext.create('SmartWFM.store.treeMenu.Folders'),

	title: SmartWFM.lib.I18n.get('swfm', 'Folders'),
	autoscroll: true,
	displayField: 'name'
});

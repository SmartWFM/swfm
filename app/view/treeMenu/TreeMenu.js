Ext.define('SmartWFM.view.treeMenu.TreeMenu', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.treemenu',

	requires: [
		'SmartWFM.store.treeMenu.Folders'
	],

	store: Ext.create('SmartWFM.store.treeMenu.Folders'),

	title: SmartWFM.lib.I18n.get('swfm', 'Folders'),
	autoscroll: true,
	displayField: 'name',
	listeners: {
		afterlayout: function(container, layout, eOpts) {
			var nd = this.getSelectionModel().getLastSelected();
			// I add a property 'initialLoad' to my treestore,
			// and set the value to true after the 'getPath(...)'
			// then the focus is made only when I 'auto' select a record ...
			if (!Ext.isEmpty(nd) && this.getStore().initialLoad !== false) {
				this.getStore().initialLoad = false;
				// nd.store.indexOf(nd) didn't work, I want to know
				// the 'global' row id of the whole treeview ....
				this.getView().focusRow(
					this.getView().store.indexOf(nd) // return
				);
			}
		}
	}
});

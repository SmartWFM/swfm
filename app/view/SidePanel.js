Ext.define('SmartWFM.view.SidePanel', {
	extend: 'Ext.panel.Panel',

	alias: 'widget.sidePanel',

	width: 200,
	layout: 'accordion',
	split: true,
	//border: false,
	items: [],

	title: SmartWFM.lib.I18n.get('swfm', 'SidePanel'),
	preventHeader: true,

	collapsible: true,
	hideCollapseTool: true,

	initComponent: function() {
		var me = this;

		me.callParent();
		var items = SmartWFM.lib.Config.get('sidePanel.items', []);
		if(items.length == 0) {
			// there are no items, so hide the sidePanel
			me.hide();
			me.destroy();
			return;
		}
		for(var i = 0; i < items.length; i++) {
			me.items.add(
				Ext.create(items[i])
			);
		}
	},

	listeners: {
		'resize': function() {
			// just a workaround, because layout isn't done correct
			this.doLayout();
		}
	}
});

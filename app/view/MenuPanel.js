Ext.define('SmartWFM.view.MenuPanel', {
	extend: 'Ext.panel.Panel',

	alias: 'widget.menuPanel',

	requires: [
		'SmartWFM.lib.Config',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Menu'
	],

	border: false,
	bodyBorder: false,

	/**
	 * loading menu config and create all entries
	 */
	initComponent: function() {
		var menus = SmartWFM.lib.Config.get('menuPanel.menus', []);
		var items = [];

		for(var i = 0; i < menus.length; i++) {
			var menu = SmartWFM.lib.Menu.get(
				SmartWFM.lib.Config.get(menus[i].config, []),
				undefined
			);
			if(menu !== undefined) {
				items.push({
					text: SmartWFM.lib.I18n.get('swfm', menus[i].name),
					menu: menu
				});
			}
		}
		items.push(
			Ext.create('Ext.ux.upload.Button')
		);
		if(items.length > 0) {
			this.tbar = items;
		}
		this.callParent();
	}
});

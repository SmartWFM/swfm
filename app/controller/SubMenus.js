/**
 * Adds submenus to context menu. They aren't displayed, if they haven't any item.
 */
Ext.define('SmartWFM.controller.SubMenus', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon'
	],

	init: function() {
		this.registerMenuItems();
	},

	registerMenuItems: function() {
		// "open with ..."
		var openWith = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.subMenus', 'Open with ...'),
			// icon: SmartWFM.lib.Icon.get('', '', ''), // todo
			disabled: true,
			initComponent: function () {
				this.callParent();

				var openWithMenu = SmartWFM.lib.Config.get('plugin.subMenus.openWith');

				var menu = SmartWFM.lib.Menu.get(openWithMenu, this.context);

				if(menu !== undefined && menu.items.length > 0) {
					this.menu = menu;
					this.setDisabled(false);
				}
			}
		});
		SmartWFM.lib.Menu.add('openWith', openWith);
		// "create new ..."
		var createNew = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.subMenus', 'Create new ...'),
			// icon: SmartWFM.lib.Icon.get('', '', ''), // todo
			disabled: true,
			initComponent: function (context) {
				this.callParent();

				var createNewMenu = SmartWFM.lib.Config.get('plugin.subMenus.createNew');

				var menu = SmartWFM.lib.Menu.get(createNewMenu, context);

				if(menu !== undefined && menu.items.length > 0) {
					this.menu = menu;
					this.setDisabled(false);
				}
			}
		});
		SmartWFM.lib.Menu.add('createNew', createNew);
	}
});
Ext.define('SmartWFM.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: [
		'SmartWFM.lib.I18n',
		'SmartWFM.view.browser.Browser',
		'SmartWFM.view.SidePanel',
		'SmartWFM.view.MenuPanel',
		'SmartWFM.view.StatusPanel'
	],

	layout: 'border',

	initComponent: function() {
		this.items = [{
			xtype: 'browser',
			region: 'center'
		},{
			xtype: 'sidePanel',
			region: 'west'
		},{
			xtype: 'menuPanel',
			region: 'north'
		},{
			xtype: 'statusPanel',
			region: 'south'
		}]

		this.callParent();
	}
});

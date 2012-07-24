/**
 * Window to display images
 */
Ext.define('SmartWFM.view.imageViewer.Window', {
	extend: 'Ext.window.Window',
	alias: 'widget.imageViewer',

	requires: [
		'SmartWFM.lib.I18n'
	],
	title: SmartWFM.lib.I18n.get('plugin.imageViewer', 'Image Viewer'),
	layout: 'fit',
	maximizable: true,
	border: false,
	plain: true,
	constrain: true,

	initComponent: function() {
		// see comment in ExtJS 4.1 doc for Ext.getBody()
		var body = Ext.getBody();
		this.height 	= body.getHeight() / 1.2;
		this.width 		= body.getWidth() / 1.2;
		this.callParent(arguments);
	},

	buttonAlign: 'center',
	buttons: [
		{
			text: SmartWFM.lib.I18n.get('swfm.button', 'Previous'),
			action: 'previous'
		},
		{
			text: SmartWFM.lib.I18n.get('swfm.button', 'Next'),
			action: 'next'
		},
		{
			text: SmartWFM.lib.I18n.get('plugin.imageViewer', 'Zoom in'),
			action: 'zoomin'
		},
		{
			text: SmartWFM.lib.I18n.get('plugin.imageViewer', 'Zoom out'),
			action: 'zoomout'
		},
		{
			text: SmartWFM.lib.I18n.get('plugin.imageViewer', 'Fit'),
			action: 'fit'
		},
		{
			text: SmartWFM.lib.I18n.get('plugin.imageViewer', '1:1'),
			action: 'reset'
		}
	],

	items: [{
		xtype: 'panel',
		autoScroll: true,
		border: false,
		bodyStyle: {'background-color': 'transparent'}, // only way not to have a white background
		items: [{
			xtype: 'image'
		}],
		listeners: {
			// center the image
			afterlayout: function() {
				var image = this.child('image');
				if(image)
					image.getEl().wrap({tag: 'center'});
			}
		}
	}]
});

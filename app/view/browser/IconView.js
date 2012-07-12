Ext.Loader.setPath('Ext.ux.DataView', 'ux/DataView');

Ext.require('Ext.ux.DataView.DragSelector');

Ext.define('SmartWFM.view.browser.IconView', {
	extend: 'Ext.view.View',
	alias: 'widget.browser.IconView',

	cls: 'icon-view',

	tpl: [
		'<tpl for=".">',
			'<div class="thumb-wrap" id="{name}">',
				'<div class="thumb">',
					'<img src="{icon}" title="{name}">',
				'</div>',
				'<span class="x-editable">{shortName}</span>',
			'</div>',
		'</tpl>',
		'<div class="x-clear"></div>'
	],

	itemSelector: 'div.thumb-wrap',
	trackOver: true,
	overItemCls: 'x-item-over',
	//simpleSelect: true,			// select multiple elements without holding modifier key
	multiSelect: true,
	autoScroll: true,

	plugins: [],

	prepareData: function(data) {
		Ext.apply(data, {
			shortName: Ext.util.Format.ellipsis(data.name, 12)
		});
		return data;
	},

	initComponent: function() {
		this.plugins.push( new Ext.ux.DataView.DragSelector() );
		this.callParent();
	},

	listeners: {
	}
});

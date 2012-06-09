DATE_FORMAT = 'Y-m-d H:i:s';

Ext.define('SmartWFM.view.browser.GridView', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.browser.GridView',

	forceFit: true,

	//simpleSelect: true,			// select multiple elements without holding modifier key
	multiSelect: true,
	// selType: 'multiple',
	border: false,

	columns: [
		{
			header: SmartWFM.lib.I18n.get('widget.browser', 'Name'),
			sortable: true,
			dataIndex: 'name',
			hideable: false,
			renderer: function (value, p, record) {
				return Ext.util.Format.format('<img src="{0}" width="16" height="16" align="absmiddle" />&nbsp;{1}', record.get('icon'), Ext.util.Format.htmlEncode(value));
			}
		},
		{
			header: SmartWFM.lib.I18n.get('widget.browser', 'Size'),
			width: 75,
			sortable: true,
			dataIndex: 'size',
			renderer: Ext.util.Format.fileSize,
			align: 'right'
		},
		{
			header: SmartWFM.lib.I18n.get('widget.browser', 'Access time'),
			width: 75,
			sortable: true,
			dataIndex: 'atime',
			hidden: true,
			renderer: Ext.util.Format.dateRenderer(DATE_FORMAT),
			align: 'right'
		},
		{
			header: SmartWFM.lib.I18n.get('widget.browser', 'Created'),
			width: 75,
			sortable: true,
			dataIndex: 'ctime',
			hidden: true,
			renderer: Ext.util.Format.dateRenderer(DATE_FORMAT),
			align: 'right'
		},
		{
			header: SmartWFM.lib.I18n.get('widget.browser', 'Last modified'),
			width: 75,
			sortable: true,
			dataIndex: 'mtime',
			hidden: false,
			renderer: Ext.util.Format.dateRenderer(DATE_FORMAT),
			align: 'right'
		},
		{
			header: SmartWFM.lib.I18n.get('widget.browser', 'Permissions'),
			width: 75,
			sortable: true,
			dataIndex: 'perms',
			hidden: true,
			align: 'left',
			renderer: function (v, p, record) {
				return Ext.util.Format.format('<pre>{0}</pre>', v);
			}
		}
	],

	plugins: [
		Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		})
	]
});

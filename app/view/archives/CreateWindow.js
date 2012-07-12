/**
 * Dialog window for archive creation
 */
Ext.define('SmartWFM.view.archives.CreateWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.createArchive',

	requires: [
		'SmartWFM.lib.I18n'
	],
	title: SmartWFM.lib.I18n.get('plugin.archives', 'Create archive'),
	layout: 'fit',
	maximizable: true,
	border: false,
	plain: true,
	height: 200,
	width: 300,

	buttonAlign: 'right',
	buttons: [
		{
			text: SmartWFM.lib.I18n.get('plugin.archives', 'Create'),
			action: 'create'
		},
		{
			text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
			handler: function() {
				this.up('window').close();
			}
		}
	],

	items: {
		xtype: 'form',
		border: false,
		bodyStyle: {'background-color': 'transparent'}, // only way not to have a white background
		items: [{
			xtype: 'textfield',
			fieldLabel: SmartWFM.lib.I18n.get('plugin.archives', 'Name'),
			name: 'name'
		},{
			xtype: 'combobox',
			fieldLabel: SmartWFM.lib.I18n.get('plugin.archives', 'Type of archive'),
			name: 'type',
			value: 'zip',
			forceSelection: true,
			store: [
				[ 'zip', SmartWFM.lib.I18n.get('plugin.archives', 'ZIP-Archive (.zip)') ],
				[ 'tarbz2',	SmartWFM.lib.I18n.get('plugin.archives', 'TAR-BIP2-Archive (.tar.bz2)') ],
				[ 'targz', SmartWFM.lib.I18n.get('plugin.archives', 'TAR-GZ-Archive (.tar.gz)') ]
			]
		},{
			xtype: 'checkboxfield',
			fieldLabel: SmartWFM.lib.I18n.get('plugin.archives', 'Absolute paths in archive'),
			name: 'absolutePaths'
		}]
	},
});

/**
 * Window for managing afs acls
 */
Ext.define('SmartWFM.view.afsActions.ManageACLsWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.manageACLsWindow',

	requires: [
		'SmartWFM.lib.I18n'
	],
	title: SmartWFM.lib.I18n.get('plugin.afsActions', 'AFS rights'),
	layout: 'fit',
	maximizable: true,
	border: false,
	constrain: true,
	plain: true,
	height: 500,
	width: 420,

	buttonAlign: 'right',
	buttons: [
		{
			text: SmartWFM.lib.I18n.get('plugin.afsActions', 'Add new rule'),
			action: 'addNewRule'
		},
		{
			text: SmartWFM.lib.I18n.get('plugin.afsActions', 'Set rights'),
			action: 'setRights'
		},
		{
			text: SmartWFM.lib.I18n.get('plugin.afsActions', 'Reset'),
			action: 'reset'
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
			xtype: 'hiddenfield',
			name: 'path'
		},{
			xtype: 'checkboxfield',
			fieldLabel: SmartWFM.lib.I18n.get('plugin.afsActions', 'Set also in subdirectories'),
			name: 'subfolders',
			anchor: '100%'
		}]
	}
});

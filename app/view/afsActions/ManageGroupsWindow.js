/**
 * Window for managing afs groups
 */
Ext.define('SmartWFM.view.afsActions.ManageGroupsWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.manageGroupsWindow',

	requires: [
		'SmartWFM.lib.I18n'
	],
	title: SmartWFM.lib.I18n.get('plugin.afsActions', 'Manage AFS groups'),
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
			text: SmartWFM.lib.I18n.get('plugin.afsActions', 'Delete selected group(s)/user(s)'),
			action: 'deleteSelected'
		},
		{
			text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
			handler: function() {
				this.up('window').close();
			}
		}
	]
});

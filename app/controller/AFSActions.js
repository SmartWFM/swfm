/**
 * This plugin handles everything corresponding to AFS
 */
Ext.define('SmartWFM.controller.AFSActions', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.I18n',
		'SmartWFM.view.afsActions.ManageGroupsWindow'
	],

	refs: [{
		ref: 'groupsWindow',
		selector: 'manageGroupsWindow'
	},{
		ref: 'quotaProgressBar',
		selector: 'viewport statusPanel progressbar[name=quota.progress]'
	}],

	init: function() {
		this.registerMenuItems();
		this.registerComponents();
		this.registerEvents();
	},

	registerMenuItems: function() {
		var manageGroups = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.afsActions', 'Manage AFS groups'),
			icon: SmartWFM.lib.Icon.get('afs.groups.manage', 'action', '32x32'),
			handler: function () {
				Ext.create('SmartWFM.view.afsActions.ManageGroupsWindow').show();
				SmartWFM.app.getController('AFSActions').loadGroups();
			}
		});
		SmartWFM.lib.Menu.add('afs.manageGroups', manageGroups);
	},

	registerComponents: function() {
		var quotaBar = Ext.create(Ext.ProgressBar, {
			animate: false,
			value: 0.0,
			text: '',
			width: 500,
			name: 'quota.progress'
		});
		SmartWFM.lib.Component.register('statusbar', 'quota.progress', quotaBar);
	},

	registerEvents: function() {
		SmartWFM.lib.Event.register(
			'',
			'activateFolder',
			{
				callback: this.updateQuota,
				scope: this
			}
		);
		SmartWFM.lib.Event.register(
			'',
			'tabSwitched',
			{
				callback: this.updateQuota,
				scope: this
			}
		);
		SmartWFM.lib.Event.register(
			'',
			'newTab',
			{
				callback: this.updateQuota,
				scope: this
			}
		);
	},

	updateQuota: function(path, activated) {
		// newTab event
		if (activated !== undefined && activated == false)
			return;

		SmartWFM.lib.RPC.request({
			action: 'quota.get',
			params: path,
			successCallback: function(result) {
				var msg = Math.round(result.used/1000)+' MB '+
						SmartWFM.lib.I18n.get('plugin.afsActions', 'of')+' '+
						Math.round(result.total/1000)+' MB '+
						SmartWFM.lib.I18n.get('plugin.afsActions', 'used')+
						' ('+result.percent_used+')';
				var percentage = result.used/result.total;
				this.getQuotaProgressBar().updateProgress(percentage, msg, true);
			},
			successScope: this
		});
	},

	loadGroups: function() {
		this.getGroupsWindow().setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Loading ...')});
	}
});
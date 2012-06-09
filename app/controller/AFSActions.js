/**
 * This plugin handles everything corresponding to AFS
 */
Ext.define('SmartWFM.controller.AFSActions', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.I18n'
	],

	refs: [{
		ref: 'quotaProgressBar',
		selector: 'viewport statusPanel progressbar[name=quota.progress]'
	}],

	init: function() {
		this.registerComponents();
		this.registerEvents();
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
				//this.getSearchView().getStore().loadData(result);
			},
			successScope: this
		});

		/*Ext.Ajax.request({
			url: SWFM.Config.get('command_url'),
			params: {
				data: SWFM.RPC.encode('quota.get', path)
			},
			callback: function(options, success, response) {
				var obj = SWFM.RPC.decode(response.responseText);
				var percentage = 0;
				if(obj.error === undefined) {
					var msg = Math.round(obj.result.used/1000)+' MB '+
						SWFM.I18N.get('plugin.afs_actions', 'of')+' '+
						Math.round(obj.result.total/1000)+' MB '+
						SWFM.I18N.get('plugin.afs_actions', 'used')+
						' ('+obj.result.percent_used+')';
					percentage = obj.result.used/obj.result.total;
				} else {
					var msg = SWFM.I18N.get('plugin.afs_actions.error', obj.error.message);
				}

				Ext.getCmp('swfm-statusbar').getBottomToolbar().find('name','quota.progress')[0].updateProgress(percentage,msg, true);
			}
		});*/
	}
});
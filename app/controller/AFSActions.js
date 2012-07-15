/**
 * This plugin handles everything corresponding to AFS
 */
Ext.define('SmartWFM.controller.AFSActions', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.I18n',
		'SmartWFM.view.afsActions.ManageGroupsWindow',
		'SmartWFM.view.afsActions.AddGroupDialog'
	],

	refs: [{
		ref: 'groupsWindow',
		selector: 'manageGroupsWindow'
	},{
		ref: 'addGroupWindow',
		selector: 'addGroupDialog'
	},{
		ref: 'addUserWindow',
		selector: 'addUserDialog'
	},{
		ref: 'quotaProgressBar',
		selector: 'viewport statusPanel progressbar[name=quota.progress]'
	}],

	init: function() {
		this.registerMenuItems();
		this.registerComponents();
		this.registerEvents();
		this.control({
			'addGroupDialog button[action=create]': {
				click: this.createGroup
			},
			'addUserDialog button[action=add]': {
				click: this.addUser
			},
			'manageGroupsWindow button[action=deleteSelected]': {
				click: this.deleteSelected
			}
		});
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

	loadGroups: function(expandedGroups) {
		expandedGroups = expandedGroups || new Array();
		var window = this.getGroupsWindow();
		window.setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Loading ...')});

		SmartWFM.lib.RPC.request({
			action: 'groups.get',
			params: new Array(),
			successCallback: function(result) { // called on success
				// clear all items in window (i.e. previous - outdated - tree panel)
				this.window.removeAll();
				var rootNode = {
					expanded: true,
					children: []
				};
				for(var i = 0; i < result.length; i++) {
					var name = result[i];
					rootNode.children.push({
						text: name,
						id: name,
						icon: SmartWFM.lib.Icon.get('afs.group', 'action', '32x32'),
						iconCls: 'manage-afs-groups-icon',
						expandable: true,
						leaf: false,
						checked: false,
						expanded: false, // ToDo #20
						children: [{}]
					});
				}
				rootNode.children.push({
					text: SmartWFM.lib.I18n.get('plugin.afsActions', 'Add group'),
					icon: SmartWFM.lib.Icon.get('afs.group.add', 'action', '32x32'),
					iconCls: 'manage-afs-groups-icon',
					leaf: true
				});
				this.window.add({
					xtype: 'treepanel',
					autoScroll: true,
					useArrows: true,
					rootVisible: false,
					store: Ext.create('Ext.data.TreeStore', {
						root: rootNode,
						folderSort: true,
						sorters: [{
							property: 'text',
							direction: 'asc'
						}]
					}),
					listeners: {
						itemclick: function(view, node) {
							if (node.data.text == SmartWFM.lib.I18n.get('plugin.afsActions', 'Add group')) {
								Ext.create('SmartWFM.view.afsActions.AddGroupDialog').show();
							} else if (node.data.text == SmartWFM.lib.I18n.get('plugin.afsActions', 'Add user(s)')) {
								var window = Ext.create('SmartWFM.view.afsActions.AddUserDialog');
								window.down('form').getForm().setValues({
									group: node.data.parentId
								});
								window.show();
							}
						},
						beforeitemexpand: function(node) {
							var window = this.up('window');
							window.setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Loading ...')});
							// remove all group members
							node.removeAll();
							SmartWFM.lib.RPC.request({
								action: 'groups.members.get',
								params: node.data.text,
								successCallback: function(result) { // called on success
									for(var i = 0; i < result.length; i++) {
										var name = result[i];
										console.warn('Adding ', name);
										this.node.appendChild({
											text: name,
											id: this.node.data.id + '/' + name,
											icon: SmartWFM.lib.Icon.get('afs.group.member', 'action', '32x32'),
											iconCls: 'manage-afs-groups-icon',
											leaf: true,
											checked: false
										});
									}
									this.node.appendChild({
										text: SmartWFM.lib.I18n.get('plugin.afsActions', 'Add user(s)'),
										icon: SmartWFM.lib.Icon.get('afs.group.member.add', 'action', '32x32'),
										iconCls: 'manage-afs-groups-icon',
										leaf: true
									});
								},
								successScope: {
									controller: this,
									node: node,
									window: window
								},
								callback: function() {	// called on always
									this.setLoading(false);
								},
								scope: window
							});
						}
					}
				});
				this.window.setLoading(false);
			},
			successScope: {
				controller: this,
				window: window
			},
			errorCallback: function() {	// called on error
				// close "manage afs groups" window
				this.close();
			},
			errorScope: window
		});
	},

	createGroup: function() {
		var window = this.getGroupsWindow();
		window.setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Loading ...')});
		var addWindow = this.getAddGroupWindow();
		var values = addWindow.down('form').getForm().getValues();

		SmartWFM.lib.RPC.request({
			action: 'groups.create',
			params: values['name'],
			successCallback: function(result) { // called on success
				this.addWindow.close();
				this.window.setLoading(false);
				this.controller.loadGroups();
			},
			successScope: {
				controller: this,
				window: window,
				addWindow: addWindow
			},
			errorCallback: function() {	// called on error
				// to be splitted up for race conditions
				this.setLoading(false);
			},
			errorScope: window
		});
	},

	addUser: function() {
		var window = this.getGroupsWindow();
		window.setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Loading ...')});
		var addWindow = this.getAddUserWindow();
		var values = addWindow.down('form').getForm().getValues();

		SmartWFM.lib.RPC.request({
			action: 'groups.members.add',
			params: {
				group: values['group'],
				user: values['user']
			},
			successCallback: function(result) { // called on success
				this.addWindow.close();
				this.window.setLoading(false);
				this.controller.loadGroups([values['group']]);
			},
			successScope: {
				controller: this,
				window: window,
				addWindow: addWindow
			},
			errorCallback: function() {	// called on error
				// to be splitted up for race conditions
				this.setLoading(false);
			},
			errorScope: window
		});
	},

	deleteSelected: function() {
		console.warn('ToDo');
	}
});
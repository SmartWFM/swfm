/**
 * This is a new file controller. It adds a menu entry to create new files.
 */
Ext.define('SmartWFM.controller.NewFile', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.Config'
	],

	refs: [{
		ref: 'browserView',
		selector: 'viewport > browser'
	},{
		ref: 'nameInput',
		selector: 'newFile > form > textfield[name=name]'
	}],

	currentBackendId: null,

	init: function() {
		this.registerMenuItems();
		this.control({
			'newFile button[action=add]': {
				click: this.create
			}
		});
	},

	registerMenuItems: function() {
		SmartWFM.lib.RPC.request({
			action: 'new_file.list',
			params: {
				lang: SmartWFM.lib.I18n.getLanguage()
			},
			successCallback: function(result) {
				for(var i in result) {
					var name = 'newFile' + i;

					var newFile = Ext.extend(Ext.menu.Item, {
						text: result[i]['title'],
						backendId: result[i]['id'],
						icon: SmartWFM.lib.Icon.get('file.new', 'action', '32x32'),
						handler: function () {
							// recycle rename window
							Ext.create('SmartWFM.view.newFile.NewFileWindow').show();
							SmartWFM.app.getController('NewFile').currentBackendId = this.backendId;
						}
					});
					SmartWFM.lib.Menu.add(name, newFile);

					SmartWFM.lib.Config.append('plugin.subMenus.createNew', name);
				}
			}
		}, false, false);
	},

	create: function() {
		var name = this.getNameInput().getValue();
		if(name === '')
			return; // do not accept empty names

		var path = this.getBrowserView().getActiveTab().getPath()
		SmartWFM.lib.RPC.request({
			action: 'new_file.create',
			params: {
				id: this.currentBackendId,
				path: path,
				name: name
			},
			successCallback: function(result) {
				var name = result['name'],
					mimeType = result['mime-type'];
				name = name.substr(name.lastIndexOf('/') + 1);

				Ext.ComponentQuery.query('newFile')[0].close();
				// dirty race conditions fix
				setTimeout(function(){SmartWFM.lib.Event.fire('', 'newFile', path, name, mimeType);}, 500);
				SmartWFM.lib.Event.fire('', 'refresh', path);
			},
			scope: this
		});

	}
});
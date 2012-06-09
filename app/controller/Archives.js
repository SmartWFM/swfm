/**
 * This plugin handles actions, which are involed with archives
 */
Ext.define('SmartWFM.controller.Archives', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.view.archives.ViewerWindow'
	],

	refs: [{
		ref: 'archiveViewer',
		selector: 'archiveViewer'
	}],

	init: function() {
		this.registerMenuItems();
		this.control({
			'archiveViewer button[action=extractAll]': {
				click: this.extractAll
			},
			'archiveViewer button[action=extractSelected]': {
				click: this.extractSelected
			}
		});
	},

	registerMenuItems: function() {
		var archiveViewer = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.archives', 'Archive Viewer'),
			icon: SmartWFM.lib.Icon.get('archive.extract', 'action', '32x32'),
			disabled: true,
			initComponent: function() {
				this.callParent();

				var files = this.context.files;
				var regex = new RegExp("application/(x-(([g]?zip)|(bzip2)))|zip|gtar");
				var archiveFiles = [];

				for(var i in files) {
					var file = files[i];
					if(file.mimeType && file.mimeType.match(regex))
						archiveFiles.push(file);
				}
				if(archiveFiles.length)
					this.setDisabled(false);

				var controller = SmartWFM.app.getController('Archives');
				controller.files = archiveFiles;
			},
			handler: function () {
				Ext.create('SmartWFM.view.archives.ViewerWindow').show();
				var controller = SmartWFM.app.getController('Archives');
				controller.load();
			}
		});
		SmartWFM.lib.Menu.add('archives.viewer', archiveViewer);
	},

	load: function() {
		var v = this.getArchiveViewer();
		v.setLoading(true);

		// getting first file in list (only one we need)
		var f = this.files[0];

		SmartWFM.lib.RPC.request({
			action: 'archive.list',
			params: f['path'] + '/' + f['name'],
			successCallback: function(result) { // called on success
				var controller = SmartWFM.app.getController('Archives');
				var root = {
					id: '.',
					expanded: true,
					children: controller.parseResult(result, '.')
				};
				controller.createTree(root);
			},
			callback: function() {	// called allways
				Ext.ComponentQuery.query('archiveViewer')[0].setLoading(false);
			}
		});
	},

	parseResult: function(data, rootId) {
		var treeData = [];

		for(var index in data) {
			if(data[index]) {
				// node contains children
				var id = rootId + '/' + index;
				treeData.push({
					text: index,
					icon: SmartWFM.lib.Icon.get('folder', 'place', '16x16'),
					expandable: true,
					leaf: false,
					checked: false,
					id: id,
					children: this.parseResult(data[index], id)
				});
			} else {
				// node is leaf
				treeData.push({
					text: index,
					icon: SmartWFM.lib.Icon.get('application/octet-stream', 'mime', '16x16'),
					expandable: false,
					leaf: true,
					checked: false,
					id: rootId + '/' + index
				});
			}
		}

		return treeData;
	},

	createTree: function(rootNode) {
		this.getArchiveViewer().add({
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
			})
		});
	},

	extractAll: function() {
		this.extract([]);
	},

	extractSelected: function() {
		var selectedNodes = this.getArchiveViewer().down('treepanel').getChecked();
		var files = [];
		for(var i in selectedNodes) {
			var node = selectedNodes[i];
			files.push(node.internalId);
		}
		if(files.length) {
			this.extract(files);
		}
	},

	extract: function(files) {
		this.getArchiveViewer().setLoading(true);
		// getting first file in list (only one we need)
		var f = this.files[0];
		SmartWFM.lib.RPC.request({
			action: 'archive.extract',
			params: {
				'archive': f['path'] + '/' + f['name'],
				'path': Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().getPath(),
				'files': files
			},
			successCallback: function(result) { // called on success
				Ext.ComponentQuery.query('archiveViewer')[0].destroy();
				SmartWFM.lib.Event.fire('', 'refresh');
			},
			successCallbackScope: this,
			callback: function() {	// called allways
				var w = Ext.ComponentQuery.query('archiveViewer')[0];
				if(w) { // if not already destroyed
					w.setLoading(false);
				}
			},
			callbackScope: this
		});
	}
});
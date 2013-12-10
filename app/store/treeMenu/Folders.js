Ext.define('SmartWFM.model.treeMenu.Folder', { // todo seperate file
	extend: 'Ext.data.Model',
	fields: [
		'name',
		'path',
		'hasSubDirs',
		{
			name: 'leaf',
			mapping: 'hasSubDirs',
			convert: function (v) {
				return (v == 1) ? false : true;
			}
		}
	],

	getExpanded: function() {
		var result = new Object();
		for(var i in this.childNodes) {
			var node = this.childNodes[i];
			if(node.isExpanded()) {
				result[node.data.path] = node.getExpanded();
			}
		}
		return result;
	},
	expandNodes: function(nodes, callback, scope) {
		for(var i in nodes) {
			var childNodes = nodes[i];
			var node = this.findChild('path', i);
			if(node) {
				node.expand(
					false,
					function() { 		// callback
						this.node.expandNodes(this.childNodes, this.callback, this.scope)
					},
					{ 					// scope
						node: node,
						childNodes: childNodes,
						callback: callback,
						scope: scope
					}
				);
			}
		}
		if(i == undefined && callback) {	// no child nodes and callback function availabe
			Ext.callback(callback, scope);
		}
	},
	refresh: function() {
		var treeStore = Ext.getStore('treeMenuStore');
		var expandedNodes = treeStore.getRootNode().getExpanded();
		treeStore.getRootNode().removeAll();
		treeStore.load({
			scope: {nodes: expandedNodes},
			callback: function(){
				Ext.getStore('treeMenuStore').getRootNode().expandNodes(this.nodes);
			}
		});
	}
});

Ext.define('SmartWFM.store.treeMenu.Folders', {
	extend: 'Ext.data.TreeStore',
	requires: [
		'SmartWFM.lib.Config',
		'SmartWFM.lib.Icon'
	],
	storeId: 'treeMenuStore',

	model: 'SmartWFM.model.treeMenu.Folder',

	// just for checking if it's the initial call
	initialCall: true,

	proxy: Ext.create('SmartWFM.lib.RPCProxy'),

	sorters: [{
		direction: 'ASC',
		property: 'name',
		transform: function(v) {
			return v.toUpperCase();
		}
	}],

	listeners: {
		beforeappend: function(me, node, refNode, eOpts) {
			// setting custom icon in tree view
			node.data.icon = SmartWFM.lib.Icon.get('folder', 'place', '16x16');
		},
		beforeload: function(me, operation){
			var currentPath = '/',
				rootNode = this.getRootNode();
			if(SmartWFM.app) {
				currentPath = SmartWFM.app.getController('Browser').getBrowserView().getActiveTab().getPath();
			}
			// add extra params to pass path, showhidden and current path arguments
			me.getProxy().setExtraParam('data', SmartWFM.lib.RPC.encode('dir.list', {
				path: operation['node']['data']['path'],
				showHidden: SmartWFM.lib.Setting.getValue('swfm.files.showHidden', false),
				currentPath: currentPath
			}));
			// set root node name
			rootNode.data.name = SmartWFM.lib.Config.get('widget.treeMenu.rootNodeName');
		}
	}
});
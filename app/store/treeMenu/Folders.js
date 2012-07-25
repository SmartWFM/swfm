Ext.define('SmartWFM.model.treeMenu.Folder', { // todo seperate file
	extend: 'Ext.data.Model',
	fields: [
		'name',
		'path',
		'hasSubDirs',
		{ 	name: 'leaf',
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

	root: {
		expanded: true,
		expandable: true,
		children: [],
		path: '/',
		name: SmartWFM.lib.Config.get('widget.treeMenu.rootNodeName')
	},

	// just for checking if it's the initial call
	initialCall: true,

	proxy: Ext.create('SmartWFM.lib.RPCProxy', {
		generateExtraParams: function(me, operation) {
			// node path
			var path = operation['node']['data']['path'];
			var exp = SmartWFM.lib.Config.get('widget.treeMenu.excludeFolder');
			if(exp !== '') {
				var re = new RegExp(exp, 'i');
			} else {
				var re = false;
			}

			if(re && re.exec(path)) { // fake request
				// calculating folder name
				// current working path
				var browserPath = SmartWFM.app.getController('Browser').getBrowserView().getActiveTab().getPath();
				var a = browserPath.substr(0, path.length);

				if(a == path) {
					a = browserPath.substr(path.length + 1); // trim first "/"
					var i = a.indexOf('/');
					switch(i) {
						case -1:
							var name = a;
							break;
						case 0:
							var name = ''; // todo
							break;
						default:
							var name = a.substr(0, i);
							break;
					}
				}

				me.extraParams = {
					data : SmartWFM.lib.RPC.encode(
						'dir.list.fake',
						{
							path: path,
							name: name
						}
					)
				};
			} else { // real request
				me.extraParams = {
					data : SmartWFM.lib.RPC.encode(
						'dir.list',
						{
							path: path,
							showHidden: false
						}
					)
				};
			}
		}
	}),

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
		load: function() {
			if(this.initialCall) { // workaround for initial tree menu selection
				this.initialCall = false;
				var path = SmartWFM.app.getController('Browser').getBrowserView().getActiveTab().getPath();
				SmartWFM.app.getController('TreeMenu').onActivateFolder(path);
			}
		}
	}
});
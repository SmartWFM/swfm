/**
 * Handles the tree menu
 */
Ext.define('SmartWFM.controller.TreeMenu', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.store.treeMenu.Folders'
		/*'SmartWFM.lib.Config',
		'SmartWFM.lib.Event',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.Path',
		'SmartWFM.lib.Setting'*/
	],

	views: [
		'treeMenu.TreeMenu'
	],

	refs: [{
		ref: 'treeMenuView',
		selector: 'viewport treemenu treeview'
	}],

	init: function() {
		this.control({
			'treemenu treeview': {
				itemclick: this.tvClick,
				itemdblclick: this.tvDblclick,
				itemcontextmenu: this.tvContextmenu,
				_action: this.tvAction,
				_contextmenu: this.tvContextmenuAction
			}
		});
		this.registerMenuItems();
		this.registerEvents();
	},

	registerMenuItems: function() {
		// ========== NEW TAB ==========
		// menu itme to open node in new tab
		var newTab = Ext.extend(Ext.menu.Item,{
			text: SmartWFM.lib.I18n.get('widget.treemenu', 'New Tab'),
			icon: SmartWFM.lib.Icon.get('tab.new', 'action', '32x32'),
			handler: function () {
				if(this.context && this.context.dirs)
					SmartWFM.lib.Event.fire('', 'newTab', this.context.dirs[0], true);
			}
		});
		SmartWFM.lib.Menu.add('treemenu.newTab', newTab);
		// ========== REFRESH ==========
		// menu itme to open node in new tab
		var refresh = Ext.extend(Ext.menu.Item,{
			text: SmartWFM.lib.I18n.get('widget.treemenu', 'Refresh'),
			icon: SmartWFM.lib.Icon.get('view.refresh', 'action', '32x32'),
			handler: function () {
				if(this.context && this.context.node)
					this.context.node.refresh();
			}
		});
		SmartWFM.lib.Menu.add('treemenu.refresh', refresh);
	},
	registerEvents: function() {
		SmartWFM.lib.Event.register(
			'widgetTreeMenu',
			'activateFolder',
			{
				callback: this.onActivateFolder,
				scope: this
			}
		);
		SmartWFM.lib.Event.register(
			'widgetTreeMenu',
			'tabSwitched',
			{
				callback: this.onActivateFolder,
				scope: this
			}
		);
	},

	tvClick: function(me, node, htmlItem, index, e) { // todo refactoring - see Browser controller
		var time = new Date().getTime();
		var delay = DELAY;
		if ((me.lastClick === undefined) || (time - me.lastClick > delay)) {
			me.lastClick = time;
			var task = new Ext.util.DelayedTask(function(node, e) {
				if (me.lastClick === undefined) {
					return;
				}
				if (SmartWFM.lib.Setting.getValue('swfm.controls.action') === 1) {
					me.fireEvent('_action', node);
				} else if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 1) {
					me.fireEvent('_contextmenu', node, e);
				}
			}, this, [node, e]);
			task.delay(delay);
		}
		e.stopEvent();
	},
	tvDblclick: function(me, node, htmlItem, index, e) { // todo refactoring - see Browser controller
		me.lastClick = undefined;
		if (SmartWFM.lib.Setting.getValue('swfm.controls.action') === 3) {
			me.fireEvent('_action', node);
		} else if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 3) {
			me.fireEvent('_contextmenu', node, e);
		}
		e.stopEvent();
	},
	tvContextmenu: function(me, node, htmlItem, index, e) { // todo refactoring - see Browser controller
		// disable browser context menu
		e.preventDefault();
		me.lastClick = undefined;
		if (SmartWFM.lib.Setting.getValue('swfm.controls.action') === 2) {
			me.fireEvent('_action', node);
		} else if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 2) {
			me.fireEvent('_contextmenu', node, e);
		}
	},
	tvAction: function(node) {
		SmartWFM.lib.Event.fire(
			'',
			'activateFolder',
			node.data.path
		);
	},
	tvContextmenuAction: function(node, e) {
		var menu = SmartWFM.lib.Menu.get(
			SmartWFM.lib.Config.get('widget.treemenu.menu.context'),
			{
				dirs: [node.data.path],
				files: undefined,
				node: node
			}
		);
		menu.showAt(e.getXY());
	},

	onActivateFolder: function(path) {
		var view = this.getTreeMenuView();
		var selectionModel = view.getSelectionModel();
		var selectedNodes = selectionModel.getSelection();
		if(selectedNodes.length) {
			var node = selectedNodes[0];
			if(node.data.path == path)
				return;
		}
		var rootNode = view.getTreeStore().getRootNode();

		if(path == '/') {
			selectionModel.select(rootNode);
			return;
		}

		function foo(path, result) {
			result = result || {};
			var i = path.lastIndexOf('/')
			if(i > 0) {
				var remainingPath = path.substring(0, i);
				var localResult = {};
				localResult[remainingPath] = result;
				result = foo(remainingPath, localResult);
			}

			return result;
		}

		var result = {};
		result[path] = {};
		rootNode.expandNodes(
			foo(path, result),	// nodes to be expanded
			function(){			// callback
				var newSelectedNode = this.rootNode.findChild(
					'path',
					path,
					true
				);
				if(newSelectedNode != null) {
					this.selectionModel.select(newSelectedNode);
				}
			},
			{					//scope
				rootNode: rootNode,
				selectionModel: selectionModel
			}
		);
	}

});
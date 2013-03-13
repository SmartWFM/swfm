DELAY = 400;
/**
 * Handles the tabs
 */
Ext.define('SmartWFM.controller.Browser', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Config',
		'SmartWFM.lib.Event',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.Path',
		'SmartWFM.lib.Resource',
		'SmartWFM.lib.Setting'
	],

	refs: [{
		ref: 'browserView',
		selector: 'viewport > browser'
	}],

	views: [
		'browser.Tab',
		'browser.IconView'
	],

	stores: [
		'Files'
	],

	// just for checking if it's the initial call
	initialCall: true,

	addTab: function(path, activate) {
		var browser = this.getBrowserView();

		var tab = Ext.create('widget.browser.Tab', {path: path});
		browser.add(tab);
		if (activate) {
			browser.setActiveTab(tab);
			if(this.initialCall) {
				this.initialCall = false;
				// dirty fix of race condition on initialization
				setTimeout(function(){tab.fireEvent('activate');}, 50);
			}
		}
	},

	init: function() {
		// development-only-begin
		SmartWFM.lib.Resource.loadCSS('resources', 'browser.css');
		// development-only-end
		this.registerSettings();
		this.control({
			'browser dataview': {
				itemclick: this.dvClick,
				itemdblclick: this.dvDblclick,
				itemcontextmenu: this.dvContextmenu,
				containerclick: this.dvContainerClick,
				containercontextmenu: this.dvContainerContextmenu,
				_action: this.dvAction,
				_contextmenu: this.dvContextmenuAction,
				_containercontextmenu: this.dvContainerContextmenuAction
			}
		});
		this.registerMenuItems();
		this.registerEvents();
	},

	registerMenuItems: function() {
		//========== ICON VIEW ==========
		// Menu item to select the icon view mode
		var iconView = Ext.extend(Ext.menu.Item,{
			text: SmartWFM.lib.I18n.get('widget.browser', 'Icon View'),
			icon: SmartWFM.lib.Icon.get('view.list.icons', 'action', '32x32'),
			handler: function () {
				SmartWFM.lib.Setting.setValue('widget.browser.defaultView', 1);
				SmartWFM.lib.Event.fire('', 'settingsChanged', ['widget.browser.defaultView']);
			}
		});
		SmartWFM.lib.Menu.add('iconview', iconView);
		//========== LIST VIEW ==========
		// Menu item to select the list view mode
		var listView = Ext.extend(Ext.menu.Item,{
			text: SmartWFM.lib.I18n.get('widget.browser', 'List View'),
			icon: SmartWFM.lib.Icon.get('view.list.details', 'action', '32x32'),
			handler: function () {
				SmartWFM.lib.Setting.setValue('widget.browser.defaultView', 2);
				SmartWFM.lib.Event.fire('', 'settingsChanged', ['widget.browser.defaultView']);
			}
		});
		SmartWFM.lib.Menu.add('listview', listView);
		//========== NEW TAB ==========
		var newTab = Ext.extend(Ext.menu.Item,{
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'New Tab'),
			icon: SmartWFM.lib.Icon.get('tab.new', 'action', '32x32'),
			handler: function(){
				SmartWFM.lib.Event.fire('', 'newTab', SmartWFM.lib.Config.get('homePath'), true);
			}
		});
		SmartWFM.lib.Menu.add('newtab', newTab);
	},

	registerEvents: function() {
		SmartWFM.lib.Event.register(
			'widgetBrowser',
			'settingsChanged',
			{
				callback: this.onSettingsChanged,
				scope: this
			}
		);
		SmartWFM.lib.Event.register(
			'widgetBrowser',
			'newTab',
			{
				callback: this.addTab,
				scope: this
			}
		);
		SmartWFM.lib.Event.register(
			'widgetBrowser',
			'activateFolder',
			{
				callback: this.onActivateFolder,
				scope: this
			}
		);
		SmartWFM.lib.Event.register(
			'widgetBrowser',
			'refresh',
			{
				callback: this.onRefresh,
				scope: this
			}
		);
	},

	registerSettings: function() {
		SmartWFM.lib.Setting.registerComponent('widget.browser', {label: SmartWFM.lib.I18n.get('widget.browser', 'Browser')});

		// view options
		SmartWFM.lib.Setting.registerGroup('widget.browser', 'view', {label: SmartWFM.lib.I18n.get('widget.browser', 'View')});
		SmartWFM.lib.Setting.register(
			'widget.browser.defaultView',
			'widget.browser',
			'view',
			'defaultView',
			{
				label: SmartWFM.lib.I18n.get('widget.browser', 'Default View'),
				type: 'select',
				'default': SmartWFM.lib.Config.get('widget.browser.defaultView', 1),	// have to be put in quotes for opera and yui - reseverd word
				data: [
					{
						title: SmartWFM.lib.I18n.get('widget.browser', 'Icon View'),
						value: 1
					},
					{
						title: SmartWFM.lib.I18n.get('widget.browser', 'List View'),
						value: 2
					}
				]
			}
		);
	},

	dvAction: function(me, index, node, e) {
		if (node.data.isDir === true) {
			var path = SmartWFM.lib.Path.join(node.data.path, node.data.name);
			SmartWFM.lib.Event.fire(
				'',
				'activateFolder',
				path
			);
		} else {
			me.select(node);
			var menu = SmartWFM.lib.Menu.get(
				SmartWFM.lib.Config.get('widget.browser.menu.itemContext'),
				{
					dirs: [],
					files: [node.data]
				}
			);

			// call the first element
			if (menu !== undefined) {
				var firstElement = menu.items.items[0];
				firstElement.handler();
			}
		}
	},
	dvContextmenuAction: function(me, index, node, e) {
		var view = this.getBrowserView().getActiveTab().down('dataview, gridpanel');

		var selection = view.getSelectionModel().getSelection();
		// select node if it's not selected
		if (!view.getSelectionModel().isSelected(node)) {
			view.getSelectionModel().select(node, true);
			selection = view.getSelectionModel().getSelection();
		}

		// some vars
		var dirs = [];
		var files = [];

		// sort selected items by isDir() or not
		for (i = 0; i < selection.length; i++) {
			if (selection[i].data.isDir === true) {
				dirs.push(selection[i].data);
			} else {
				files.push(selection[i].data);
			}
		}

		// get menu from config
		var contextMenu = SmartWFM.lib.Config.get('widget.browser.menu.itemContext');

		// generate the menu
		var menu = SmartWFM.lib.Menu.get(
			contextMenu,
			{
				dirs: dirs,
				files: files
			}
		);

		// show the menu
		if (menu !== undefined) {
			menu.showAt(e.getXY());
		}
	},
	dvContainerContextmenuAction: function(me, e) {
		var tab = this.getBrowserView().getActiveTab();

		var contextMenu = SmartWFM.lib.Config.get('widget.browser.menu.context');
		var menu = SmartWFM.lib.Menu.get(
			contextMenu,
			{
				'path': tab.getPath()
			}
		);

		// show the menu
		if (menu !== undefined) {
			menu.showAt(e.getXY());
		}
	},
	dvClick: function(me, node, htmlItem, index, e) {
		// hasModifier sometimes returns 'undefined' ... to eliminate this OR-link it with false
		if ((e.hasModifier() || false) === false) {
			// only do this if no control, meta, shift or alt key was pressed
			var time = new Date().getTime();
			var delay = DELAY;
			if ((me.lastClick === undefined) || (time - me.lastClick > delay)) {
				me.lastClick = time;
				var task = new Ext.util.DelayedTask(function(me, index, node, e) {
					if (me.lastClick === undefined) {
						return;
					}
					if (SmartWFM.lib.Setting.getValue('swfm.controls.action') === 1) {
						me.fireEvent('_action', me, index, node, e);
					} else if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 1) {
						me.fireEvent('_contextmenu', me, index, node, e);
					}
				}, this, [me, index, node, e]);
				task.delay(delay);
			}
		}
		e.stopEvent();
	},
	dvContextmenu: function(me, node, htmlItem, index, e) {
		// disable browser context menu
		e.preventDefault();
		me.lastClick = undefined;
		if (SmartWFM.lib.Setting.getValue('swfm.controls.action') === 2) {
			me.fireEvent('_action', me, index, node, e);
		} else if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 2) {
			me.fireEvent('_contextmenu', me, index, node, e);
		}
	},
	dvDblclick: function(me, node, htmlItem, index, e) {
		me.lastClick = undefined;
		if (SmartWFM.lib.Setting.getValue('swfm.controls.action') === 3) {
			me.fireEvent('_action', me, index, node, e);
		} else if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 3) {
			me.fireEvent('_contextmenu', me, index, node, e);
		}
		e.stopEvent();
	},
	dvContainerClick: function(me, e) {
		// there is no double click for the container, so we simulate it
		// fire _containercontextmenu event if the container was clicked twice in the specified delay
		var time = new Date().getTime();
		var delay = DELAY;
		if ((me.lastClick === undefined) || (time - me.lastClick > delay)) {
			me.lastClick = time;
			// single click detected?
			var task = new Ext.util.DelayedTask(function (me, e) {
				if (me.lastClick === undefined) {
					return;
				}
				// event
				if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 1) {
					me.fireEvent('_containercontextmenu', me, e);
				}
			}, this, [me, e]);
			task.delay(delay);
		} else if (time - me.lastClick < delay) {
			me.lastClick = undefined;
			if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 3) {
				me.fireEvent('_containercontextmenu', me, e);
			}
		}
		e.stopEvent();
	},
	dvContainerContextmenu: function(me, e) {
		// disable browser context menu
		e.preventDefault();
		me.lastClick = undefined;
		if (SmartWFM.lib.Setting.getValue('swfm.controls.contextMenu') === 2) {
			me.fireEvent('_containercontextmenu', me, e);
		}
		e.stopEvent();
	},

	onSettingsChanged: function(settings) {
		var tab = this.getBrowserView().getActiveTab();
		if (Ext.Array.contains(settings, 'widget.browser.defaultView')) {
			tab.setViewMode(SmartWFM.lib.Setting.getValue('widget.browser.defaultView', 1));
		}
		if (Ext.Array.contains(settings, 'swfm.files.showHidden')) {
			this.onRefresh();
		}
	},

	onActivateFolder: function(path, newHistoryIndex) {
		var tab = this.getBrowserView().getActiveTab();
		// second parameter available if event fired by back/forward button
		if(newHistoryIndex == undefined) {
			// no back or forward action - rewrite history and push new path to history
			var curLength = tab.history.length - 1;
			if(curLength != tab.historyIndex ) {
				// remove following history, because we have done steps back and now go to a new path
				tab.history.splice(tab.historyIndex + 1, curLength - (tab.historyIndex));
				curLength = tab.history.length - 1;
			}
			// append new path
			tab.history.push(path);
			tab.historyIndex = curLength + 1;
		} else {
			// back or forward action - so just change historyIndex
			tab.historyIndex = newHistoryIndex;
		}
		// update back/forward menu
		tab.updateHistoryMenu();
		// change path
		tab.changePath(path);
	},

	onRefresh: function() {
		this.getBrowserView().getActiveTab().store.load();
	}
});
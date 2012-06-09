/**
 * Handles the bookmarks view
 */
Ext.define('SmartWFM.controller.Bookmarks', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Config',
		'SmartWFM.lib.Event',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.Path',
		'SmartWFM.lib.Setting',
		'SmartWFM.view.bookmarks.AddWindow'
	],

	refs: [{
		ref: 'browserView',
		selector: 'viewport > browser'
	},{
		ref: 'bookmarksView',
		selector: 'viewport > sidePanel > bookmarks'
	}],

	init: function() {
		this.control({
			'bookmarks button[action=add]': {
				click: this.openAddWindow
			},
			'bookmarks': {
				beforeexpand: this.reloadBookmarks,
				cellclick: this.clickBookmark
			}
		});
	},

	reloadBookmarks: function() {
		SmartWFM.lib.RPC.request({
			action: 'bookmarks.load',
			successCallback: function(result) {
				var store = this.getBookmarksView().getStore();
				store.loadData(result);
			},
			successScope: this
		});
	},

	clickBookmark: function(view, cell, cellIdx, record, row, rowIdx, eOpts) {
		if(cellIdx != 0)	// so it's the action column
			return;
		var path = record.get('location');
		SmartWFM.lib.Event.fire(
			'widget.bookmarks',
			'activateFolder',
			path
		);
	},

	openAddWindow: function(name, path) {
		if(arguments.length != 2) {
			// click event - incorrect arguments
			var name = undefined;
			var path = undefined;
		}
		var name = name || 'root';
		var path = path || this.getBrowserView().getActiveTab().getPath();
		var originalPath = path;
		if (path !== '/') {
			// fix - trailing '/' results in empty name
			if(path[path.length - 1] == '/')
				path = path.substr(0, path.length - 1);
			var tmp = path.split('/');
			if (tmp.length > 0)
				name = tmp[tmp.length - 1];
		}
		var w = Ext.create('SmartWFM.view.bookmarks.AddWindow');
		w.down('textfield[name=bookmarkName]').setValue(name);
		w.down('hiddenfield[name=bookmarkPath]').setValue(originalPath);
		w.show();
	},

	add: function(name, path) {
		var path = path || this.getBrowserView().getActiveTab().getPath();

		// only add, if not empty
		if(name == '')
			return;

		var store = this.getBookmarksView().getStore();

		// check if bookmark exists
		var index = store.findExact('location', path);

		if(index == -1) {
			// not found - add them
			store.add({
				name: name,
				location: path
			});
		} else {
			var record = store.getAt(index);
			record.set('name', name);
			record.commit();
		}

	}
});
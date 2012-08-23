Ext.define('SmartWFM.view.browser.Tab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.browser.Tab',

	requires: [
		'SmartWFM.lib.Path',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Config',
		'SmartWFM.store.Files',
		'SmartWFM.view.browser.GridView',
		'SmartWFM.view.browser.IconView'
	],

	layout: 'fit',

	closable: true,

	tbar: [],

	title: '',
	header: false,

	initComponent: function() {
		if (this.path === undefined)
			this.path = SmartWFM.lib.Config.get('homePath');

		this.history = new Array();
		this.history.push(this.path);
		this.historyIndex = 0;

		this.callParent();
		this.updateTitle();
		// create new store
		this.store = Ext.create('SmartWFM.store.Files');
		//getting toolbar
		var tb = this.getDockedItems('toolbar')[0];
		// create all toolbar items
		tb.add(
			Ext.create('Ext.button.Split', {
				text: SmartWFM.lib.I18n.get('widget.browser', 'Back'),
				tooltip: SmartWFM.lib.I18n.get('widget.browser', 'Back'),
				name: 'back',
				menu: new Ext.menu.Menu(),
				icon: SmartWFM.lib.Icon.get('go.previous', 'action', '16x16'),
				handler: function () {
					var tab = this.up('panel');
					var newHistoryIndex = tab.historyIndex - 1;
					if(newHistoryIndex >= 0) {
						var path = tab.history[newHistoryIndex];
						SmartWFM.lib.Event.fire('', 'activateFolder', path, newHistoryIndex);
					}
				}

			}),
			Ext.create('Ext.button.Split', {
				text: SmartWFM.lib.I18n.get('widget.browser', 'Forward'),
				tooltip: SmartWFM.lib.I18n.get('widget.browser', 'Forward'),
				name: 'forward',
				menu: new Ext.menu.Menu(),
				icon: SmartWFM.lib.Icon.get('go.next', 'action', '16x16'),
				handler: function () {
					var tab = this.up('panel');
					var newHistoryIndex = tab.historyIndex + 1;
					if(newHistoryIndex <= (tab.history.length - 1)) {
						var path = tab.history[newHistoryIndex];
						SmartWFM.lib.Event.fire('', 'activateFolder', path, newHistoryIndex);
					}
				}

			}),
			'-',
			Ext.create('Ext.form.field.Text', {
				name: 'path',
				value: this.path,
				minWidth: 250,
				listeners: {
					specialkey: function (self, e) {
						if (e.getKey() === e.ENTER) {
							SmartWFM.lib.Event.fire('', 'activateFolder', self.value);
						}
					}
				}
			}),
			Ext.create('Ext.button.Button', {
				text: SmartWFM.lib.I18n.get('widget.browser', 'Go'),
				tooltip: SmartWFM.lib.I18n.get('widget.browser', 'Go'),
				icon: SmartWFM.lib.Icon.get('go.location', 'action', '16x16'),
				handler: function () {
					var path = this.up('toolbar').down('textfield[name="path"]').getValue();
					SmartWFM.lib.Event.fire('', 'activateFolder', path);
				}
			}),
			'->',
			Ext.create('Ext.form.TextField' ,{
				name: 'filter',
				emptyText: SmartWFM.lib.I18n.get('widget.browser', 'Filter'),
				listeners: {
					specialkey: function (self, e) {
						if (e.getKey() === e.ENTER) {
							var toolbar = this.up('toolbar');
							var filterValue = toolbar.down('textfield[name="filter"]').getValue();
							var useAsRegex = toolbar.down('menucheckitem[name="useAsRegex"]').checked;
							SmartWFM.lib.Event.fire('', 'applyFilter', filterValue, useAsRegex);
						}
					}
				}
			}),
			Ext.create('Ext.button.Split', {
				name: 'filterApply',
				text: SmartWFM.lib.I18n.get('widget.browser', 'Apply'),
				tooltip: SmartWFM.lib.I18n.get('widget.browser', 'Apply'),
				handler: function (self, e) {
					var toolbar = this.up('toolbar');
					var filterValue = toolbar.down('textfield[name="filter"]').getValue();
					var useAsRegex = toolbar.down('menucheckitem[name="useAsRegex"]').checked;
					var caseSensitive = toolbar.down('menucheckitem[name="caseSensitive"]').checked;
					SmartWFM.lib.Event.fire('', 'applyFilter', filterValue, useAsRegex, caseSensitive);
				},
				menu: {
					items: [
						Ext.create('Ext.menu.CheckItem', {
							name: 'useAsRegex',
							text: SmartWFM.lib.I18n.get('widget.browser', 'Use as RegEx')
						}),
						Ext.create('Ext.menu.CheckItem', {
							name: 'caseSensitive',
							text: SmartWFM.lib.I18n.get('widget.browser', 'Case sensitive')
						})
					]
				}
			}),

			Ext.create('Ext.button.Button', {
				text: SmartWFM.lib.I18n.get('widget.browser', 'Clear'),
				tooltip: SmartWFM.lib.I18n.get('widget.browser', 'Clear'),
				handler: function (self, e) {
					var toolbar = this.up('toolbar');
					var filterValue = this.up('toolbar').down('textfield[name="filter"]').setValue('');
						SmartWFM.lib.Event.fire('', 'clearFilter');
				}
			})
		);
		// create history menu in forward and backward button
		this.updateHistoryMenu();
	},

	listeners: {
		activate: function() {
			this.store.load();
			this.setViewMode(SmartWFM.lib.Setting.getValue('widget.browser.defaultView', 1));
			SmartWFM.lib.Event.fire('', 'tabSwitched', this.path);
		}
	},

	updateHistoryMenu: function() {
		var buttonBack = this.down('splitbutton[name="back"]');
		var buttonForward = this.down('splitbutton[name="forward"]');
		buttonBack.menu.removeAll();
		if (this.historyIndex > 0 && this.history.length > 1) {
			buttonBack.setDisabled(false);
			for (var i = this.historyIndex - 1; i >= 0; i--) {
				buttonBack.menu.add(
					Ext.create('Ext.menu.Item', {
						text: this.history[i],
						scope: {
							historyIndex: i,
							path: this.history[i]
						},
						handler: function () {
							buttonBack.hideMenu();
							SmartWFM.lib.Event.fire('', 'activateFolder', this.path, this.historyIndex);
						}
					})
				);
			}
		} else {
			buttonBack.setDisabled(true);
		}

		buttonForward.menu.removeAll();
		if (this.history.length - 1 > this.historyIndex) {
			buttonForward.setDisabled(false);
			for (i = this.historyIndex + 1; i < this.history.length; i++) {
				buttonForward.menu.add(
					Ext.create('Ext.menu.Item', {
						text: this.history[i],
						scope: {
							historyIndex: i,
							path: this.history[i]
						},
						handler: function () {
							buttonForward.hideMenu();
							SmartWFM.lib.Event.fire('', 'activateFolder', this.path, this.historyIndex);
						}
					})
				);
			}
		} else {
			buttonForward.setDisabled(true);
		}
	},

	setPath: function(path) {
		this.path = path;
		this.updateTitle();
		var tb = this.getDockedItems('toolbar')[0];
		tb.down('textfield[name="path"]').setValue(path);
	},

	changePath: function(path) {
		this.setPath(path);
		this.store.load();
	},

	updateTitle: function() {
		this.setTitle(SmartWFM.lib.Path.getName(this.path, SmartWFM.lib.I18n.get('widget.browser', 'Root')));
	},

	setViewMode: function(mode) {
		var me = this;

		if(mode == me.viewMode)
			return;

		me.viewMode = mode;

		switch(mode) {
			case 1:
				var view = Ext.create('widget.browser.IconView', {store: me.store});
				break;
			case 2:
				var view = Ext.create('widget.browser.GridView', {store: me.store});
				break;
		}
		me.removeAll();
		me.add(view);
	},

	getPath: function() {
		return this.path;
	},

	getViewMode: function() {
		return this.mode;
	}
});

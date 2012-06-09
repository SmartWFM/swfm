Ext.define('SmartWFM.view.baseActions.CopyErrorWindow', {
	extend: 'SmartWFM.view.baseActions.ErrorWindow',

	title: SmartWFM.lib.I18n.get('plugin.baseActions', 'Error copying file ...'),
	width: 700,
	height: 150,

	buttons: [{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Retry'),
		handler: function() {
			var w = this.up('window');
			// re-add item
			w['data']['items'].push(w['data']['item']);
			w.doAction();
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Rename'),
		handler: function() {
			var w = this.up('window');
			// removes all slashes
			var name = w.down('textfield').getValue().replace(/\//g, '');
			// re-add item
			w['data']['item']['destination']['name'] = name;
			w['data']['items'].push(w['data']['item']);
			w.doAction();
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Overwrite'),
		overwriteButton: true, // used to delete this button in moveErrorWindow
		handler: function() {
			var w = this.up('window');
			// enable overwrite
			w['data']['item']['overwrite'] = true;
			// re-add item
			w['data']['items'].push(w['data']['item']);
			w.doAction();
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Overwrite all'),
		overwriteButton: true, // used to delete this button in moveErrorWindow
		handler: function() {
			var w = this.up('window');
			w.doAction(undefined, true);
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Ignore'),
		handler: function() {
			var w = this.up('window');
			w.doAction();
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Ignore all'),
		handler: function() {
			var w = this.up('window');
			w.doAction(true);
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
		handler: function() {
			var w = this.up('window');
			var data = w['data'];
			w.close();
			data['controller'].copyAction(
				data['window'],
				[]
			);
		}
	}],

	initComponent: function() {
		this.callParent();
		var msg = this['data']['item']['isDir'] ?
			SmartWFM.lib.I18n.get('plugin.baseActions.error', 'Can\'t process the folder.') :
			SmartWFM.lib.I18n.get('plugin.baseActions.error', 'Can\'t process the file.');
		msg += '<br /><b>';
		msg += SmartWFM.lib.Path.join(this['data']['item']['path'], this['data']['item']['name']);
		msg += '</b><br />';
		this.add({
			xtype: 'label',
			html: msg,
			plain: true
		},{
			xtype: 'textfield',
			value: this['data']['item']['name'],
			fieldLabel: SmartWFM.lib.I18n.get('plugin.baseActions.error', 'Rename to'),
			labelAlign: 'top',
			plain: true
		});
	},

	doAction: function(ignoreAll, overwriteAll) {
		this['data']['controller'].copyAction(
			this['data']['window'],
			this['data']['items'],
			undefined,
			this['data']['processedCount'],
			overwriteAll || this['data']['overwriteAll'],
			ignoreAll || this['data']['ignoreAll']
		);
	}
});
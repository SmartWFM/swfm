Ext.define('SmartWFM.view.baseActions.DeleteErrorWindow', {
	extend: 'SmartWFM.view.baseActions.ErrorWindow',

	title: SmartWFM.lib.I18n.get('plugin.baseActions', 'Error deleting file ...'),

	buttons: [{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Retry'),
		handler: function() {
			var w = this.up('window');
			// re-add item
			w['data']['items'].push(w['data']['item']);
			w['data']['controller'].deleteAction(
				w['data']['window'],
				w['data']['items'],
				w['data']['processedCount'],
				w['data']['ignoreAll']
			);
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Ignore'),
		handler: function() {
			var w = this.up('window');
			w['data']['controller'].deleteAction(
				w['data']['window'],
				w['data']['items'],
				w['data']['processedCount'],
				w['data']['ignoreAll']
			);
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Ignore all'),
		handler: function() {
			var w = this.up('window');
			w['data']['controller'].deleteAction(
				w['data']['window'],
				w['data']['items'],
				w['data']['processedCount'],
				true
			);
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
		handler: function() {
			var w = this.up('window');
			var data = w['data'];
			w.close();
			data['controller'].deleteAction(
				data['window'],
				[]
			);
		}
	}],

	initComponent: function() {
		this.callParent();
		var msg = this['data']['item']['isDir'] ?
			SmartWFM.lib.I18n.get('plugin.baseActions.error', 'Can\'t delete the folder.') :
			SmartWFM.lib.I18n.get('plugin.baseActions.error', 'Can\'t delete the file.');
		msg += '<br /><b>';
		msg += SmartWFM.lib.Path.join(this['data']['item']['path'], this['data']['item']['name']);
		msg += '</b>';
		this.removeChildEls();
		this.add({
			xtype: 'label',
			html: msg,
			plain: true
		});

	}
});
/**
 * This plugin handles everything corresponding to AFS
 */
Ext.define('SmartWFM.model.File', {
	extend: 'Ext.data.Model',
	requires: [
		'SmartWFM.lib.Icon',
		'SmartWFM.lib.RPCProxy'
	],
	proxy: Ext.create('SmartWFM.lib.RPCProxy', {
		generateExtraParams: function(me) {
			var path = SmartWFM.app.getController('Browser').getBrowserView().getActiveTab().getPath();
			me.extraParams = {data : SmartWFM.lib.RPC.encode('file.list', {path: path, showHidden: SmartWFM.lib.Setting.getValue('swfm.files.showHidden')})};
		}
	}),

	fields: [
		'name',
		'path',
		'size',
		{ name:'mimeType', mapping: 'mime-type' },
		'isDir',
		{ name: 'shortName', mapping: 'name',
			convert: function (v, record) {
				//return Ext.util.Format.ellipsis(v, 12);
				//overwritten in app/view/browser/IconView.js:34 (prepareData function)
				var w = v;
				if(v.length > 12) {
					w = v.substr(0, 3);
					w += '...';
					w += v.substr(v.length-6);
				}
				return Ext.util.Format.htmlEncode(w);
			}
		},
		{ name: 'icon', mapping: 'mime-type',
			convert: function (v, record) {
				if(record.get('isDir') == true) {
					return SmartWFM.lib.Icon.get('folder', 'place');
				}
				return SmartWFM.lib.Icon.get(v);
			}
		},
		{ name: 'atime', mapping: 'atime', type: 'date', dateFormat: 'U' },
		{ name: 'ctime', mapping: 'ctime', type: 'date', dateFormat: 'U' },
		{ name: 'mtime', mapping: 'mtime', type: 'date', dateFormat: 'U' },
		{ name: 'perms', mapping: 'perms',
			convert: function(v, record) {
				if(!v)
					return '---';
				var r = '';
				v = v.slice(-3);

				for(var i = 0; i < 3; i ++) {
					r += (v[i] >= 4) ? 'r' : '-';
					r += (v[i]%4 >= 2) ? 'w' : '-';
					r += (v[i]%2 >= 1) ? 'x' : '-';
				}

				return r;
			}
		}
	]
});

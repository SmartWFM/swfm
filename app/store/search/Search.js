Ext.define('SmartWFM.store.search.Search', {
	extend: 'Ext.data.ArrayStore',

	requires: [
		'SmartWFM.lib.Icon'
	],

	fields: [
		'name',
		'location',
		{name: 'isDir', type: 'boolean'},
		{name: 'icon', mapping: 'isDir', convert: function(value, record) {
			if(record.get('isDir')) { // parameter value contains wrong value -.-
				return SmartWFM.lib.Icon.get('folder', 'place');
			} else {
				return SmartWFM.lib.Icon.get('text/plain', 'mime');
			}
		} }
	]
});
Ext.define('SmartWFM.store.bookmarks.Bookmarks', {
	extend: 'Ext.data.ArrayStore',

	fields: [
		'name',
		'location'
	],

	listeners: {
		add: function() {
			this.fireEvent('saveChanges');
		},
		remove: function() {
			this.fireEvent('saveChanges');
		},
		update: function() {
			this.fireEvent('saveChanges');
		},
		saveChanges: function() {// save changes to backend
			// grab whole data set
			var records = this.getRange();
			var data = [];
			for(var i = 0; i < records.length; i++) {
				data.push([
					records[i].get('name'),
					records[i].get('location')
				]);
			}
			// submit new data
			SmartWFM.lib.RPC.request({
				action: 'bookmarks.save',
				params: data
			});
		}
	}
});
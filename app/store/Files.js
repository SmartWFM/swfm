Ext.define('SmartWFM.store.Files', {
	extend: 'Ext.data.Store',
	model: 'SmartWFM.model.File',
	requires: ['SmartWFM.lib.Event'],

	// autoLoad: true,

	sorters: [{
		direction: 'ASC',
		property: 'isDir',
		transform: function(v) {
			return v ? 1 : 2;
		}
	},{
		direction: 'ASC',
		property: 'name',
		transform: function(v) {
			return v.toUpperCase();
		}
	}],

	constructor: function(config) {
		this.callParent();

		SmartWFM.lib.Event.register(
			'storeFiles',
			'applyFilter',
			{
				callback: this.onApplyFilter,
				scope: this
			}
		);

		SmartWFM.lib.Event.register(
			'storeFiles',
			'clearFilter',
			{
				callback: this.clearFilter,
				scope: this
			}
		);

		return this;
	},

	onApplyFilter: function(filter, useAsRegex, caseSensitive) {
		//clear previous filters
		this.clearFilter();
		// defaults to: true
		if(caseSensitive !== false)
			caseSensitive = true;
		if(useAsRegex === true)
			filter = new RegExp(filter, caseSensitive ? '' : 'i');

		this.filter([{
			property: 'name',
			value: filter,
			anyMatch: true,
			caseSensitive: caseSensitive
		}]);
	}
});

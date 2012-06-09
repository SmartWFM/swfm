/**
 * Adds a accordion tab in the left sidepanel to search via backend functions.
 */
Ext.define('SmartWFM.controller.Search', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Event',
		'SmartWFM.lib.RPC',
		'SmartWFM.lib.I18n'
	],

	refs: [{
		ref: 'browserView',
		selector: 'viewport > browser'
	},{
		ref: 'searchView',
		selector: 'viewport > sidePanel > search'
	},{
		ref: 'searchTermField',
		selector: 'viewport > sidePanel > search textfield[name=searchTerm]'
	}],

	init: function() {
		this.control({
			'search': {
				itemclick: this.clickItem
			},
			'search button[action=search]': {
				click: this.search
			}
		});
	},

	clickItem: function(view, record) {
		SmartWFM.lib.Event.fire(
			'widget.search',
			'activateFolder',
			'/' + record.get('location')
		);
	},

	search: function() {
		var searchTerm = this.getSearchTermField().getValue();

		if(!searchTerm) // abort if searchTerm is not set
			return;

		this.getSearchView().setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Loading ...')});

		SmartWFM.lib.RPC.request({
			action: 'search',
			params: {
				path: this.getBrowserView().getActiveTab().getPath(),
				options: {
					name: searchTerm
				}
			},
			successCallback: function(result) {
				this.getSearchView().getStore().loadData(result);
			},
			successScope: this,
			callback: function() {
				this.getSearchView().setLoading(false);
			},
			scope: this
		});
	},
});
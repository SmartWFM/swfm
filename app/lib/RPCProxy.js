/**
 * This provides a RPC proxy for a ExtJS store
 *
 * @author Morris Jobke
 */
Ext.define('SmartWFM.lib.RPCProxy', {
	extend: 'Ext.data.proxy.Ajax',
	requires: [
		'SmartWFM.lib.Config',
		'SmartWFM.lib.RPC'
	],


	/**
	 * The limit parameter
	 *
	 * @type String
	 */
	limitParam: false,
	/**
	 * The Start parameter
	 *
	 * @type String
	 */
	startParam: false,
	/**
	 * The sort parameter
	 *
	 * @type String
	 */
	sortParam: false,
	/**
	 * The page parameter
	 *
	 * @type String
	 */
	pageParam: false,
	/**
	 * The reader
	 *
	 * @type Object
	 */
	reader: {
		type: 'json',
		root: 'result',
		success: 'success'
	},

	// copy of parent array
	actionMethods: {
        create : 'POST',
        read   : 'POST',	// modified: GET -> POST
        update : 'POST',
        destroy: 'POST'
	},

	/*
	 * Constructor
	 *
	 * @protected
	 */
	constructor: function(config) {
		this.url = SmartWFM.lib.Config.get('commandUrl');
		config = config || {};
		this.callParent([config]);
	},

	// copy of parent function
	doRequest: function(operation, callback, scope) {
		var writer  = this.getWriter(),
			request = this.buildRequest(operation);

		if (operation.allowWrite()) {
			request = writer.write(request);
		}

		Ext.apply(request, {
			binary        : this.binary,
			headers       : this.headers,
			timeout       : this.timeout,
			scope         : this,
			callback      : this.createRequestCallback(request, operation, callback, scope),
			method        : this.getMethod(request),
			disableCaching: false // explicitly set it to false, ServerProxy handles caching
		});

		//Ext.Ajax.request(request);
		SmartWFM.lib.RPC.request(request, true);

		return request;
	}
});
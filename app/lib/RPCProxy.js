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
		// added ->
		this.generateExtraParams(this, operation);
		// <- added

		var writer  = this.getWriter(),
			request = this.buildRequest(operation, callback, scope);

		if (operation.allowWrite()) {
			request = writer.write(request);
		}

		Ext.apply(request, {
			headers       : this.headers,
			timeout       : this.timeout,
			scope         : this,
			callback      : this.createRequestCallback(request, operation, callback, scope),
			method        : 'POST',			// modified
			disableCaching: false // explicitly set it to false, ServerProxy handles caching
		});

		//Ext.Ajax.request(request);
		SmartWFM.lib.RPC.request(request, true);

		return request;
	},

	/**
	 * need to be specified to pass parameter to the request
	 *
	 * @param {Object} me "this" variable
	 * @param {Object} operation currently performed operation
	 *
	 * @since 0.10
	 */
	generateExtraParams: function(me, operation) {
		// do something
	}
});
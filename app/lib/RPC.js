/**
 * This handles the encoding, decoding of RPC data and provides a RPC request handler with error handling.
 *
 * @author Morris Jobke
 * @since 0.10
 */
Ext.define('SmartWFM.lib.RPC', {
	singleton: true,
	requires: ['SmartWFM.lib.Config'],

	/**
	 * Decode the response data from an JSON-RPC call
	 *
	 * @param {String} encodedData The response data from an ajax request
	 *
	 * @return {Object} The response object
	 *
	 *
	 * @since 0.10
	 */
	decode: function(encodedData) {
		console.groupCollapsed('SmartWFM.lib.RPC.decode()');
		console.debug('Arguments: ', arguments);

		var data = Ext.JSON.decode(encodedData);
		if (data['jsonrpc'] !== undefined) {
			if (data['result'] !== undefined) {
				console.groupEnd();

				return {
					success: true,
					result: data['result'],
					error: undefined
				};
			} else {
				var errorCode;
				var errorMessage = 'Internal error: Wrong response from backend.';
				var errorData;
				if (data['error'] !== undefined) {
					if (data['error']['code'] !== undefined) {
						errorCode = data['error']['code'];
					}
					if (data['error']['message'] !== undefined) {
						errorMessage = data['error']['message'];
					}
					if (data['error']['data'] !== undefined) {
						errorData = data['error']['data'];
					}
				}
				var ret = {
					success: false,
					result: undefined,
					error: {
						code: errorCode,
						message: errorMessage,
						data: errorData
					}
				};
				console.groupEnd();

				return ret;
			}
		}

		console.groupEnd();
		//TODO:
		return {
			success: false,
			result: undefined,
			error: {
				code: -1,
				message: 'internal error',
				data: undefined
			}
		};
	},

	/**
	 * Encode the data for a JSON-RPC call
	 *
	 * @param {String} method The name of the method to call
	 * @param {Mixed} params The params for the function call
	 *
	 * @return {Object} Data for a JSON-RPC call
	 *
	 * @since 0.10
	*/
	encode: function(method, params) {
		console.groupCollapsed('SmartWFM.lib.RPC.encode()');
		console.debug('Arguments: ', arguments);
		var data = Ext.JSON.encode({
			jsonrpc: '2.0',
			method: method,
			params: params
		});

		console.groupEnd();

		return data;
	},

	/**
	 * Perform a RPC-Request. Use this function instead of Ext.Ajax.request(), because it helps to handle errors easier.
	 *
	 * @param {Array} options The options
	 *					action 		backend method name
	 *					params		parameter for this backend method
	 *					[successCallback]
	 *					[successScope]
	 *					[errorCallback]
	 *					[errorScope]
	 *					[callback]
	 *					[scope]
	 * @param {Boolean} [merge] If true options are directly merged into config and
	 *		only RPC-callback are merged and the callback getting default arguments (framework conform) - i.e. used in file proxy
	 * 		Default 'false'
	 *
	 * @since 0.10
	 */
	request: function (options, merge, async) {
		console.groupCollapsed('SmartWFM.lib.RPC.request()');
		console.debug('Arguments: ', arguments);

		merge = merge || false;
		if(async === undefined)
			async = true;

		if(merge) {
			// used for file proxy
			var oldCallback = options['callback'];
			var oldScope = options['scope'];
			var oldErrorCallback = options['errorcallback'];
			var oldErrorScope = options['errorscope'];
			var config = options;
			config['callback'] = this.callbackRequest;
			config['scope'] = {
				options: {
					callback: oldCallback,
					scope: oldScope,
					errorcallback: oldErrorCallback,
					errorscope: oldErrorScope,
					specialCallback: true
				}
			}
		} else {
			var config = {
				url:		SmartWFM.lib.Config.get('commandUrl'),
				params:		{
								data: SmartWFM.lib.RPC.encode(options['action'], options['params'])
							},
				callback:	this.callbackRequest,
				scope:		{
								options: options
							},
				async: 		async
			};
		}

		console.groupEnd();
		Ext.Ajax.request(config);
	},



	/**
	 * This is the default callback function for the RPC-Request. <b>Don't use this function directly.</b>
	 *
	 * @param {Object} callbackOptions
	 * @param {Boolean} success
	 * @param {Object} response
	 *
	 * @protected
	 * @since 0.10
	 */
	 callbackRequest: function(callbackOptions, success, response) {
		console.groupCollapsed('SmartWFM.lib.RPC.callbackRequest()');
		console.debug('Arguments: ', arguments);

		// decode responseText
		var result = SmartWFM.lib.RPC.decode(response.responseText || '');

		if(result['success'] === false) {
			// an error occured
			var errorMsg = 'An error occured';
			console.groupEnd();
			var callback = function() {
				Ext.callback(
					this.options['errorCallback'] || Ext.emptyFn,
					this.options['errorScope'] || Ext.global,
					[result['error']]
				);
			}
			Ext.Msg.show({
				title: SmartWFM.lib.I18n.get('swfm.error', errorMsg),
				msg: SmartWFM.lib.I18n.get('swfm.error', result['error']['message'] || errorMsg),
				fn: callback,
				scope: this,
				icon: Ext.Msg.WARNING,
				buttons: Ext.Msg.OK,
				closable: false
			});
		} else {
			// success
			console.groupEnd();
			Ext.callback(
				this.options['successCallback'] || Ext.emptyFn,
				this.options['successScope'] || Ext.global,
				[result['result']]
			);
		}
		if(this['options']['specialCallback']) {
			arguments[2]['parsedResult'] = result;
			// general callback
			Ext.callback(
				this.options['callback'] || Ext.emptyFn,
				this.options['scope'] || Ext.global,
				arguments
			);
		} else {
			// general callback
			Ext.callback(
				this.options['callback'] || Ext.emptyFn,
				this.options['scope'] || Ext.global,
				[result]
			);
		}
	 }
});
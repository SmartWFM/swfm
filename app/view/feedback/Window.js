/**
 * Window to show feedback form
 */
Ext.define('SmartWFM.view.feedback.Window', {
	extend: 'Ext.window.Window',
	alias: 'widget.feedbackWindow',
	requires: [
		'SmartWFM.lib.I18n'
	],
	title: SmartWFM.lib.I18n.get('plugin.feedback', 'Feedback'),
	layout: 'fit',
	width: 400,
	maximizable: true,
	border: false,
	plain: true,
	autoScroll: true,
	constrain: true,

	initComponent: function() {
		// see comment in ExtJS 4.1 doc for Ext.getBody()
		this.height 	= Ext.getBody().getHeight() / 1.2;
		this.callParent(arguments);
	},

	items: {
		xtype: 'form',
		border: false,
		bodyStyle: {'background-color': 'transparent'}, // only way not to have a white background
		items: [{
			xtype: 'textfield',
			name: 'subject',
			fieldLabel: SmartWFM.lib.I18n.get('plugin.feedback', 'Subject'),
			labelAlign: 'top',
			anchor: '100%',
			allowBlank: false
		},{
			xtype: 'textarea',
			name: 'text',
			fieldLabel: SmartWFM.lib.I18n.get('plugin.feedback', 'Text'),
			labelAlign: 'top',
			anchor: '100%',
			allowBlank: false,
			grow: true,
			resizeable: true,
			autoScroll: true
		}]
	},

	listeners: {
		resize: function(p, width, height) {
			this.down('textarea').setHeight(height-112);
		}
	},

	buttons: [{
		text: SmartWFM.lib.I18n.get('plugin.feedback', 'Send feedback'),
		handler: function() {
			var win = this.up('window');
			var form = win.down('form').getForm();
			if(form.isValid()) {
				var values = form.getValues();
				SmartWFM.lib.RPC.request({
					action: 'feedback.send',
					params: {
						text: values['text'],
						subject: values['subject']
					},
					successCallback: function() {
						win.close();
						Ext.Msg.show({
							title: SmartWFM.lib.I18n.get('plugin.feedback', 'Feedback'),
							msg: SmartWFM.lib.I18n.get('plugin.feedback', 'Thank you for your feedback.'),
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.INFO
						});
					}
				});
			}
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
		handler: function(){
			this.up('window').close();
		}
	}]
});

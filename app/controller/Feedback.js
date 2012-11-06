/**
 * This is a feedback plugin. It adds a button to open a feedback dialog.
 */
Ext.define('SmartWFM.controller.Feedback', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.I18n',
		'SmartWFM.view.feedback.Window'
	],

	init: function() {
		this.registerComponents();
	},

	registerComponents: function() {
		var feedbackButton = Ext.create(Ext.button.Button, {
			text: '<b>' + SmartWFM.lib.I18n.get('plugin.feedback', 'Feedback') + '</b>',
			handler: function () {
				Ext.create('SmartWFM.view.feedback.Window').show();
			}
		});
		SmartWFM.lib.Component.register('statusbar', 'feedback', feedbackButton);
	}
});
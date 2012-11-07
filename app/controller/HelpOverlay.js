/**
 * This is a help overlay plugin. It adds a button to open the help overlay.
 */
Ext.define('SmartWFM.controller.HelpOverlay', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.I18n',
		//'SmartWFM.view.helpoverlay.Window'
	],

	init: function() {
		this.registerComponents();
	},

	registerComponents: function() {
		var feedbackButton = Ext.create(Ext.button.Button, {
			text: '<b>' + SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Help') + '</b>',
			handler: function () {
				var helpOverlay = Ext.DomHelper.append(Ext.getBody(), {
					tag: 'div',
					id: 'help-overlay'
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-search',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Search')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-bookmarks',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Bookmarks')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-quota',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Quota')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-feedback',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Send feedback')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-tree',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Directory structure')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-menu',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Menu')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-history',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Browse trough your history')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-path',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Current location')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-rightclick',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Try a right click')
				});

				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-filter',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Filter your current view')
				});
				Ext.DomHelper.append(helpOverlay, {
					tag: 'div',
					id: 'help-close-btn',
					cls: 'close-btn',
					html: 'x'
				});
				Ext.select('#help-close-btn').on("click", function(){Ext.select('#help-overlay').remove();});
			}
		});
		SmartWFM.lib.Component.register('statusbar', 'helpoverlay', feedbackButton);
	}
});
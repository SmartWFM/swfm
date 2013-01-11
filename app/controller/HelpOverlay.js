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

				Ext.DomHelper.append(Ext.getBody(), {
					tag: 'img',
					id: 'help-rightclick-image',
					src: 'resources/help-overlay/rightclick.png'
				});

				Ext.DomHelper.append(helpOverlay, [{
					tag: 'div',
					id: 'help-search',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Search & Bookmarks')
				},{
					tag: 'img',
					id: 'help-search-arrow',
					src: 'resources/help-overlay/left.png'
				},{
					tag: 'div',
					id: 'help-quota',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Quota')
				},{
					tag: 'div',
					id: 'help-feedback',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Send feedback')
				},{
					tag: 'img',
					id: 'help-feedback-arrow',
					src: 'resources/help-overlay/left2.png'
				},{
					tag: 'div',
					id: 'help-menu',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Menu')
				},{
					tag: 'img',
					id: 'help-menu-arrow',
					src: 'resources/help-overlay/leftup.png'
				},{
					tag: 'div',
					id: 'help-history',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Browse through history')
				},{
					tag: 'img',
					id: 'help-history-arrow',
					src: 'resources/help-overlay/up.png'
				},{
					tag: 'div',
					id: 'help-rightclick',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Try a right click')
				},{
					tag: 'img',
					id: 'help-rightclick-arrow',
					src: 'resources/help-overlay/down.png'
				},{
					tag: 'div',
					id: 'help-filter',
					cls: 'text',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Filter current view')
				},{
					tag: 'img',
					id: 'help-filter-arrow',
					src: 'resources/help-overlay/upright.png'
				},{
					tag: 'div',
					id: 'help-close-btn',
					cls: 'close-btn',
					html: SmartWFM.lib.I18n.get('plugin.helpoverlay', 'Close help')
				}]);
				Ext.select('#help-close-btn').on('click', function(){
					Ext.select('#help-overlay').remove();
					Ext.select('#help-rightclick-image').remove();
				});

				Ext.getBody().on('keydown', function(e){
					if(e.keyCode == e.ESC) {
						Ext.select('#help-overlay').remove();
						Ext.select('#help-rightclick-image').remove();
					}
				});
			}
		});
		SmartWFM.lib.Component.register('statusbar', 'helpoverlay', feedbackButton);
	}
});
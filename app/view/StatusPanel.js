Ext.define('SmartWFM.view.StatusPanel', {
	extend: 'Ext.panel.Panel',

	alias: 'widget.statusPanel',

	requires: [
		'SmartWFM.lib.Component',
		'SmartWFM.lib.Config',
		'SmartWFM.lib.I18n',
		// 'SmartWFM.lib.Menu'
	],

	border: false,
	bodyBorder: false,

	/**
	 * loading status config and create all components
	 */
	initComponent: function() {
		// don't repeat yourself - so have a little function
		var getComponents = function (cmpNames) {
			var cmps = [];
			for (var i = 0; i < cmpNames.length; i++) {
				if (cmpNames[i] === ' ' || cmpNames[i] === '-')
					cmps.push(cmpNames[i]);
				else
					cmps.push(SmartWFM.lib.Component.get('statusbar', cmpNames[i]));
			}
			return cmps;
		};

		// left side
		var items = getComponents(SmartWFM.lib.Config.get('statusbar.left', []));
		// fill
		items.push('->');
		// right side
		items = items.concat(getComponents(SmartWFM.lib.Config.get('statusbar.right', [])));
		// Version
		items.push(
			SmartWFM.lib.I18n.get('swfm', 'Powered by') +
			' <a href="http://swfm.sf.net/">SmartWFM</a> v' +
			SmartWFMMajorVersion + '.' + SmartWFMMinorVersion + ' (build: ' + SmartWFMBuildDate + ')'
		);
		this.bbar = items;
		this.callParent();
	}
});

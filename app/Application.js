/**
SmartWFM is a web based file manager. It is highly extensible by plugins and widgets. There is also a exchangeable backend.<br/>
<br/>
<b>License:</b> GPLv3<br/>
<b>URL:</b> <a href="https://github.com/SmartWFM/swfm">https://github.com/SmartWFM/swfm</a>
*/

// enabling Ext.Loader to dynamically loading needed classes
Ext.Loader.setConfig({enabled:true});

// Version
SmartWFMMajorVersion = 1;
SmartWFMMinorVersion = 1;

/**
 * @class SmartWFM
 * The one and only SmartWFM-Application.
 * @singleton
 */
Ext.application({
	name: 'SmartWFM',
	autoCreateViewport: true,
	requires: [
		'SmartWFM.lib.Config',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.RPCProxy'
	],

	controllers: [
		'General',
		'Browser' // controllers to load added behind this line
		,'TreeMenu'
		,'Settings'
		,'BaseActions'
		,'SubMenus'
		,'ImageViewer'
		,'FileInfo'
		,'Feedback'
		,'SourceCodeViewer'
		,'Archives'
		,'Bookmarks'
		,'Search'
		,'HelpOverlay'
		,'AFSActions' /* AFS only */
		,'NewFile'
	],

	launch: function() {
		// global access to application
		SmartWFM.app = this;
		SmartWFM.lib.Setting.load();
		var conf = {remove: true, duration: 1500};
		// fade out loading mask
		Ext.get('loading').fadeOut(conf);
		Ext.get('loading-mask').fadeOut(conf);
		// initial tab
		var hash = window.location.hash;
		if(hash !== "") {
			paths = hash.substring(1).split(';')
			var active = true // activate the first tab
			for(i in paths) {
				var path = paths[i].replace(/%3B/gi, ';'); // replace encoded ";"
				path = path.replace(/%25/gi, '%'); // replace encoded "%"
				this.getController('Browser').addTab(path, active);
				active = false;
			}
		} else {
			this.getController('Browser')
			    .addTab(SmartWFM.lib.Config.get('homePath'), true);
		}

	}
});

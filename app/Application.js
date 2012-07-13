/**
SmartWFM is a web based file manager. It is highly extensible by plugins and widgets. There is also a exchangeable backend.<br/>
<br/>
<b>License:</b> GPLv3<br/>
<b>URL:</b> <a href="https://github.com/SmartWFM/swfm">https://github.com/SmartWFM/swfm</a>
*/

// enabling Ext.Loader to dynamically loading needed classes
Ext.Loader.setConfig({enabled:true});

// Version
SmartWFMMajorVersion = 0;
SmartWFMMinorVersion = 10;
SmartWFMBuildDate = '2012-07-13';

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
		,'AFSActions'
	],

	launch: function() {
		SmartWFM.lib.Setting.load();
		var conf = {remove: true, duration: 1500};
		// fade out loading mask
		Ext.get('loading').fadeOut(conf);
		Ext.get('loading-mask').fadeOut(conf);
		// global access to application
		SmartWFM.app = this;
		// initial tab
		this.getController('Browser').addTab('/');
		this.getController('Browser').addTab(); // this tab exists after launch

		// workaround - fix loading issue if only one initial tab - todo
		var view = this.getController('Browser').getBrowserView();
		view.setActiveTab(0);
		view.getActiveTab().close();
		// workaround end

		// workaroung for initial tree menu selection - todo
		var path = view.getActiveTab().getPath();
		this.getController('TreeMenu').onActivateFolder(path);
		// workaround end

	}
});

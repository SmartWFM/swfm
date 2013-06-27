/**
 * This class handles all our config stuff. Use it to get values for the different config options.
 *
 * @author Morris Jobke
 * @since 0.10
*/
Ext.define('SmartWFM.lib.Config', {
	singleton: true,

	/**
	 * Key-value pair list with all config options
	 *
	 * @protected
	 * @type Object
	 * @since 0.10
	 */
	config: {
		'commandUrl':						'../backend-php/index.php',
		'baseUrl':							'',
		'homePath': 						'/',
		'theme':							'default',
		'setting.save.enable':				true,
		'setting.load.enable':				true,
		'i18n.useBrowserLang':				true,
		'sidePanel.items':					[
												'SmartWFM.view.treeMenu.TreeMenu',
												'SmartWFM.view.search.View',
												'SmartWFM.view.bookmarks.View'
											],
		'widget.browser.menu.context':		[
												'afs.setACL', /* AFS only */
												'base.newFolder',
												'createNew',
												'|',
												'base.paste'
											],
		'widget.browser.menu.itemContext':	[
												'openWith',
												'|',
												'base.download',
												'fileInfo',
												'afs.setACL', /* AFS only */
												'archives.create',
												'|',
												'base.rename',
												'base.copy',
												'base.move',
												'|',
												'base.delete'
											],
		'menuPanel.menus':					[
												{ name: 'File',		config: 'menu.main.file' },
												{ name: 'Edit',		config: 'menu.main.edit' },
												{ name: 'View',		config: 'menu.main.view' },
												{ name: 'Tools',	config: 'menu.main.tools' },
												{ name: 'Extras',	config: 'menu.main.extras' }
											],
		'menu.main.file':					[
												'newtab',
												'base.newFolder',
												'createNew'
											],
		'menu.main.edit':					[],
		'menu.main.view':					[
												'iconview',
												'listview'
											],
		'menu.main.tools':					[
												'afs.manageGroups' /* AFS only */
											],
		'menu.main.extras':					[
												'setting.edit'
											],
		'lang':								'en',
		'widget.browser.defaultView': 		1,
		'widget.treeMenu.rootNodeName': 	'root node',
		'widget.treeMenu.excludeFolder': 	'',
		'widget.treeMenu.context': 			[],
		'plugin.subMenus.createNew': 		[], // automatically extented by 'new file' controller
		'plugin.subMenus.openWith': 		[
												'imageViewer',
												'sourceCodeViewer',
												'ckeditorViewer',
												'archives.viewer'
											],
		'statusbar.left': 					[],
		'statusbar.right': 					[
												'helpoverlay',
												'feedback'
											],
		'widget.treeMenu.menu.context': 	[
												'treemenu.newTab',
												'treemenu.refresh'
											]
	},

	/**
	 * Get the value for the given config option
	 *
	 * @param {String} id The name of the config option
	 * @param {Mixed} defaultValue The value to use if no value for the config option is set.
	 *
	 * @return {Mixed} The value of the config option OR the defaultValue if the config option doesn't exist.
	 *
	 * @since 0.10
	 */
	get: function (id, defaultValue) {
		if (this.config[id] === undefined) {
			console.warn('[SmartWFM.lib.Config] config not found', id);
			return defaultValue;
		} else {
			return this.config[id];
		}
	},

	/**
	 * Loads dynamically config from app/config/Config.json
	 *
	 * @protected
	 * @since 0.10
	 */
	constructor: function() {
		var me = this;

		Ext.Ajax.request({
			async: false,
			url: 'app/config/Config.json.php',
			success: function(response) {
				var obj = Ext.JSON.decode(response.responseText);
				for(var key in obj) {
					if(obj.hasOwnProperty(key)) {
						me.config[key] = obj[key];
					}
				}
			},
			failure: function(response) {
				console.warn('[SmartWFM.lib.Config] config couldn\'t be loaded');
			}
		});
		return me;
	},

	/**
	 * Appends config option of type array with recieved option
	 *
	 * @param {String} id The name of the config option
	 * @param {Mixed} value The value to append
	 *
	 * @protected
	 * @since 1.0
	 */
	append: function(id, value) {
		var me = this,
		    current = me.config[id] || [];

		current.push(value);

		me.config[id] = current;
	}
});
/**
 * This plugin uses the backend to highlight source code.
 */
Ext.define('SmartWFM.controller.SourceCodeViewer', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.util.KeyNav',
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.Mimetype',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.lib.Resource',
		'SmartWFM.view.sourceCodeViewer.Window'
	],

	refs: [{
		ref: 'sourceCodeViewerTextArea',
		selector: 'sourceCodeViewer > codemirror'
	},{
		ref: 'browserView',
		selector: 'viewport > browser'
	}],

	init: function() {
		this.registerMenuItems();
		this.control({
			'sourceCodeViewer button[action=previous]': {
				click: this.previous
			},
			'sourceCodeViewer button[action=next]': {
				click: this.next
			}
		});
		SmartWFM.lib.Resource.loadJS('codemirror-2.38/lib/codemirror.js');
		SmartWFM.lib.Resource.loadCSS('codemirror-2.38/lib/codemirror.css');
	},

	registerMenuItems: function() {
		var sourceCodeViewer = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Source Code Viewer'),
			icon: SmartWFM.lib.Icon.get('sourcecodeviewer.brackets', 'action', '32x32'),
			disabled: true,
			initComponent: function() {
				this.callParent();

				var files = this.context.files;
				var file;
				var regex = new RegExp("(text/.*)|(application/(x(-empty|ml|-httpd-php|-shellscript))|javascript)");
				var sourceCodeFiles = [];
				var viewSourceCodeEntry = false;

				for(var i in files) {
					file = files[i];
					if(file.mimeType && file.mimeType.match(regex)) {
						viewSourceCodeEntry = true;
						break;
					}
				}

				var controller = SmartWFM.app.getController('SourceCodeViewer');

				if(viewSourceCodeEntry) {
					controller
						.getBrowserView()
						.getActiveTab()
						.down('dataview, gridpanel')
						.getStore()
						.each(function(element){
							var file = element.getData();
							if(file.mimeType && file.mimeType.match(regex))
								sourceCodeFiles.push(file);
						});
				}

				if(sourceCodeFiles.length)
					this.setDisabled(false);

				function indexOfObject(array, attribute, value) {
					for(var i = 0; i < array.length; i += 1) {
						if(array[i][attribute] === value) {
							return i;
						}
					}
				}

				var  index = 0;
				if(file)
					index = indexOfObject(sourceCodeFiles, 'name', file.name);

				controller.sourceCodeFiles = sourceCodeFiles;
				controller.fileIndex = index ? index : 0;
			},
			handler: function () {
				var window = Ext.create('SmartWFM.view.sourceCodeViewer.Window');
				window.show();
				var controller = SmartWFM.app.getController('SourceCodeViewer');
				if(controller.sourceCodeFiles.length == 1) {
					var previousButton = window.query('button[action=previous]')[0];
					var nextButton = window.query('button[action=next]')[0];
					previousButton.destroy();
					nextButton.destroy();
				} else {
					Ext.create('Ext.util.KeyNav', {
						target: window.getEl(),
						left: controller.previous,
						right: controller.next,
						pageUp: controller.previous,
						pageDown: controller.next,
						scope: controller
					});
				}
				controller.load();
			}
		});
		SmartWFM.lib.Menu.add('sourceCodeViewer', sourceCodeViewer);
	},

	previous: function() {
		this.fileIndex--;
		if(this.fileIndex < 0)
			this.fileIndex = this.sourceCodeFiles.length - 1;
		this.load();
	},

	next: function() {
		this.fileIndex++;
		if(this.fileIndex >= this.sourceCodeFiles.length)
			this.fileIndex = 0;
		this.load();
	},

	load: function() {
		var scViewerTextArea = this.getSourceCodeViewerTextArea();
		var fileMetadata = this.sourceCodeFiles[this.fileIndex];
		var url = SmartWFM.lib.Url.encode(
			SmartWFM.lib.Config.get('commandUrl'),
			{
				command: 'download',
				path: fileMetadata['path'],
				name: fileMetadata['name']
			}
		);
		Ext.Ajax.request({
			url: url,
			success: function(response){
				scViewerTextArea.setValue(response.responseText);
				scViewerTextArea.setMode(SmartWFM.lib.Mimetype.normalize(this.sourceCodeFiles[this.fileIndex].mimeType));
			},
			scope: this
		});
		//scViewerIFrame.setSrc(url);
		scViewerTextArea.up('window').setTitle(SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Source Code Viewer') + ' - ' + fileMetadata['name']);
	}
});
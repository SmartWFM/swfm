/**
 * This plugin uses the backend to highlight source code.
 */
Ext.define('SmartWFM.controller.SourceCodeViewer', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.view.sourceCodeViewer.Window'
	],

	refs: [{
		ref: 'sourceCodeViewerIFrame',
		selector: 'sourceCodeViewer > simpleiframe'
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
	},

	registerMenuItems: function() {
		var sourceCodeViewer = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Source Code Viewer'),
			icon: SmartWFM.lib.Icon.get('sourcecodeviewer.brackets', 'action', '32x32'),
			disabled: true,
			initComponent: function() {
				this.callParent();

				var files = this.context.files;
				var regex = new RegExp("(text/.*)|(application/x(-empty|ml|-httpd-php|-shellscript))");
				var sourceCodeFiles = [];

				for(var i in files) {
					var file = files[i];
					if(file.mimeType && file.mimeType.match(regex))
						sourceCodeFiles.push(file);
				}
				if(sourceCodeFiles.length)
					this.setDisabled(false);

				var controller = SmartWFM.app.getController('SourceCodeViewer');
				controller.sourceCodeFiles = sourceCodeFiles;
				controller.fileIndex = 0;
			},
			handler: function () {
				Ext.create('SmartWFM.view.sourceCodeViewer.Window').show();
				var controller = SmartWFM.app.getController('SourceCodeViewer');
				controller.initButtons();
				controller.load();
			}
		});
		SmartWFM.lib.Menu.add('sourceCodeViewer', sourceCodeViewer);
	},

	initButtons: function() {
		if(this.sourceCodeFiles.length == 1) {
			var viewer = Ext.ComponentQuery.query('sourceCodeViewer')[0];
			var previousButton = viewer.query('button[action=previous]')[0];
			var nextButton = viewer.query('button[action=next]')[0];
			previousButton.destroy();
			nextButton.destroy();
		}
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
		var scViewerIFrame = this.getSourceCodeViewerIFrame();
		var fileMetadata = this.sourceCodeFiles[this.fileIndex];
		var url = SmartWFM.lib.Url.encode(
			SmartWFM.lib.Config.get('commandUrl'),
			{
				command: 'source_highlight',
				path: fileMetadata['path'],
				name: fileMetadata['name']
			}
		);
		scViewerIFrame.setSrc(url);
		scViewerIFrame.up('window').setTitle(SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Source Code Viewer') + ' - ' + fileMetadata['name']);
	}
});
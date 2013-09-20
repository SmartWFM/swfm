/**
 * This is a plugin for the CKEditor. It adds a menu item to open a file in CKEditor
 */
Ext.define('SmartWFM.controller.CKEditor', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.I18n',
		'SmartWFM.view.feedback.Window'
	],

	refs: [{
		ref: 'ckeditorForm',
		selector: 'ckeditorViewer > form'
	},{
		ref: 'ckeditorField',
		selector: 'ckeditorViewer > form > ckeditorField'
	},{
		ref: 'browserView',
		selector: 'viewport > browser'
	}],

	fileRegexString: "text/.*",

	init: function() {
		this.registerMenuItems();
		this.control({
			'ckeditorViewer button[action=save]': {
				click: this.save
			},
			'ckeditorViewer': {
				beforeclose: this.beforeclose
			}
		});
		SmartWFM.lib.Resource.loadJS('ckeditor/ckeditor.js');
	},

	registerMenuItems: function() {
		var ckeditorViewer = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.ckeditor', 'CKEditor'),
			icon: SmartWFM.lib.Icon.get('sourcecodeviewer.brackets', 'action', '32x32'),
			disabled: true,
			initComponent: function() {
				this.callParent();

				var controller = SmartWFM.app.getController('CKEditor');

				var files = this.context.files;
				var file;
				var regex = new RegExp(controller.fileRegexString);
				var ckeditorFiles = [];
				var viewCkeditorEntry = false;

				for(var i in files) {
					file = files[i];
					if(file.mimeType && file.mimeType.match(regex)) {
						viewCkeditorEntry = true;
						break;
					}
				}

				if(viewCkeditorEntry) {
					controller
						.getBrowserView()
						.getActiveTab()
						.down('dataview, gridpanel')
						.getStore()
						.each(function(element){
							var file = element.getData();
							if(file.mimeType && file.mimeType.match(regex))
								ckeditorFiles.push(file);
						});
				}

				if(ckeditorFiles.length)
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
					index = indexOfObject(ckeditorFiles, 'name', file.name);

				controller.files = ckeditorFiles;
				controller.fileIndex = index ? index : 0;
			},
			handler: function () {
				var window = Ext.create('SmartWFM.view.ckeditor.Window');
				window.show();
				var controller = SmartWFM.app.getController('CKEditor');
				controller.load();
			}
		});
		SmartWFM.lib.Menu.add('ckeditorViewer', ckeditorViewer);
	},

	unsavedChangesMessage: function(callback, scope) {
		Ext.Msg.show({
			title: SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'Unsaved Changes'),
			msg: SmartWFM.lib.I18n.get('plugin.sourceCodeViewer', 'There are unsaved changes. Continue anyway?'),
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.WARNING,
			fn: function(btn) {
				if(btn === 'yes') {
					callback.apply(scope);
				}
			}
		});
	},

	beforeclose: function() {
		var close = function() {
			var form = this.getCkeditorField();
			form.resetModifiedState();
			form.up('window').close();
		}
		if(this.getCkeditorField().getModifiedState()){
			this.unsavedChangesMessage(close, this);
			return false;
		}
	},

	save: function() {
		var ckeditorForm = this.getCkeditorForm();
		var ckeditorField = this.getCkeditorField();
		ckeditorForm.up('window').setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Save ...')});
		var fileMetadata = this.files[this.fileIndex];
		SmartWFM.lib.RPC.request({
			action: 		'new_file.save',
			params: {
				path: 		fileMetadata['path'],
				name: 		fileMetadata['name'],
				content: 	ckeditorField.getRawValue()
			},
			successCallback: function() {
				ckeditorForm.up('window').down('button[action=save]').disable();
				ckeditorField.resetModifiedState();
			},
			callback: function() {
				ckeditorForm.up('window').setLoading(false);
			}
		});
	},

	load: function() {
		var ckeditor = this.getCkeditorField();
		var fileMetadata = this.files[this.fileIndex];
		var url = SmartWFM.lib.Url.encode(
			SmartWFM.lib.Config.get('commandUrl'),
			{
				command: 'download',
				path: fileMetadata['path'],
				'files[]': fileMetadata['name']
			}
		);
		Ext.Ajax.request({
			url: url,
			success: function(response){
				// I have no glue why, but for the second file which is opened, we have to delay the dataloading
				var delay = function() {
					ckeditor.setValue(response.responseText);
				}
				setTimeout(delay, 200);
			},
			scope: this
		});
		ckeditor.up('window').setTitle(SmartWFM.lib.I18n.get('plugin.ckeditor', 'CKEditor') + ' - ' + fileMetadata['name']);
	},

	openFile: function(path, name, mimeType) {
		//var files = this.context.files;
		var me = this;

		var file;
		var regex = new RegExp(this.fileRegexString);
		var files = [];

		if(!mimeType.match(me.fileRegexString)) {
			return;
		}

		me
			.getBrowserView()
			.getActiveTab()
			.down('dataview, gridpanel')
			.getStore()
			.each(function(element){
				var file = element.getData();
				if(file.mimeType && file.mimeType.match(regex))
					files.push(file);
			});

		function indexOfObject(array, attribute, value) {
			for(var i = 0; i < array.length; i += 1) {
				if(array[i][attribute] === value) {
					return i;
				}
			}
		}

		var  index = 0;

		index = indexOfObject(files, 'name', name);

		me.files = files;
		me.fileIndex = index ? index : 0;

		// load and open window

		var window = Ext.create('SmartWFM.view.ckeditor.Window');
		window.show();
		me.load();
	}
});
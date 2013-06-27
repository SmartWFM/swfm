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
		selector: 'ckeditor > form'
	},{
		ref: 'ckeditorEditor',
		selector: 'ckeditor > form > ckeditorField'
	},{
		ref: 'browserView',
		selector: 'viewport > browser'
	}],

	fileRegexString: "text/.*",

	init: function() {
		this.registerMenuItems();
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
				if(controller.files.length == 1) {
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

	previous: function() {
		var previous = function() {
			this.fileIndex--;
			if(this.fileIndex < 0)
				this.fileIndex = this.files.length - 1;
			this.load();
		}
		if(this.getCkeditorEditor().getModifiedState()){
			this.unsavedChangesMessage(previous, this);
		} else {
			previous.call(this);
		}
	},

	next: function() {
		var next = function() {
			this.fileIndex++;
			if(this.fileIndex >= this.files.length)
				this.fileIndex = 0;
			this.load();
		}
		if(this.getCkeditorEditor().getModifiedState()){
			this.unsavedChangesMessage(next, this);
		} else {
			next.call(this);
		}
	},

	beforeclose: function() {
		var close = function() {
			var form = this.getCkeditorEditor();
			form.resetModifiedState();
			form.up('window').close();
		}
		if(this.getCkeditorEditor().getModifiedState()){
			this.unsavedChangesMessage(close, this);
			return false;
		}
	},

	save: function() {
		var ckeditorForm = this.getCkeditorForm();
		ckeditorForm.up('window').setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Save ...')});
		var fileMetadata = this.files[this.fileIndex];
		SmartWFM.lib.RPC.request({
			action: 		'new_file.save',
			params: {
				path: 		fileMetadata['path'],
				name: 		fileMetadata['name'],
				content: 	ckeditorForm.getForm().getValues()['content']
			},
			successCallback: function() {
				ckeditorForm.up('window').down('button[action=save]').disable();
				TODO ckeditorForm.down('ckeditor').resetModifiedState();
			},
			callback: function() {
				ckeditorForm.up('window').setLoading(false);
			}
		});
	},

	load: function() {
		var ckeditor = this.getCkeditorEditor();
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
				ckeditor.setValue(response.responseText);
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
		if(files.length == 1) {
			var previousButton = window.query('button[action=previous]')[0];
			var nextButton = window.query('button[action=next]')[0];
			previousButton.destroy();
			nextButton.destroy();
		} else {
			Ext.create('Ext.util.KeyNav', {
				target: window.getEl(),
				left: me.previous,
				right: me.next,
				pageUp: me.previous,
				pageDown: me.next,
				scope: me
			});
		}
		me.load();
	}
});
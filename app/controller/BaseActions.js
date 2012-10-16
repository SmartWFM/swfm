/**
 * Handles base actions
 */
Ext.define('SmartWFM.controller.BaseActions', {
	extend: 'Ext.app.Controller',
	requires: [
		'SmartWFM.lib.Clipboard',
		'SmartWFM.lib.Event',
		'SmartWFM.lib.I18n',
		'SmartWFM.lib.Icon',
		'SmartWFM.lib.Menu',
		'SmartWFM.lib.Path',
		'SmartWFM.lib.RPC'
	],

	views: [
		'baseActions.CopyWindow',
		'baseActions.CopyErrorWindow',
		'baseActions.DeleteErrorWindow',
		'baseActions.DeleteWindow',
		'baseActions.MoveWindow',
		'baseActions.NewFolderWindow',
		'baseActions.UploadWindow'
	],

	refs: [{
		ref: 'browserView',
		selector: 'viewport > browser'
	},{
		ref: 'renameForm',
		selector: 'rename > form'
	}],

	init: function() {
		this.registerMenuItems();
		this.control({
			'rename button[action=rename]': {
				click: this.rename
			}
		});
	},

	registerMenuItems: function() {
		// create new folder
		var newFolder = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'New folder'),
			icon: SmartWFM.lib.Icon.get('folder.new', 'action', '32x32'),
			handler: function(){
				Ext.create('SmartWFM.view.baseActions.NewFolderWindow', {
					basePath: Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().getPath()
				}).show();
			}
		});
		SmartWFM.lib.Menu.add('base.newFolder', newFolder);

		// copy
		var copy = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Copy'),
			icon: SmartWFM.lib.Icon.get('copy', 'action', '32x32'),
			handler: function(){
				var selection = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().down('dataview, gridpanel').getSelectionModel().getSelection();

				if(selection.length) {
					// called on paste menu item click
					var callbackFunction = function(items, destination) {
						var w = Ext.create('SmartWFM.view.baseActions.CopyWindow').show();
						SmartWFM.app.getController('BaseActions').copyAction(w, items, destination);
					};
					// arrange data of clipboard
					var items = [];
					for(var i in selection) {
						items.push(selection[i].data);
					}
					// push to clipboard
					SmartWFM.lib.Clipboard.put(
						'copy',
						items,
						callbackFunction
					);
				} else {
					// should never occur
					SmartWFM.app.getController('BaseActions').noFilesSelected();
				}
			}
		});
		SmartWFM.lib.Menu.add('base.copy', copy);

		// move
		var move = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Cut'),
			icon: SmartWFM.lib.Icon.get('move', 'action', '32x32'),
			handler: function(){
				var selection = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().down('dataview, gridpanel').getSelectionModel().getSelection();

				if(selection.length) {
					// called on paste menu item click
					var callbackFunction = function(items, destination) {
						var w = Ext.create('SmartWFM.view.baseActions.MoveWindow').show();
						SmartWFM.app.getController('BaseActions').moveAction(w, items, destination);
					};
					// arrange data of clipboard
					var items = [];
					for(var i in selection) {
						items.push(selection[i].data);
					}
					// push to clipboard
					SmartWFM.lib.Clipboard.put(
						'move',
						items,
						callbackFunction
					);
				} else {
					// should never occur
					SmartWFM.app.getController('BaseActions').noFilesSelected();
				}
			}
		});
		SmartWFM.lib.Menu.add('base.move', move);

		// paste
		var paste = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Paste'),
			icon: SmartWFM.lib.Icon.get('paste', 'action', '32x32'),
			disabled: true,
			initComponent: function() {
				this.callParent();

				var content = SmartWFM.lib.Clipboard.get();

				// show only if clipboard isn't empty and contains supported command
				if(content != undefined && Ext.Array.contains(Array('move', 'copy'), content['command']))
					this.setDisabled(false);
			},
			handler: function(){
				// getting content from clipboard
				var content = SmartWFM.lib.Clipboard.get();

				if(content != undefined) {
					var supportedCommands = Array('move', 'copy');
					if(Ext.Array.contains(supportedCommands, content['command'])) {
						// remove from clipboard
						SmartWFM.lib.Clipboard.pop();
						var path = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().getPath();
						Ext.callback(
							content['callback'], 		// function
							undefined, 					// scope
							[content['data'], path]		// arguments
						);
					}
				}
			}
		});
		SmartWFM.lib.Menu.add('base.paste', paste);

		// delete
		var del = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Delete'),
			icon: SmartWFM.lib.Icon.get('delete', 'action', '32x32'),
			handler: function(){
				var selection = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().down('dataview, gridpanel').getSelectionModel().getSelection();

				if(selection.length) {
					Ext.Msg.show({
						title: SmartWFM.lib.I18n.get('plugin.baseActions', 'Delete files?'),
						msg: SmartWFM.lib.I18n.get('plugin.baseActions', 'Remove all selected files?'),
						buttons: Ext.Msg.YESNO,
						icon: Ext.Msg.WARNING,
						fn: function(btn) {
							if(btn === 'yes') {
								var items = [];
								for(var i in selection) {
									items.push(selection[i].data);
								}
								var w = Ext.create('SmartWFM.view.baseActions.DeleteWindow').show();
								SmartWFM.app.getController('BaseActions').deleteAction(w, items);
							}
						}
					});
				} else {
					// should never occur
					SmartWFM.app.getController('BaseActions').noFilesSelected();
				}
			}
		});
		SmartWFM.lib.Menu.add('base.delete', del);

		// download
		var download = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Download'),
			icon: SmartWFM.lib.Icon.get('file.download', 'action', '32x32'),
			handler: function(){
				var selection = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().down('dataview, gridpanel').getSelectionModel().getSelection();

				if(selection.length == 1) {
					window.open(
						SmartWFM.lib.Url.encode(
							SmartWFM.lib.Config.get('commandUrl'),
							{
								'command': 'download',
								'path': selection[0].data['path'],
								'name': selection[0].data['name']
							}
						)
					);
				} else if (selection.length > 1) {
					SmartWFM.app.getController('BaseActions').downloadMultipleFiles();
				} else {
					// should never occur
					SmartWFM.app.getController('BaseActions').noFilesSelected();
				}
			}
		});
		SmartWFM.lib.Menu.add('base.download', download);

		// upload
		var upload = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Upload'),
			icon: SmartWFM.lib.Icon.get('file.upload', 'action', '32x32'),
			handler: function(){
				var win = Ext.create('SmartWFM.view.baseActions.UploadWindow');
				win.down('hiddenfield[name=path]').setValue(Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().path);
				win.show();
			}
		});
		SmartWFM.lib.Menu.add('base.upload', upload);

		// rename
		var rename = Ext.extend(Ext.menu.Item, {
			text: SmartWFM.lib.I18n.get('plugin.baseActions', 'Rename'),
			icon: SmartWFM.lib.Icon.get('rename', 'action', '32x32'),
			disabled: true,
			initComponent: function() {
				this.callParent();

				var selection = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().down('dataview, gridpanel').getSelectionModel().getSelection();
				// show if only one item is selected
				if(selection.length == 1)
					this.setDisabled(false);
			},
			handler: function(){
				var selection = Ext.ComponentQuery.query('viewport > browser')[0].getActiveTab().down('dataview, gridpanel').getSelectionModel().getSelection();
				var win = Ext.create('SmartWFM.view.baseActions.RenameWindow');
				var name = selection[0].get('name');
				var path = selection[0].get('path');
				win.down('form').getForm().setValues({
					name: name,
					path: path,
					oldName: name
				});
				win.show();
			}
		});
		SmartWFM.lib.Menu.add('base.rename', rename);
	},

	noFilesSelected: function() {
		var msg = SmartWFM.lib.I18n.get('plugin.baseActions.error', 'No files selected.');
		Ext.Msg.show({
			title: msg,
			msg: msg,
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.INFO
		});
	},

	downloadMultipleFiles: function() {
		Ext.Msg.show({
			title: SmartWFM.lib.I18n.get('plugin.baseActions', 'Download'),
			msg: SmartWFM.lib.I18n.get('plugin.baseActions.error', 'Directories and multiple files couldn\'t be downloaded, archive it first and then download this file.'),
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.INFO
		});
	},

	rename: function(button) {
		var browserView = this.getBrowserView();
		browserView.setLoading({msg: SmartWFM.lib.I18n.get('swfm', 'Loading ...')});
		var values = this.getRenameForm().getForm().getValues();

		if(values['name'] == values['oldName']) {
			Ext.Msg.show({
				title: SmartWFM.lib.I18n.get('plugin.baseActions', 'Rename'),
				msg: SmartWFM.lib.I18n.get('plugin.baseActions.error', 'The filename has not changed.'),
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.INFO
			});
			browserView.setLoading(false);
			return;
		}

		SmartWFM.lib.RPC.request({
			action: 'file.rename',
			params: {
				path: values['path'],
				name: values['oldName'],
				name_new: values['name'],
				overwrite: false
			},
			successCallback: function() { // called on success
				SmartWFM.lib.Event.fire('', 'refresh', values['path']);
				this.window.close();
			},
			successScope: {
				window: button.up('rename')
			},
			callback: function() {	// called allways
				this.browserView.setLoading(false);
			},
			scope: {
				browserView: browserView
			}
		});
	},

	createNewFolder: function(basePath, name) {
		var loadingMask = new Ext.LoadMask(Ext.getBody(), {
			createNewFolderLoadingMask: true, 	// used to identify loading mask
			msg: SmartWFM.lib.I18n.get('swfm', 'Please wait ...')
		}).show();
		SmartWFM.lib.RPC.request({
			action: 'dir.create',
			params: {
				path: basePath,
				name: name
			},
			successCallback: function() { // called on success
				SmartWFM.lib.Event.fire('', 'refresh', basePath);
				// ToDo: specify which window has to be closed
				Ext.ComponentQuery.query('window[basePath="'+basePath+'"]')[0].close();
			},
			callback: function() {	// called allways
				Ext.ComponentQuery.query('loadmask[createNewFolderLoadingMask]')[0].destroy();
			}
		});
	},

	deleteAction: function(window, items, processedCount, ignoreAll) {
		// default values
		processedCount = processedCount || 0;
		ignoreAll = ignoreAll || false;

		// all items are processed OR process aborted
		if (!items.length) {
			window.close();
			SmartWFM.lib.Event.fire('', 'refresh');
			return;
		}

		// count total
		var totalCount = 0;
		for(var i in items) {
			if(items[i]['isDir'] && !items[i]['isProcessed'])
				totalCount += 5;
			else
				totalCount += 1;
		}
		totalCount += processedCount;

		var item = items.pop();

		var percentage = processedCount / totalCount;
		var text = item['name'] + ' (' + Math.round(percentage * 100) + '%)';

		window.down('progressbar').updateProgress(percentage, text, false);

		// RPC base variables
		var action = 'file.delete';
		var params = {
			path: item['path'],
			name: item['name']
		};
		// error handling
		var errorScope = {
				data: {
					controller: this,
					window: window,
					items: items,
					processedCount: processedCount,
					item: item,
					ignoreAll: ignoreAll
				}
			};
		var errorCallback =
			function(error) {
				if(error['code'] == -1 || ignoreAll) { // file/folder doesn't exists
					// just skip this item
					this['data']['controller'].deleteAction(
						this['data']['window'],
						this['data']['items'],
						this['data']['processedCount'] + 1,
						this['data']['ignoreAll']
					);
				} else {
					Ext.create('SmartWFM.view.baseActions.DeleteErrorWindow', { data: this['data'] }).show();
				}
			};
		// success handling
		var successScope = errorScope; // same as in case of error
		var successCallback =
			function(response) {
				this['data']['controller'].deleteAction(
					this['data']['window'],
					this['data']['items'],
					this['data']['processedCount'] + 1,
					this['data']['ignoreAll']
				);
			};

		if (item['isDir'] && item['isProcessed']) {
			// if the folder is already processed we can delete it
			// only adjust action
			action = 'dir.delete';
		} else if (item['isDir']) {
			// mark as processed
			item['isProcessed'] = true;

			// re-add this unfinished folder
			successScope['data']['items'].push(item);

			// other action and params
			action = 'file.list';
			params = {
					path: SmartWFM.lib.Path.join(item['path'], item['name']),
					showHidden: true
				};

			// new callback in case of success - but same scope ;)
			var successCallback =
				function(result) {
					for(var i = 0; i < result.length; i++) {
						this['data']['items'].push(result[i]);
					}
					this['data']['controller'].deleteAction(
						this['data']['window'],
						this['data']['items'],
						this['data']['processedCount'],
						this['data']['ignoreAll']
					);
				};

		} else {
			// simple file - delete it
			// nothing to adjust - default seems to be good :)
		}


		SmartWFM.lib.RPC.request({
			action: action,
			params: params,
			errorScope: errorScope,
			errorCallback: errorCallback,
			successScope: successScope,
			successCallback: successCallback
		});
	},

	copyAction: function(window, items, destination, processedCount, overwriteAll, ignoreAll) {
		// default values
		processedCount = processedCount || 0;
		overwriteAll = overwriteAll || false;
		ignoreAll = ignoreAll || false;

		// all items are processed OR process aborted
		if (!items.length) {
			window.close();
			SmartWFM.lib.Event.fire('', 'refresh');
			return;
		}

		// count total and add individual destination
		var totalCount = 0;
		for(var i in items) {
			if(items[i]['isDir'] && !items[i]['isProcessed'])
				totalCount += 5;
			else
				totalCount += 1;
			// add individual destination - only if destination isset
			if(destination != undefined && !('destination' in items[i])) {
				items[i]['destination'] = {
					path: destination,
					name: items[i]['name']
				};
			}
		}
		totalCount += processedCount;

		var item = items.pop();

		// check for recursion - destination inside of source and destination and source are same folder
		if(item['isDir']) {
			var re = new RegExp('^' + SmartWFM.lib.Path.join(item['path'], item['name']));
			if(re.test(SmartWFM.lib.Path.join(item['destination']['path'], item['destination']['name']))) {
				window.close();
				Ext.Msg.show({
					title: SmartWFM.lib.I18n.get('swfm.window', 'Error'),
					msg: SmartWFM.lib.I18n.get('plugin.baseActions.error', 'Destination is inside source path.'),
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				return;
			}
		}

		var percentage = processedCount / totalCount;
		var text = item['name'] + ' (' + Math.round(percentage * 100) + '%)';

		window.down('progressbar').updateProgress(percentage, text, false);

		// RPC base variables
		var action = 'file.copy';
		var params = {
			source: {
				path: item['path'],
				name: item['name']
			},
			destination: {
				path: item['destination']['path'],
				name: item['destination']['name']
			},
			overwrite: item['overwrite'] || overwriteAll
		};
		// error handling
		var errorScope = {
				data: {
					controller: this,
					window: window,
					items: items,
					processedCount: processedCount,
					overwriteAll: overwriteAll,
					ignoreAll: ignoreAll,
					item: item
				}
			};
		var errorCallback =
			function(error) {
				if(error['code'] == -1 || ignoreAll) { // file/folder doesn't exists
					// just skip this item
					this['data']['controller'].copyAction(
						this['data']['window'],
						this['data']['items'],
						undefined,
						this['data']['processedCount'] + 1,
						this['data']['overwriteAll'],
						this['data']['ignoreAll']
					);
				} else {
					Ext.create('SmartWFM.view.baseActions.CopyErrorWindow', { data: this['data'] }).show();
				}
			};
		// success handling
		var successScope = errorScope; // same as in case of error
		var successCallback =
			function(response) {
				this['data']['controller'].copyAction(
					this['data']['window'],
					this['data']['items'],
					undefined,
					this['data']['processedCount'] + 1,
					this['data']['overwriteAll'],
					this['data']['ignoreAll']
				);
			};

		if (item['isDir'] && item['isExistent'] == false) { // create the folder
			action = 'dir.create';
			params = {
				path: item['destination']['path'],
				name: item['destination']['name']
			};
			successCallback =
				function(result) {
					var currentItem = this['data']['item'];
					currentItem['isExistent'] = true;
					this['data']['items'].push(currentItem);
					this['data']['controller'].copyAction(
						this['data']['window'],
						this['data']['items'],
						undefined,
						this['data']['processedCount'],
						this['data']['overwriteAll'],
						this['data']['ignoreAll']
					);
				};
		} else if (item['isDir'] && item['isExistent'] == true) { // add all containing items
			action = 'file.list';
			params = {
				path: SmartWFM.lib.Path.join(item['path'], item['name']),
				showHidden: true
			};
			successCallback =
				function(result) {
					// current item
					var item = this['data']['item']['destination'];
					// merge result of this request with existing array
					var items = Ext.Array.merge(this['data']['items'], result);
					// calculate destination path
					var destination = SmartWFM.lib.Path.join(item['path'], item['name']);
					this['data']['controller'].copyAction(
						this['data']['window'],
						items,
						destination,
						this['data']['processedCount'] + 1,
						this['data']['overwriteAll'],
						this['data']['ignoreAll']
					);
				};
		} else if (item['isDir']) { // check if folder is in destination existent
			action = 'dir.list'; // only need folders to check)
			params = {
				path: item['destination']['path'],
				showHidden: true,
				currentPath: SmartWFM.app.getController('Browser').getBrowserView().getActiveTab().getPath()
			};
			successCallback =
				function(result) {
					var currentItem = this['data']['item'];
					currentItem['isExistent'] = false;
					// check if folder with such name is existent
					for(var item in result) {
						if(result[item]['name'] == currentItem['name']) {
							currentItem['isExistent'] = true;
							break;
						}
					}
					this['data']['items'].push(currentItem);
					this['data']['controller'].copyAction(
						this['data']['window'],
						this['data']['items'],
						undefined,
						this['data']['processedCount'],
						this['data']['overwriteAll'],
						this['data']['ignoreAll']
					);
				};
		} else {
			// all specified above
		}


		SmartWFM.lib.RPC.request({
			action: action,
			params: params,
			errorScope: errorScope,
			errorCallback: errorCallback,
			successScope: successScope,
			successCallback: successCallback
		});
	},

	moveAction: function(window, items, destination, processedCount, ignoreAll) { // todo refactor - copy of copy action
		// default values
		processedCount = processedCount || 0;
		ignoreAll = ignoreAll || false;

		// all items are processed OR process aborted
		if (!items.length) {
			window.close();
			SmartWFM.lib.Event.fire('', 'refresh');
			return;
		}

		// count total and add individual destination
		var totalCount = 0;
		for(var i in items) {
			if(items[i]['isDir'] && !items[i]['isProcessed'])
				totalCount += 5;
			else
				totalCount += 1;
			// add individual destination - only if destination isset
			if(destination != undefined && !('destination' in items[i])) {
				items[i]['destination'] = {
					path: destination,
					name: items[i]['name']
				};
			}
		}
		totalCount += processedCount;

		var item = items.pop();

		// check for recursion - destination inside of source and destination and source are same folder
		if(item['isDir']) {
			var re = new RegExp('^' + SmartWFM.lib.Path.join(item['path'], item['name']));
			if(re.test(SmartWFM.lib.Path.join(item['destination']['path'], item['destination']['name']))) {
				window.close();
				Ext.Msg.show({
					title: SmartWFM.lib.I18n.get('swfm.window', 'Error'),
					msg: SmartWFM.lib.I18n.get('plugin.baseActions.error', 'Destination is inside source path.'),
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				return;
			}
		}

		var percentage = processedCount / totalCount;
		var text = item['name'] + ' (' + Math.round(percentage * 100) + '%)';

		window.down('progressbar').updateProgress(percentage, text, false);

		// RPC base variables
		var action = 'file.move';
		var params = {
			source: {
				path: item['path'],
				name: item['name']
			},
			destination: {
				path: item['destination']['path'],
				name: item['destination']['name']
			},
			overwrite: false // unused
		};
		// error handling
		var errorScope = {
				data: {
					controller: this,
					window: window,
					items: items,
					processedCount: processedCount,
					ignoreAll: ignoreAll,
					item: item
				}
			};
		var errorCallback =
			function(error) {
				if(error['code'] == -1 || ignoreAll) { // file/folder doesn't exists
					// just skip this item
					this['data']['controller'].moveAction(
						this['data']['window'],
						this['data']['items'],
						undefined,
						this['data']['processedCount'] + 1,
						this['data']['ignoreAll']
					);
				} else {
					Ext.create('SmartWFM.view.baseActions.MoveErrorWindow', { data: this['data'] }).show();
				}
			};
		// success handling
		var successScope = errorScope; // same as in case of error
		var successCallback =
			function(response) {
				this['data']['controller'].moveAction(
					this['data']['window'],
					this['data']['items'],
					undefined,
					this['data']['processedCount'] + 1,
					this['data']['ignoreAll']
				);
			};

		if (item['isDir'] && item['isExistent'] == false) { // create the folder
			action = 'dir.create';
			params = {
				path: item['destination']['path'],
				name: item['destination']['name']
			};
			successCallback =
				function(result) {
					var currentItem = this['data']['item'];
					currentItem['isExistent'] = true;
					this['data']['items'].push(currentItem);
					this['data']['controller'].moveAction(
						this['data']['window'],
						this['data']['items'],
						undefined,
						this['data']['processedCount'],
						this['data']['ignoreAll']
					);
				};
		} else if (item['isDir'] && item['isExistent'] == true) { // add all containing items
			action = 'file.list';
			params = {
				path: SmartWFM.lib.Path.join(item['path'], item['name']),
				showHidden: true
			};
			successCallback =
				function(result) {
					// current item
					var item = this['data']['item']['destination'];
					// merge result of this request with existing array
					// move action - additional prepend current directory
					item['isEmpty'] = false;
					var items = Ext.Array.merge(this['data']['items'], [item], result);
					// calculate destination path
					var destination = SmartWFM.lib.Path.join(item['path'], item['name']);
					this['data']['controller'].moveAction(
						this['data']['window'],
						items,
						destination,
						this['data']['processedCount'],
						this['data']['ignoreAll']
					);
				};
		} else if (item['isDir'] && item['isEmpty'] == false) {
			action = 'file.list'; // check if folder isEmpty
			params = {
				path: SmartWFM.lib.Path.join(item['path'], item['name']),
				showHidden: true
			};
			successCallback =
				function(result) {
					var currentItem = this['data']['item'];
					if (result.length == 0) {
						currentItem['isEmpty'] = true;
						// only append if empty
						this['data']['items'].push(currentItem);
					} else {
						// ignore this item
						// todo ? better solution ?
						this['data']['processedCount'] += 1;
					}
					this['data']['controller'].moveAction(
						this['data']['window'],
						this['data']['items'],
						undefined,
						this['data']['processedCount'],
						this['data']['ignoreAll']
					);
				};
		} else if (item['isDir'] && item['isEmpty'] == true) {
			action = 'dir.delete'; // check if folder is empty and delete it
			params = {
				path: item['path'],
				name: item['name']
			};
			successCallback =
				function(result) {
					this['data']['controller'].moveAction(
						this['data']['window'],
						this['data']['items'],
						undefined,
						this['data']['processedCount'] + 1,
						this['data']['ignoreAll']
					);
				};
		} else if (item['isDir']) { // check if folder is in destination existent
			action = 'dir.list'; // only need folders to check)
			params = {
				path: item['destination']['path'],
				showHidden: true,
				currentPath: SmartWFM.app.getController('Browser').getBrowserView().getActiveTab().getPath()
			};
			successCallback =
				function(result) {
					var currentItem = this['data']['item'];
					currentItem['isExistent'] = false;
					// check if folder with such name is existent
					for(var item in result) {
						if(result[item]['name'] == currentItem['name']) {
							currentItem['isExistent'] = true;
							break;
						}
					}
					this['data']['items'].push(currentItem);
					this['data']['controller'].moveAction(
						this['data']['window'],
						this['data']['items'],
						undefined,
						this['data']['processedCount'],
						this['data']['ignoreAll']
					);
				};
		} else {
			// all specified above
		}


		SmartWFM.lib.RPC.request({
			action: action,
			params: params,
			errorScope: errorScope,
			errorCallback: errorCallback,
			successScope: successScope,
			successCallback: successCallback
		});
	}
});
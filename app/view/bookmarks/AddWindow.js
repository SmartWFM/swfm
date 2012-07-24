Ext.define('SmartWFM.view.bookmarks.AddWindow', {
	extend: 'Ext.window.Window',

	requires: [
		'SmartWFM.lib.I18n'
	],

	title: SmartWFM.lib.I18n.get('widget.bookmarks', 'Bookmark'),

	basePath: '',
	plain: true,
	border: false,
	constrain: true,

	items: {
		xtype: 'form',
		border: false,
		bodyStyle: {'background-color': 'transparent'}, // only way not to have a white background
		items: [{
			xtype: 'textfield',
			fieldLabel: SmartWFM.lib.I18n.get('widget.bookmarks', 'Enter name of bookmark'),
			labelAlign: 'top',
			name: 'bookmarkName',
			anchor: '100%',
			listeners: {
				specialkey: function (self, e) {
					// if the user hits the ENTER key we simulate a button click to submit the form
					if (e.getKey() === e.ENTER) {
						this.up('window').down('button').fireHandler(e);
					}
				}
			}
		},{
			xtype: 'hiddenfield',
			name: 'bookmarkPath'
		}]
	},

	buttons: [{
		text: SmartWFM.lib.I18n.get('widget.bookmarks', 'Save'),
		handler: function() {
			var w = this.up('window');
			SmartWFM.app.getController('Bookmarks').add(
				w.down('textfield[name=bookmarkName]').getValue(),
				w.down('hiddenfield[name=bookmarkPath]').getValue()
			);
			w.close();
		}
	},{
		text: SmartWFM.lib.I18n.get('swfm.button', 'Cancel'),
		handler: function() {
			this.up('window').close();
		}
	}],

	// the textfield loses its focus after window is shown, moved or resized,
	// thats why we have to set the focus again
	listeners: {
		/*
		 * @event move
		 */
		move: function () {
			this.down('textfield[name=bookmarkName]').focus(false, 500);
		},
		/*
		 * @event resize
		 */
		resize: function () {
			this.down('textfield[name=bookmarkName]').focus(false, 500);
		},
		/*
		 * @event show
		 */
		show: function () {
			this.down('textfield[name=bookmarkName]').focus(false, 500);
		}
	}
});
Ext.define('SmartWFM.view.afsActions.AddRuleDialog', {
	extend: 'Ext.window.Window',
	alias: 'widget.addRuleDialog',

	requires: [
		'SmartWFM.lib.I18n'
	],

	title: SmartWFM.lib.I18n.get('plugin.afsActions', 'Add new rule'),

	plain: true,
	border: false,
	constrain: true,
	modal: true,
	width: 200,

	items: {
		xtype: 'form',
		border: false,
		bodyStyle: {'background-color': 'transparent'}, // only way not to have a white background
		items: [{
			xtype: 'textfield',
			fieldLabel: SmartWFM.lib.I18n.get('plugin.afsActions', 'Name of user or group'),
			labelAlign: 'top',
			name: 'name',
			anchor: '100%',
			listeners: {
				specialkey: function (self, e) {
					// if the user hits the ENTER key we simulate a button click to submit the form
					if (e.getKey() === e.ENTER) {
						this.up('window').down('button').fireHandler(e);
					}
				}
			}
		}]
	},

	buttons: [{
		text: SmartWFM.lib.I18n.get('swfm.button', 'OK'),
		action: 'add'
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
			this.down('textfield[name=name]').focus(false, 500);
		},
		/*
		 * @event resize
		 */
		resize: function () {
			this.down('textfield[name=name]').focus(false, 500);
		},
		/*
		 * @event show
		 */
		show: function () {
			this.down('textfield[name=name]').focus(false, 500);
		}
	}
});
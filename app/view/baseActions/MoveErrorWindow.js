Ext.define('SmartWFM.view.baseActions.MoveErrorWindow', {
	extend: 'SmartWFM.view.baseActions.CopyErrorWindow',

	title: SmartWFM.lib.I18n.get('plugin.baseActions', 'Error moving file ...'),
	width: 500,

	doAction: function(ignoreAll) {
		this['data']['controller'].moveAction(
			this['data']['window'],
			this['data']['items'],
			undefined,
			this['data']['processedCount'],
			ignoreAll || this['data']['ignoreAll']
		);
	},

	initComponent: function() {
		this.callParent();
		// remove overwrite buttons, cause don't needed
		var overwriteButtons = this.query('button[overwriteButton]');
		for (var i in overwriteButtons) {
			overwriteButtons[i].destroy();
		}
	}
});
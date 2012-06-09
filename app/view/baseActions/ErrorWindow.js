Ext.define('SmartWFM.view.baseActions.ErrorWindow', {
	extend: 'Ext.window.Window',

	requires: [
		'SmartWFM.lib.I18n'
	],

	border: false,
	width: 500,
	height: 100,
	closable: false,
	resizable: false,
	plain: true,
	constrain: true,
	constrainHeader: true,
	modal: true,
	buttonAlign: 'center'
});
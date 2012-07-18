Ext.define('SmartWFM.store.afsActions.Permissions', {
	extend: 'Ext.data.ArrayStore',

	fields: [
		'value',
		'name'
	],

	data: [
		['rlidwka'	, SmartWFM.lib.I18n.get('plugin.afsActions', 'full access with right managment')],
		['rlidwk'	, SmartWFM.lib.I18n.get('plugin.afsActions', 'full access without right managment')],
		['rliwk'	, SmartWFM.lib.I18n.get('plugin.afsActions', 'read, modify, insert, forbidden: delete')],
		['rlwk'		, SmartWFM.lib.I18n.get('plugin.afsActions', 'read, modify, forbidden: delete, insert')],
		['rlik'		, SmartWFM.lib.I18n.get('plugin.afsActions', 'read, insert, forbidden: modify, delete')],
		['li'		, SmartWFM.lib.I18n.get('plugin.afsActions', 'list, insert')],
		['rl'		, SmartWFM.lib.I18n.get('plugin.afsActions', 'read only')],
		['l'		, SmartWFM.lib.I18n.get('plugin.afsActions', 'list only')],
		[''			, SmartWFM.lib.I18n.get('plugin.afsActions', 'no access - deletes entry')]
	]
});
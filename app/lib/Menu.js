/**
 * Manage all the menu entries and all the menus for SmartWFM.
 *
 * @author Morris Jobke
 * @since 0.10
 */
Ext.define('SmartWFM.lib.Menu', {
	singleton: true,

	/**
	 * A global array to store menu items
	 *
	 * @protected
	 * @type Object
	 * @since 0.10
	 */
	items: {},

	/**
	 * Add a menu item to the global menu item store
	 *
	 * @param {String} menuName Name of the menu item
	 * @param {Function} menuCallback The menu item
	 *
	 * @since 0.10
	 */
	add: function (menuName, menuCallback) {
		console.groupCollapsed("SmartWFM.lib.Menu.add()");
		console.debug("Arguments: ", arguments);

		this.items[menuName] = menuCallback;

		console.groupEnd();
	},


	/**
	 * Get a menu within the given context.
	 *
	 * @param {Array} actions The actions
	 * @param {Object} context The context
	 * 		<ul>
	 *			<li>files - list of files | if not specified undefined</li>
	 *			<li>dirs - list of dirs | if not specified undefined</li>
	 *		</ul>
	 *
	 * @return {Ext.menu.Menu} Menu or undefined if failed
	 *
	 * @since 0.10
	 */
	get: function (actions, context) {
		console.groupCollapsed("SmartWFM.lib.Menu.get()");
		console.debug("Arguments: ", arguments);

		var menu = [];
		var actionName;
		var Item;
		var menuItem;
		var i;

		if (actions === undefined || typeof(actions) !== 'object') {
			console.warning('Wrong actions type or actions not given');
			console.groupEnd();

			return undefined;
		}
		for (i = 0; i < actions.length; i++) {
			actionName = actions[i];

			// Wrong type? Continue with next one.
			if (actionName === undefined || typeof(actionName) !== 'string') {
				console.warning("Name of the action not given or not a string: ", actionName);
				continue;
			}

			if (actionName === '|') {
				console.log('Found(Separator): Separator');
				menu.push(new Ext.menu.Separator());
			} else {
				Item = this.items[actionName];

				console.log('Found(Item): ', Item);

				if (Item !== undefined) {
					menuItem = new Item({
						context: context
					});
					if (menuItem.disabled === false) {
						menu.push(menuItem);
					}
				}
			}
		}

		if (menu.length === 0) {
			console.groupEnd();

			return undefined;
		} else {
			console.groupEnd();

			return new Ext.menu.Menu({
				style: {
					overflow: 'visible'     // For the Combo popup
				},
				items : menu
			});
		}
	}
});
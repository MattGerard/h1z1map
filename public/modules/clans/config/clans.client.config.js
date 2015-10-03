'use strict';

// Configuring the Articles module
angular.module('clans').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Clan', 'clans', 'dropdown', '/clans(/create)?');
		Menus.addSubMenuItem('topbar', 'clans', 'List Clans', 'clans');
		Menus.addSubMenuItem('topbar', 'clans', 'New Clan', 'clans/create');
	}
]);
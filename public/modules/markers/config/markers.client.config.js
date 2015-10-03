'use strict';

// Configuring the Articles module
angular.module('markers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Markers', 'markers', 'dropdown', '/markers(/create)?');
		Menus.addSubMenuItem('topbar', 'markers', 'List Markers', 'markers');
		Menus.addSubMenuItem('topbar', 'markers', 'New Marker', 'markers/create');
	}
]);
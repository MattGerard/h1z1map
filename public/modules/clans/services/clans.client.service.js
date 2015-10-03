'use strict';

//Clans service used to communicate Clans REST endpoints
angular.module('clans').factory('Clans', ['$resource',
	function($resource) {
		return $resource('clans/:clanId', { clanId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
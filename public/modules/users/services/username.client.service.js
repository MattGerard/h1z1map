'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Username', ['$resource',
	function($resource) {
    return $resource('users/:username', { username: '@username'
    });
	}
]);
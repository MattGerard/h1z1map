'use strict';

//Markers service used to communicate Markers REST endpoints
angular.module('markers').factory('Markers', ['$resource',
	function($resource) {
		return $resource('markers/:markerId', { markerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('markers').factory('ClanMarkers', ['$resource',
  function($resource) {
    return $resource('clanmarkers/:clanId', { clanId: '@clanId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
'use strict';

//Setting up route
angular.module('markers').config(['$stateProvider',
	function($stateProvider) {
		// Markers state routing
		$stateProvider.
		state('listMarkers', {
			url: '/markers',
			templateUrl: 'modules/markers/views/list-markers.client.view.html'
		}).
		state('createMarker', {
			url: '/markers/create',
			templateUrl: 'modules/markers/views/create-marker.client.view.html'
		}).
		state('viewMarker', {
			url: '/markers/:markerId',
			templateUrl: 'modules/markers/views/view-marker.client.view.html'
		}).
		state('editMarker', {
			url: '/markers/:markerId/edit',
			templateUrl: 'modules/markers/views/edit-marker.client.view.html'
		});
	}
]);
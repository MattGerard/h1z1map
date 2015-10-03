'use strict';

//Setting up route
angular.module('clans').config(['$stateProvider',
	function($stateProvider) {
		// Clans state routing
		$stateProvider.
		state('listClans', {
			url: '/clans',
			templateUrl: 'modules/clans/views/list-clans.client.view.html'
		}).
		state('createClan', {
			url: '/clans/create',
			templateUrl: 'modules/clans/views/create-clan.client.view.html'
		}).
		state('viewClan', {
			url: '/clans/:clanId',
			templateUrl: 'modules/clans/views/view-clan.client.view.html'
		}).
		state('editClan', {
			url: '/clans/:clanId/edit',
			templateUrl: 'modules/clans/views/edit-clan.client.view.html'
		});
	}
]);
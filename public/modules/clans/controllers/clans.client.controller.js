'use strict';

// Clans controller
angular.module('clans').controller('ClansController', ['$scope', '$stateParams', '$location', 'Username', 'Authentication', 'Clans',
	function($scope, $stateParams, $location, Username, Authentication, Clans) {
		$scope.authentication = Authentication;

		// Create new Clan
		$scope.create = function() {
			// Create new Clan object
			var clan = new Clans ({
				name: this.name
			});

			// Redirect after save
			clan.$save(function(response) {
				$location.path('clans/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Clan
		$scope.remove = function(clan) {
			if ( clan ) { 
				clan.$remove();

				for (var i in $scope.clans) {
					if ($scope.clans [i] === clan) {
						$scope.clans.splice(i, 1);
					}
				}
			} else {
				$scope.clan.$remove(function() {
					$location.path('clans');
				});
			}
		};

		// Update existing Clan
		$scope.update = function() {
			var clan = $scope.clan;

			clan.$update(function() {
				$location.path('clans/' + clan._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

    // Update existing Clan
    $scope.addMember = function() {
      $scope.errorUsername = '';
      var clan = $scope.clan;
      var members = $scope.clan.members;
      var newMember = $scope.new.clan.members;

      $scope.clanMember = Username.get({ 
        username: newMember
      });

      function onSuccess(result) {
        var member = {id: result._id, username: result.username};
        members.push(member);
        console.log(member);
        $scope.update();
        
      }

      function onError(result) {
        $scope.errorUsername = result.data.message;
      }

      $scope.clanMember.$promise.then(onSuccess, onError);
     
    };

    $scope.removeMember = function(member) { 
      var index = $scope.clan.members.indexOf(member);
      $scope.clan.members.splice(index, 1); 
      $scope.update();    
    };

		// Find a list of Clans
		$scope.find = function() {
			$scope.clans = Clans.query();
		};

		// Find existing Clan
		$scope.findOne = function() {
			$scope.clan = Clans.get({ 
				clanId: $stateParams.clanId
			});
		};
	}
]);
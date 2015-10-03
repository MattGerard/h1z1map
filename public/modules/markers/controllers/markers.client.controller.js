'use strict';
/* global L */
// Markers controller
angular.module('markers').controller('MarkersController', ['$scope', 'leafletData', 'ClanMarkers', '$stateParams', '$location', 'Authentication', 'Markers',
    function($scope, leafletData, ClanMarkers, $stateParams, $location, Authentication, Markers) {
        $scope.authentication = Authentication;
        angular.extend($scope, {
            defaults: {
                zoomControlPosition: 'bottomright',
                tileLayerOptions: {
                    opacity: 0.9,
                    detectRetina: true,
                    reuseTiles: true,
                },
                scrollWheelZoom: false,
                maxZoom: 2,
                minZoom:2,
                attributionControl: false
            },
            center: {
                lat: 51.505,
                lng: -0.09,
                zoom: 2,
            },
            tiles: {
              url: '/modules/core/img/map/{z}_{x}_{y}.jpg',
            },
            maxbounds: {
              southWest: {
                lat: -74.40216259842438, 
                lng: -174.0234375
              },
              northEast: {
                lat: 74.01954331150228, 
                lng: 174.375
              }
            }
        });

        //create marker menu slide
        $scope.toggleMenu = function($event){
            var link = $event.currentTarget;
            if(angular.element(link).hasClass('active')){
                angular.element('.create-marker').slideUp();
                angular.element(link).removeClass('active');
            } else {
                angular.element('.create-marker').slideDown();
                angular.element(link).addClass('active');
            }
        };

        $scope.markertypes = [
            {id:1 ,name:'Point Of Intrest'},
            {id:2 ,name:'Friendly POI'},
            {id:3 ,name:'Bandit POI'},
            {id:4 ,name:'Loot Location'},
            {id:5 ,name:'Home'}
        ];

        $scope.markertype = $scope.markertypes[0];

        // Remove existing Marker
        $scope.remove = function(marker) {
            if (marker) {
                marker.$remove();

                for (var i in $scope.markers) {
                    if ($scope.markers[i] === marker) {
                        $scope.markers.splice(i, 1);
                    }
                }
            } else {
                $scope.marker.$remove(function() {
                    if($scope.marker.clan !== ''){
                      $location.path('/clans/'+$scope.marker.clan);
                    } else {
                      $location.path('home');
                    }
                });
            }
        };

        // Update existing Marker
        $scope.update = function() {
            var marker = $scope.marker;

            marker.$update(function() {
                    if(marker.clan !== ''){
                      $location.path('/clans/'+marker.clan);
                    } else {
                      $location.path('home');
                    }
                  }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Markers
        $scope.find = function() {
           $scope.markers = Markers.query();
        };

        // Find existing Marker
        $scope.findOne = function() {
            $scope.marker = Markers.get({
                markerId: $stateParams.markerId
            });
        };

// DRAW MARKERS

  var poiIcon = L.icon({
      iconUrl: 'modules/core/img/rsz_png.png',
      shadowUrl: 'modules/core/img/rsz_png_shadow.png',
      iconSize:     [16, 31], // size of the icon
      shadowSize:   [32, 31], // size of the shadow
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor:  [15, 0] // point from which the popup should open relative to the iconAnchor
  });

  var friendlyPoiIcon = L.icon({
      iconUrl: 'modules/core/img/rsz_png-1.png',
      shadowUrl: 'modules/core/img/rsz_png-1_shadow.png',
      iconSize:     [16, 21], // size of the icon
      shadowSize:   [27, 21], // size of the shadow
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor:  [10, 0] // point from which the popup should open relative to the iconAnchor
  });

  var banditPoiIcon = L.icon({
      iconUrl: 'modules/core/img/rsz_1png.png',
      shadowUrl: 'modules/core/img/rsz_1png_shadow.png',
      iconSize:     [16, 21], // size of the icon
      shadowSize:   [27, 21], // size of the shadow
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor:  [10, 0] // point from which the popup should open relative to the iconAnchor
  });

  var lootPoiIcon = L.icon({
      iconUrl: 'modules/core/img/rsz_png-3.png',
      shadowUrl: 'modules/core/img/rsz_png-3_shadow.png',
      iconSize:     [16, 16], // size of the icon
      shadowSize:   [25, 16], // size of the shadow
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor:  [8, 0] // point from which the popup should open relative to the iconAnchor
  });

  var homeIcon = L.icon({
      iconUrl: 'modules/core/img/rsz_png-2.png',
      shadowUrl: 'modules/core/img/rsz_png-2_shadow.png',
      iconSize:     [16, 16], // size of the icon
      shadowSize:   [25, 16], // size of the shadow
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor:  [8, 0] // point from which the popup should open relative to the iconAnchor
  });

var popup = L.popup();

$scope.drawMarkers = function() {

  if($scope.authentication.user){

    if($location.path().split('/')[1] === 'clans'){
      $scope.markers = ClanMarkers.query({
                clanId: $location.path().split('/')[2]
            });
    } else {
      $scope.markers = Markers.query();
    }

      $scope.markers.$promise.then(function (result) {

          $scope.markers = result;

          leafletData.getMap().then(function(map) {
        
            angular.forEach($scope.markers, function(poi){
            
              var gameMarker = '<div class="marker-title"><h4>'+poi.title+'</h4></div><div class="marker-content">'+poi.content+'<br><span class="text-right"><a class="edit-poi" href="#!/markers/'+poi._id+'/edit">Edit <span class="glyphicon glyphicon-edit"></span></a></span></div>';

              if(poi.markerType === 1){
                  L.marker([poi.locationLat, poi.locationLong],{icon: poiIcon}).addTo(map)
                  .bindPopup(gameMarker);
              } else if(poi.markerType === 2) {
                  L.marker([poi.locationLat, poi.locationLong],{icon: friendlyPoiIcon}).addTo(map)
                  .bindPopup(gameMarker);
              } else if(poi.markerType === 3) {
                  L.marker([poi.locationLat, poi.locationLong],{icon: banditPoiIcon}).addTo(map)
                  .bindPopup(gameMarker);
              } else if(poi.markerType === 4) {
                  L.marker([poi.locationLat, poi.locationLong],{icon: lootPoiIcon}).addTo(map)
                  .bindPopup(gameMarker);
              } else if(poi.markerType === 5) {
                  L.marker([poi.locationLat, poi.locationLong],{icon: homeIcon}).addTo(map)
                  .bindPopup(gameMarker);
              }
            
            });

            function onMapClick(e) {

                map.setView(e.latlng);

                var inputLat = angular.element('input#locationLat');
                var inputLong = angular.element('input#locationLong');
                inputLat.val(e.latlng.lat.toFixed(2));
                inputLong.val(e.latlng.lng.toFixed(2));
                inputLat.trigger('input');
                inputLong.trigger('input');

                if(!angular.element('.collapse-Menu').hasClass('active')){
                  angular.element('.create-marker').slideDown();
                  angular.element('.collapse-Menu').addClass('active');
                }

            } 

            map.on('click', onMapClick);

        });

      });

  }

};

        // Create new Marker
        $scope.create = function() {

          // Create new Marker object

          if($stateParams.clanId){
            $scope.marker_data = {
                title: this.title,
                content: this.content,
                locationLong: this.locationLong,
                locationLat: this.locationLat,
                private: this.private,
                markerType: this.markertype.id,
                clan: $stateParams.clanId
            };
          } else {
            $scope.marker_data = {
                title: this.title,
                content: this.content,
                locationLong: this.locationLong,
                locationLat: this.locationLat,
                private: this.private,
                markerType: this.markertype.id,
                clan: this.clan
            };
          }

          var marker = new Markers($scope.marker_data);

            // Redirect after save
            marker.$save(function(response) {

            leafletData.getMap().then(function(map) {

              var gameMarker = '<div class="marker-title"><h4>'+response.title+'</h4></div><div class="marker-content">'+response.content+'<br><span class="text-right"><a class="edit-poi" href="#!/markers/'+response._id+'/edit">Edit <span class="glyphicon glyphicon-edit"></span></a></span></div>';

              if(response.markerType === 1){
                  L.marker([response.locationLat, response.locationLong],{icon: poiIcon}).addTo(map)
                  .bindPopup(gameMarker);
              } else if(response.markerType === 2) {
                  L.marker([response.locationLat, response.locationLong],{icon: friendlyPoiIcon}).addTo(map)
                  .bindPopup(gameMarker);
              } else if(response.markerType === 3) {
                  L.marker([response.locationLat, response.locationLong],{icon: banditPoiIcon}).addTo(map)
                  .bindPopup(gameMarker);
              } else if(response.markerType === 4) {
                  L.marker([response.locationLat, response.locationLong],{icon: lootPoiIcon}).addTo(map)
                  .bindPopup(gameMarker);
              } else if(response.markerType === 5) {
                  L.marker([response.locationLat, response.locationLong],{icon: homeIcon}).addTo(map)
                  .bindPopup(gameMarker);
              }

                if(angular.element('.collapse-Menu').hasClass('active')){
                  angular.element('.create-marker').slideUp();
                  angular.element('.collapse-Menu').removeClass('active');
                }


              });

            }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            this.title = '';
            this.content = '';
            this.locationLong = '';
            this.locationLat = '';
            this.private = '';
            this.markerType = '';

        };

    }
]);
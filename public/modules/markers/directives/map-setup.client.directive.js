'use strict';

angular.module('markers').directive('leafletsetting', function () {
    return {
        restrict: 'A',
        type: '=',
        link: function (scope, element, attrs) {


        console.log(scope);

        /* global L */
        var map = scope.map;

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.control.zoom({position:'bottomright'}).addTo(map);

        var popup = L.popup();

        scope.drawMarkers(map,popup);

        function onMapClick(e) {
          popup
            .setLatLng(e.latlng)
            .setContent('<div class="row text-center"><strong>Continue adding POI details in the menu above.</strong></div>')
            .openOn(map);

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


        }
    };
});
/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.factory('locationsService', locationsService);

    function locationsService() {
        var service = {
            // TODO: Remove default location
            data: [{
                city: 'Medford, NJ, USA',
                lat: 39.9360579,
                lng: -74.7542431
            }],
            getIndex: getIndex,
            toggle: toggle,
            primary: primary
        };

        return service;

        ////////////////

        /**
         * Gets index of the location from locations that user have in the list
         * @param item
         * @returns {number}
         */
        function getIndex(item) {
            var index = -1;
            angular.forEach(service.data, function (location, i) {
                if (item.lat === location.lat && item.lng === location.lng) {
                    index = i;
                }
            });
            return index;
        }

        /**
         * Removes item from the list of locations if it's already exists, otherwise it adds it if it doesn't
         * @param item
         */
        function toggle(item) {
            var index = service.getIndex(item);
            if (index >= 0) {
                service.data.splice(index, 1);
            } else {
                service.data.push(item);
            }
        }

        /**
         * Moves the location to the top position, or add it to the top if new
         * @param item
         */
        function primary(item) {
            var index = service.getIndex(item);
            if (index >= 0) {
                service.data.splice(index, 1);
                service.data.splice(0, 0, item);
            } else {
                service.data.unshift(item);
            }
        }
    }

}(angular.module('weatherApp.shared')));
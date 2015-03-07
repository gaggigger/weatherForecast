/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.factory('locationsService', locationsService);

    function locationsService() {
        var locations = [],
            service = {
                getIndex: getIndex,
                addLocation: addLocation,
                removeLocation: removeLocation,
                primary: primary,
                locations: locations,
                locationByIndex: locationByIndex
            };

        return service;

        ////////////////

        /**
         * Provides location by index in the list
         * @param index
         * @returns {*}
         */
        function locationByIndex(index) {
            return locations[index];
        }

        /**
         * Gets index of the location from locations that user have in the list
         * @param locationToCheck
         * @returns {number}
         */
        function getIndex(locationToCheck) {
            var index = -1;
            angular.forEach(locations, function (location, i) {
                if (location.lat === locationToCheck.lat && location.lng === locationToCheck.lng) {
                    index = i;
                }
            });
            return index;
        }

        /**
         * Removes location from the list of location
         * @param location. Location that needs to be removed
         */
        function removeLocation(location) {
            var index = getIndex(location);
            locations.splice(index, 1);
        }

        /**
         * Adds new location to the storage
         * @param location. New location that needs to be added
         */
        function addLocation(location) {
            locations.push(location);
        }

        /**
         * Moves the location to the top position, or add it to the top if new
         * @param location
         */
        function primary(location) {
            var index = getIndex(location);
            if (index >= 0) {
                // location already exist. Move it to the top
                locations.splice(index, 1);
                locations.splice(0, 0, location);
            } else {
                // new fav location. Move it to the top
                locations.unshift(location);
            }
        }
    }

}(angular.module('weatherApp.shared')));
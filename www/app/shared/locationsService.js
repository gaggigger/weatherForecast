/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.factory('locationsService', locationsService);

    locationsService.$inject = ['$log'];

    function locationsService($log) {
        var LOCATIONS_KEY = 'locations',
            service = {
                getIndex: getIndex,
                addLocation: addLocation,
                removeLocation: removeLocation,
                primary: primary,
                locations: [],
                locationByIndex: locationByIndex,
                moveLocation: moveLocation
            };

        activate();

        return service;

        ////////////////

        /**
         * Initialized data. Gets locations from localStorage
         */
        function activate() {
            try {
                service.locations = angular.fromJson(localStorage.getItem(LOCATIONS_KEY)) || [];
            } catch (err) {
                service.locations = [];
                $log.error('Failed to get location from localStorage. Error: ' + err);
            }
        }

        /**
         * Provides location by index in the list
         * @param index
         * @returns {*}
         */
        function locationByIndex(index) {
            return service.locations[index];
        }

        /**
         * Gets index of the location from locations that user have in the list
         * @param locationToCheck
         * @returns {number}
         */
        function getIndex(locationToCheck) {
            var index = -1;
            angular.forEach(service.locations, function (location, i) {
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
            service.locations.splice(index, 1);
            storeLocations();
        }

        /**
         * Adds new location to the storage
         * @param location. New location that needs to be added
         */
        function addLocation(location) {
            service.locations.push(location);
            storeLocations();
        }

        /**
         * Moves the location to the top position, or add it to the top if new
         * @param location
         */
        function primary(location) {
            var index = getIndex(location);
            if (index >= 0) {
                // location already exist. Move it to the top
                service.locations.splice(index, 1);
                service.locations.splice(0, 0, location);
            } else {
                // new favorite location. Move it to the top
                service.locations.unshift(location);
                storeLocations();
            }
        }

        /**
         * Persists locations to local storage
         */
        function storeLocations() {
            localStorage.setItem(LOCATIONS_KEY, angular.toJson(service.locations));
        }

        /**
         * Moves location from one position to another and persist that information
         * @param location
         * @param fromIndex
         * @param toIndex
         */
        function moveLocation(location, fromIndex, toIndex) {
            service.locations.splice(fromIndex, 1);
            service.locations.splice(toIndex, 0, location);
            storeLocations();
        }
    }

}(angular.module('weatherApp.shared')));
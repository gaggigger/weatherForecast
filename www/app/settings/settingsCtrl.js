/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.controller('SettingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$ionicPopup', 'settingsService', 'locationsService'];

    /* @ngInject */
    function settingsCtrl($ionicPopup, settingsService, locationsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = 'Settings';
        vm.settings = settingsService;
        vm.locations = locationsService.locations;
        vm.canDelete = false;
        vm.removeLocation = removeLocation;
        vm.moveLocation = locationsService.moveLocation;

        ////////////////

        /**
         * Handles removing location from the list of locations
         * @param index
         */
        function removeLocation(location) {
            $ionicPopup.confirm({
                title: 'Are you sure?',
                template: 'This will remove ' + location.city
            }).then(function (result) {
                if (result) {
                    locationsService.removeLocation(location);
                }

                // if it's last element that is deleted, then reset delete button
                if (locationsService.locations.length === 0) {
                    vm.canDelete = false;
                }
            });
        }
    }
}(angular.module('weatherApp')));
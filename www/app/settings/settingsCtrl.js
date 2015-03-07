/**
 * Created by Vlad on 3/1/2015.
 */

(function () {
    'use strict';

    angular
        .module('weatherApp')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['settingsService', 'locationsService'];

    /* @ngInject */
    function SettingsCtrl(settingsService, locationsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = 'Settings';
        vm.settings = settingsService;
        vm.locations = locationsService.data;
        vm.canDelete = false;
        vm.remove = remove;

        ////////////////

        /**
         * Handles removing location from the list of locations
         * @param index
         */
        function remove(index) {
            locationsService.toggle(locationsService.data[index]);
        }
    }
}());
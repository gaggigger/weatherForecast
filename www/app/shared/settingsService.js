/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.factory('settingsService', settingsService);

    settingsService.$inject = ['$log'];

    /* @ngInject */
    function settingsService($log) {
        var SETTINGS_KEY = 'settings',
            service = {
                settings: {
                    units: 'us',
                    days: 8
                },
                storeSettings: storeSettings
            };

        activate();

        return service;

        // region Implementation

        /**
         * Called on service initialization and loads setting from local storage
         */
        function activate() {
            try {
                service.settings = angular.fromJson(localStorage.getItem(SETTINGS_KEY)) || service.settings;
            } catch (err) {
                $log.error('Failed to get settings from localStorage. Error: ' + err);
            }
        }

        /**
         * Persists settings to local storage
         */
        function storeSettings() {
            $log.log('persisting settings information: ' + angular.toJson(service.settings));
            localStorage.setItem(SETTINGS_KEY, angular.toJson(service.settings));
        }

        // endregion
    }

}(angular.module('weatherApp.shared')));
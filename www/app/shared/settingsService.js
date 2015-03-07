/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.factory('settingsService', settingsService);

    function settingsService() {
        var service = {
            units: 'si',
            days: 8
        };

        return service;
    }

}(angular.module('weatherApp.shared')));
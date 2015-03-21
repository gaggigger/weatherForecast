/**
 * Created by Vlad on 2/28/2015.
 */

(function (app) {
    'use strict';

    app.config(function ($stateProvider, $urlRouterProvider, locationsServiceProvider) {
        $stateProvider
            .state('search', {
                url: '/search',
                controller: 'SearchCtrl as vm',
                templateUrl: 'app/search/search.html'
            })
            .state('settings', {
                url: '/settings',
                controller: 'SettingsCtrl as vm',
                templateUrl: 'app/settings/settings.html'
            })
            .state('weather', {
                cache: false,
                url: '/weather?city&lat&lng',
                controller: 'WeatherCtrl as vm',
                templateUrl: 'app/weather/weather.html'
            });

        /**
         * Checks if there are location available and if there are any locations then redirect to weather
         * directory, otherwise take it to search page
         */
        $urlRouterProvider.when('', function ($location) {
            var locations = locationsServiceProvider.getLocations();

            if (locations == null || locations.length === 0) {
                $location.url('/search');
            } else {
                $location.url('/weather');
            }
            return true;
        });

        // fallback directory
        $urlRouterProvider.otherwise('/search');
    });

})(angular.module('weatherApp'));
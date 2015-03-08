/**
 * Created by Vlad on 2/28/2015.
 */

(function (app) {
    'use strict';

    app.config(function($stateProvider, $urlRouterProvider){
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
               url: '/weather/:city/:lat/:lng',
               controller: 'WeatherCtrl as vm',
               templateUrl: 'app/weather/weather.html'
           });

        $urlRouterProvider.otherwise('/search');
    });
}(angular.module('weatherApp')));
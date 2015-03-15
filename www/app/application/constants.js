/**
 * Created by Vlad on 3/7/2015.
 */

(function (app) {
    'use strict';

    app.constant('apiEndpoints', {
        FORECAST_API: '/api/forecast/',
        GOOGLE_MAPS_API: 'http://maps.googleapis.com/maps/api/geocode/json'
    }).constant('storage', {
        LOCATIONS_KEY: 'locations'
    });

}(angular.module('weatherApp')));
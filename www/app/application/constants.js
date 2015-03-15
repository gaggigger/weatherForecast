/**
 * Created by Vlad on 3/7/2015.
 */

(function (app) {
    'use strict';

    app.constant('apiEndpoints', {
        FORECAST_API: 'https://api.forecast.io/forecast/1e790b156a6df458aaf21fed582486e7/',
        GOOGLE_MAPS_API: 'http://maps.googleapis.com/maps/api/geocode/json'
    });

}(angular.module('weatherApp')));
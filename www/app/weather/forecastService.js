/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.factory('forecastService', forecastService);

    forecastService.$inject = ['$http', 'settingsService', 'apiEndpoints'];

    /* @ngInject */
    function forecastService($http, settingsService, apiEndpoints) {
        var service = {
                forecast: forecast
            };

        return service;

        ////////////////

        function forecast(location) {
            return $http.get(apiEndpoints.FORECAST_API + location.lat + ',' + location.lng,
                {params: {units: settingsService.settings.units}}).then(function(response){
                    if (response.status === 200) {
                        return response.data;
                    } else {
                        throw 'Failed to get forecast data from weather service';
                    }
                });
        }
    }

}(angular.module('weatherApp')));
/**
 * Created by Vlad on 2/28/2015.
 */

(function (app) {
    'use strict';

    app.factory('mapsService', mapsService);

    mapsService.$inject = ['$http', '$log', 'apiEndpoints'];

    /* @ngInject */
    function mapsService($http, $log, apiEndpoints) {
        return {
            geoCode: geoCode
        };

        ////////////////

        /**
         * Method to handle searching from geocoding API using the term and storing scope
         * @param params Location parameters
         * @returns {HttpPromise} Promise to google maps api
         */
        function geoCode(params) {
            return $http.get(apiEndpoints.GOOGLE_MAPS_API, params).then(function(response){
                if (response.status === 200) {
                    return response.data.results;
                } else {
                    throw 'Failed to get geo location data from Google Maps server';
                }
            });
        }
    }

}(angular.module('weatherApp')));
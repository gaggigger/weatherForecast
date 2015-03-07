/**
 * Created by Vlad on 2/28/2015.
 */

(function (app) {
    'use strict';

    app.controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$log', 'mapsService'];

    /* @ngInject */
    function SearchCtrl($log, mapsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = 'Find Locations';
        vm.model = {term: ''};
        vm.search = search;

        ////////////////

        /**
         * Searches for geo location information
         */
        function search() {
            // TODO: turn on busy animation
            var params = {params: {
                address: vm.model.term
            }};
            mapsService.geoCode(params).then(function(results){
                vm.results = results;
            }).catch(function(err){
                // TODO: add error message to the user
                $log.error(err);
            }).finally(function(){
                // TODO: turn off busy animation
            });
        }
    }
}(angular.module('weatherApp')));
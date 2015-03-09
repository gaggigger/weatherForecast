/**
 * Created by Vlad on 2/28/2015.
 */

(function (app) {
    'use strict';

    app.controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$log', '$ionicLoading', 'mapsService'];

    /* @ngInject */
    function SearchCtrl($log, $ionicLoading, mapsService) {
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
            $ionicLoading.show();

            var params = {params: {
                address: vm.model.term
            }};
            mapsService.geoCode(params).then(function(results){
                vm.results = results;
            }).catch(function(err){
                $ionicLoading.show({
                    template: 'Could not get geo code from the server',
                    duration: 3000
                });
                $log.error(err);
            }).finally(function(){
                $ionicLoading.hide();
            });
        }
    }
}(angular.module('weatherApp')));
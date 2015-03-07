/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.controller('LeftMenuCtrl', LeftMenuCtrl);

    LeftMenuCtrl.$inject = ['locationsService'];

    /* @ngInject */
    function LeftMenuCtrl(locationsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.locations = locationsService.locations;
        vm.title = 'Weather';
    }
}(angular.module('weatherApp')));
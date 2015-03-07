/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.controller('WeatherCtrl', weatherCtrl);

    weatherCtrl.$inject = ['$scope', '$stateParams', '$log', '$ionicActionSheet', '$ionicModal', 'settingsService', 'forecastService', 'locationsService'];

    /* @ngInject */
    function weatherCtrl($scope, $stateParams, $log, $ionicActionSheet, $ionicModal, settingsService, forecastService, locationsService) {
        /* jshint validthis: true */
        // TODO: check how to eliminate dependency on document object
        var vm = this,
            barHeight = document.getElementsByTagName('ion-header-bar')[0].clientHeight,
            NUMBER_OF_PAGES = 3;

        vm.params = $stateParams;
        vm.settings = settingsService;
        vm.getWidth = getWidth;
        vm.getHeight = getHeight;
        vm.getTotalHeight = getTotalHeight;
        vm.showOptions = showOptions;
        vm.hideModal = hideModal;

        activate();

        //////////////

        /**
         * Activates controller and calls initial action, to get forecast information
         */
        function activate() {
            // TODO: turn on busy animation
            var params = {lat: $stateParams.lat, lng: $stateParams.lng};

            forecastService.forecast(params).then(function (result) {
                $log.log(angular.toJson(result));
                vm.forecast = result;
            }).catch(function (err) {
                // TODO: add error message to the user
                $log.error(err);
            }).finally(function () {
                // TODO: turn off busy animation
            });
        }

        /**
         * gets window width
         * @returns {string}
         */
        function getWidth() {
            // TODO: check how to eliminate dependency on window
            return window.innerWidth + 'px';
        }

        /**
         * Gets window height without the header bar
         * @returns {string}
         */
        function getHeight() {
            // TODO: check how to remove dependency on window
            return parseInt(window.innerHeight - barHeight) + 'px';
        }

        /**
         * Gets the total height by multiplying the height of the space by the number of pages
         * @returns {string}
         */
        function getTotalHeight() {
            // TODO: check how to remove dependency on window
            return parseInt(parseInt(getHeight()) * NUMBER_OF_PAGES) + 'px';
        }

        /**
         * Used to setup and show an action sheet.
         */
        function showOptions() {
            $ionicActionSheet.show({
                buttons: actionButtons(),
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if (index === 0) {
                        if (this.buttons[0].id === 1) {
                            locationsService.removeLocation($stateParams);
                        } else {
                            locationsService.addLocation($stateParams);
                        }
                    } else if (index === 1) {
                        locationsService.primary($stateParams);
                    } else if (index === 2) {
                        showModal();
                    }
                    return true;
                }
            })
        }

        /**
         * Dynamically creates action buttons
         */
        function actionButtons() {
            // find out if location already in favorites
            var index = locationsService.getIndex($stateParams);
            var buttons = [];

            if (index >= 0) {
                // location already in favorites
                buttons.push({id: 1, text: 'Remove from Favorites'})
            } else {
                buttons.push({id: 2, text: 'Add to Favorites'})
            }

            buttons.push(
                {id: 3, text: 'Set as Primary'},
                {id: 4, text: 'Sunrise Sunset chart'}
            );

            return buttons;
        }

        /**
         * Creates a new modal from a template url, pass current scope to it.
         */
        $ionicModal.fromTemplateUrl('app/weather/modal-chart.html', {
            scope: $scope
        }).then(function (modal) {
            vm.modal = modal;
        });

        /**
         * Calculates sunrise and sunset for each day in the year based on day, lan and lng
         */
        function showModal() {
            if (vm.modal) {
                var days = [];
                var day = Date.now();
                for (var i = 0; i < 365; i++) {
                    day += 1000 * 60 * 60 * 24;
                    days.push(SunCalc.getTimes(day, vm.params.lat, vm.params.lng));
                }
                vm.chart = days;
                vm.modal.show();
            }
        }

        function hideModal() {
            vm.modal.hide();
        }

        /**
         * remove modal view from memory to prevent memory leaks
         */
        $scope.$on('$destroy', function () {
            $log.debug('modal charts destroyed');
            vm.modal.remove();
        })
    }
}(angular.module('weatherApp')));
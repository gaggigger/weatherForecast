/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.controller('WeatherCtrl', weatherCtrl);

    weatherCtrl.$inject = ['$scope', '$stateParams', '$log', '$ionicActionSheet', '$ionicModal', '$ionicLoading', 'settingsService', 'forecastService', 'locationsService'];

    /* @ngInject */
    function weatherCtrl($scope, $stateParams, $log, $ionicActionSheet, $ionicModal, $ionicLoading, settingsService, forecastService, locationsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.params = $stateParams;
        vm.settings = settingsService;
        vm.showOptions = showOptions;
        vm.hideModal = hideModal;
        vm.refresh = getForecastData;
        vm.lastTimeRefreshed = Date.now();

        activate();

        //////////////

        /**
         * Activates controller and calls initial action, to get forecast information
         */
        function activate() {
            getForecastData();
        }

        /**
         * Gets data from the server. This function can be triggered on initial page load and when user clicks on data reload
         * @returns {*}
         */
        function getForecastData() {
            var params = {lat: $stateParams.lat, lng: $stateParams.lng};

            $ionicLoading.show();

            return forecastService.forecast(params).then(function (result) {
                $log.log(angular.toJson(result));
                vm.forecast = result;
                vm.lastTimeRefreshed = Date.now();
            }).catch(function (err) {
                $ionicLoading.show({
                    template: 'Could not load weather information from the server',
                    duration: 3000
                });
                $log.error(err);
            }).finally(function () {
                $ionicLoading.hide();
            });
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
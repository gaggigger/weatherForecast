/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.controller('WeatherCtrl', weatherCtrl);

    weatherCtrl.$inject = ['$scope', '$state', '$stateParams', '$log', '$ionicActionSheet', '$ionicModal', '$ionicLoading', '$ionicSlideBoxDelegate', '$filter', 'settingsService', 'forecastService', 'locationsService'];

    /* @ngInject */
    function weatherCtrl($scope, $state, $stateParams, $log, $ionicActionSheet, $ionicModal, $ionicLoading, $ionicSlideBoxDelegate, $filter, settingsService, forecastService, locationsService) {
        /* jshint validthis: true */
        var vm = this;

        vm.params = null;
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
            processRequest();
        }

        /**
         * Checks if there are any parameters are passed and if passed get data for that location
         * If there are no parameters passed, but user has favorite locations, then open first favorite location
         * If there are no location passed and user doesn't have favorite locations then redirect him to search page
         */
        function processRequest() {
            // check for location from parameters or from fav locations
            if (!$stateParams.city && locationsService.locations.length > 0) {
                $stateParams = locationsService.locations[0];
            }

            if ($stateParams.city) {
                vm.params = $stateParams;
                $log.log(angular.toJson($stateParams));
                getForecastData();
            } else {
                $state.go('search');
            }
        }

        /**
         * Gets data from the server. This function can be triggered on initial page load and when user clicks on data reload
         * @returns {*}
         */
        function getForecastData() {
            var params = {lat: $stateParams.lat, lng: $stateParams.lng};

            $ionicLoading.show();

            return forecastService.forecast(params).then(function (result) {
                vm.forecast = result;
                vm.lastTimeRefreshed = Date.now();
            }).catch(function (err) {
                $ionicLoading.show({
                    template: 'Could not load weather information from the server',
                    duration: 3000
                });
                $log.error(err);
            }).finally(function () {
                // this one is required to refresh alerts tab, otherwise it will be invisible, but if user scroll
                // it will be able to get to that tab
                $ionicSlideBoxDelegate.update();
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

        // region Sunrise Sunset

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
                var days = [],
                    dayInfo,
                    dateFilter = $filter('date'),
                    day = Date.now();

                for (var i = 0; i < 365; i++) {
                    day += 1000 * 60 * 60 * 24;
                    dayInfo = SunCalc.getTimes(day, vm.params.lat, vm.params.lng);
                    days.push(dateFilter(dayInfo.sunrise, 'MMM d') +
                    ': ' + dateFilter(dayInfo.sunrise, 'shortTime') +
                    ', ' + dateFilter(dayInfo.sunset, 'shortTime'));
                }

                vm.chart = days;
                vm.modal.show();
            }
        }

        /**
         * Hides modal window
         */
        function hideModal() {
            vm.modal.hide();
        }

        /**
         * remove modal view from memory to prevent memory leaks
         */
        $scope.$on('$destroy', function () {
            vm.modal.remove();
        });

        // endregion
    }
}(angular.module('weatherApp')));
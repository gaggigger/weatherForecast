/**
 * Created by Vlad on 3/1/2015.
 */

(function (app) {
    'use strict';

    app.controller('WeatherCtrl', weatherCtrl);

    weatherCtrl.$inject = ['$scope', '$q', '$stateParams', '$log', '$ionicPopover', '$ionicModal', '$ionicPopup', '$ionicLoading', '$ionicSlideBoxDelegate', '$filter', '$timeout', 'settingsService', 'forecastService', 'locationsService'];

    /* @ngInject */
    function weatherCtrl($scope, $q, $stateParams, $log, $ionicPopover, $ionicModal, $ionicPopup, $ionicLoading, $ionicSlideBoxDelegate, $filter, $timeout, settingsService, forecastService, locationsService) {
        /* jshint validthis: true */
        var vm = this,
            days = [],
            userOptions = [
                {id: 0, title: 'Remove from Favorites'},
                {id: 1, title: 'Add to Favorites'},
                {id: 2, title: 'Set as Primary'},
                {id: 3, title: 'Sunrise Sunset Chart'}
            ],
            popoverView;

        vm.params = null;
        vm.settings = settingsService.settings;
        vm.showOptions = showOptions;
        vm.hideModal = hideModal;
        vm.refresh = getForecastData;
        vm.lastTimeRefreshed = Date.now();
        vm.toggleDay = toggleDay;
        vm.isDayExpanded = isDayExpanded;
        vm.userOptions = userOptions;
        vm.processOption = processOption;
        vm.isLocationInFavorites = locationsService.isLocationInFavorites;

        activate();

        //////////////

        /**
         * Activates controller and calls initial action, to get forecast information
         */
        function activate() {
            processRequest();
            initializeUserOptionsView();
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

            vm.params = $stateParams;
            $log.log(angular.toJson($stateParams));
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

        // region User Options

        /**
         * Initialized popover view
         */
        function initializeUserOptionsView() {
            $ionicPopover.fromTemplateUrl('app/weather/options-dialog.html', {
                scope: $scope
            }).then(function (popover) {
                popoverView = popover;
            });
        }

        /**
         * Shows options dialog. $even it required field, since it provides
         * information about what control was clicked
         * @param $event
         */
        function showOptions($event) {
            popoverView.show($event);
        }

        /**
         * Process user selected option
         * @param option
         */
        function processOption(option) {
            $log.log('user option', option);
            popoverView.hide();

            if (option.id === 0) {
                $ionicPopup.confirm({
                    title: 'Are you sure?',
                    template: 'This will remove ' + $stateParams.city
                }).then(function (response) {
                    if (response) {
                        locationsService.removeLocation($stateParams);
                    }
                });
            } else if (option.id === 1) {
                locationsService.addLocation($stateParams);
                $ionicPopup.alert({
                    title: 'Location saved'
                })
            } else if (option.id === 2) {
                locationsService.primary($stateParams);
                $ionicPopup.alert({
                    title: 'Location set as primary'
                })
            } else if (option.id === 3) {
                showModal();
            }
        }

        /**
         * Cleanup the popover when we're done with it
         */
        $scope.$on('destroy', function () {
            popoverView.remove();
            $log.log('options dialog has been destroyed');
        });

        // endregion User Options

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
         * Calculates sunrise and sunset for each day in the year based on day, lan and lng.
         * If days already calculated then show them again, don't recalculate them
         */
        function showModal() {
            if (vm.modal) {
                if (days.length > 0) {
                    vm.modal.show();
                } else {
                    calculateSunsetSunriseTime().then(function (days) {
                        vm.chart = days;
                        vm.modal.show();
                    });
                }
            }
        }

        /**
         * Calculates sunrise and sunset for particular location
         * @returns {promise|*|qFactory.Deferred.promise|dd.g.promise}
         */
        function calculateSunsetSunriseTime() {
            var deferred = $q.defer(),
                dayInfo,
                dateFilter = $filter('date'),
                day = Date.now();

            $timeout(function () {
                for (var i = 0; i < 365; i++) {
                    day += 1000 * 60 * 60 * 24;
                    dayInfo = SunCalc.getTimes(day, vm.params.lat, vm.params.lng);
                    days.push(dateFilter(dayInfo.sunrise, 'MMM d') +
                    ': ' + dateFilter(dayInfo.sunrise, 'shortTime') +
                    ', ' + dateFilter(dayInfo.sunset, 'shortTime'));
                }
                deferred.resolve(days);
            });

            return deferred.promise;
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

        // region Accordion

        function toggleDay(day) {
            if (isDayExpanded(day)) {
                vm.shownDay = null;
            } else {
                vm.shownDay = day;
            }
        }

        function isDayExpanded(day) {
            return vm.shownDay === day;
        }

        // endregion
    }
}(angular.module('weatherApp')));
/**
 * Created by Vlad on 3/3/2015.
 */

(function (app) {
    'use strict';

    app.filter('icons', icons);

    /**
     * Creates the icons filter, to convert a condition type into an ionicon
     * @returns {Function}. Based on a map of conditions to ionicons, return the icon if found
     */
    function icons() {
        var map = {
            'clear-day': 'ion-ios-sunny',
            'clear-night': 'ion-ios-moon',
            rain: 'ion-ios-rainy',
            snow: 'ion-ios-snowy',
            sleet: 'ion-ios-rainy',
            wind: 'ion-ios-flag',
            fog: 'ion-ios-cloudy',
            cloudy: 'ion-ios-cloudy',
            'partly-cloudy-day': 'ion-ios-partlysunny',
            'partly-cloudy-night': 'ion-ios-cloudy-night'
        };

        return function (icon) {
            return map[icon];
        }
    }
}(angular.module('weatherApp.shared')));
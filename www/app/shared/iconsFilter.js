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
            'clear-day': 'ion-ios7-sunny',
            'clear-night': 'ion-ios7-moon',
            rain: 'ion-ios7-rainy',
            snow: 'ion-ios7-snowy',
            sleet: 'ion-ios7-rainy',
            wind: 'ion-ios7-flag',
            fog: 'ion-ios7-cloudy',
            cloudy: 'ion-ios7-cloudy',
            'partly-cloudy-day': 'ion-ios7-partlysunny',
            'partly-cloudy-night': 'ion-ios7-cloudy-night'
        };

        return function (icon) {
            return map[icon];
        }
    }
}(angular.module('weatherApp.shared')));
/**
 * Created by Vlad on 3/3/2015.
 */

(function (app) {
    'use strict';

    app.filter('timezone', calculateTimezone);

    /**
     * Creates timezone filter, to convert to location timezone
     * @returns {Function}
     */
    function calculateTimezone() {
        return function (input, timezone) {
            if (input && timezone) {
                var time = moment.tz(input * 1000, timezone);
                return time.format('LT');
            }
            return '';
        }
    }
}(angular.module('weatherApp.shared')));
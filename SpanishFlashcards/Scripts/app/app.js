/// <reference path="../../node_modules/angular/angular.js" />

'use strict';

angular.module('app', ['cardData', 'securityData', 'ui.router', 'ui.bootstrap'])
    .filter('pageFilter', function() {
        return function (data, pageNumber, pageSize) {

            var start = (pageNumber - 1) * pageSize;
            return data.slice(Math.max(start, 0), Math.min(start + pageSize, data.length - 1));
        };
    });

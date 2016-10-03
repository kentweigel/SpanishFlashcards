(function iife() {
    'use strict';

    angular.module('securityData', [])
        .factory('securityData', SecurityData);

    SecurityData.$inject = ['$http'];

    function SecurityData($http) {
        var service = this;

        service.login = function (email, password, rememberMe) {
            return $http({
                method: 'POST',
                data: { email: email, password: password, rememberMe: rememberMe },
                url: 'Api/AccountApi/Login/',
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                console.log('Login returned: ' + data.statusText);
                return data.data;
            }, function (error) {
                console.log(error);
                throw error;
            });
        };

        service.logoff = function () {
            return $http({
                method: 'POST',
                url: 'Api/AccountApi/LogOff/',
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                console.log('Logoff returned: ' + data.statusText);
            }, function (error) {
                console.log(error);
                throw error;
            });
        };

        service.currentUser = function () {
            return $http({
                method: 'GET',
                url: 'Api/AccountApi/CurrentUser',
                data: undefined,
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                //console.log(data);
                return data.data;
            }, function (error) {
                console.log(error);
                throw error;
            });
        };

        return service;
    }
}());
(function iife() {
    'use strict';

    angular.module('securityData', [])
        .factory('securityData', SecurityData);

    SecurityData.$inject = ['$http', '$q'];

    function SecurityData($http, $q) {
        var service = this;
        service.errorMessage;

        service.changePassword = function (oldPassword, newPassword, confirmPassword, token) {
            return $http({
                method: 'POST',
                url: 'Api/AccountApi/ChangePassword/',
                data: { oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword },
                headers: { '__RequestVerificationToken': token },
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                //console.log(data);
                return data.data;
            }, function (error) {
                console.log(error.data.message);
                service.errorMessage = error.data.message;
                return $q.reject(error.data.message);
            });
        };

        service.clearErrorMessage = function () {
            service.errorMessage = undefined;
        };

        service.currentUser = function () {
            return $http({
                method: 'GET',
                url: 'Api/AccountApi/CurrentUser/',
                data: undefined,
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                //console.log(data);
                return data.data;
            }, function (error) {
                console.log(error.data.message);
                service.errorMessage = error.data.message;
                return $q.reject(error.data.message);
            });
        };

        service.login = function (email, password, rememberMe, token) {
            return $http({
                method: 'POST',
                data: { email: email, password: password, rememberMe: rememberMe },
                url: 'Api/AccountApi/Login/',
                headers: { '__RequestVerificationToken': token },
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                //localStorage.setItem('__RequestVerificationToken', data.config.headers['__RequestVerificationToken']);
                console.log('Login successful');
                return data.data;
            }, function (error) {
                console.log(error.data.message);
                service.errorMessage = error.data.message;
                return $q.reject(error.data.message);
            });
        };

        service.logoff = function (token) {
            return $http({
                method: 'POST',
                url: 'Api/AccountApi/LogOff/',
                headers: { '__RequestVerificationToken': token },
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                //localStorage.setItem('__RequestVerificationToken', data.config.headers['__RequestVerificationToken']);
                console.log('Logoff successful');
                return data.data;
            }, function (error) {
                console.log(error.data.message);
                service.errorMessage = error.data.message;
                return $q.reject(error.data.message);
            });
        };

        service.register = function (email, password, confirmPassword, token) {
            return $http({
                method: 'POST',
                data: { email: email, password: password, confirmPassword: confirmPassword },
                url: 'Api/AccountApi/Register/',
                headers: { '__RequestVerificationToken': token },
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                console.log('Register returned: ' + data.statusText);
                return data.data;
            }, function (error) {
                console.log(error.data.message);
                service.errorMessage = error.data.message;
                return $q.reject(error.data.message);
            });
        };

        service.setPassword = function (password, confirmPassword, token) {
            return $http({
                method: 'POST',
                url: 'Api/AccountApi/SetPassword/',
                data: { newPassword: password, confirmPassword: confirmPassword },
                headers: { '__RequestVerificationToken': token },
                params: { timeout: 300 }
            }).then(function (data, status, headers, config) {
                //console.log(data);
                return data.data;
            }, function (error) {
                console.log(error.data.message);
                service.errorMessage = error.data.message;
                return $q.reject(error.data.message);
            });
        };

        return service;
    }
}());
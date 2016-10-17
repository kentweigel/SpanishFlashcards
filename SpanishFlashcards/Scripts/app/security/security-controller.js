(function iife() {
    'use strict';

    angular.module('app')
        .controller('SecurityController', SecurityController);

    SecurityController.$inject = ['securityData', '$state', '$window', '$q'];

    function SecurityController(securityData, $state, $window, $q) {
        var vm = this;
        vm.userName;
        vm.email;
        vm.password;
        vm.newPassword;
        vm.confirmPassword;
        vm.rememberMe;

        //vm.returnState = $state.params.returnState;
        //$('.focus').focus(); // This doesn't work here. Moved to routing.js as $viewContentLoaded event handler.
        getCurrentUser();

        // notDefined = false; // Test to make sure ESLint is working

        vm.changePassword = function () {
            securityData.clearErrorMessage();
            var promise = securityData.changePassword(vm.password, vm.newPassword, vm.confirmPassword, getRequestVerificationToken())
                .then(function (user) {
                    vm.userName = user;
                    console.log('securityData.changePassword successful.');
                    if ($state.params.returnState) {
                        $state.go($state.params.returnState);
                    }
                }, function (errorMessage) {
                    vm.userName = undefined;
                    console.log('securityData.changePassword failed:' + errorMessage);
                    return $q.reject(errorMessage);
                });

            vm.password = undefined;
            vm.newPassword = undefined;
            vm.confirmPassword = undefined;

            return promise;
        };

        vm.getUserName = function () {
            return vm.userName;
        };

        vm.getErrorMessage = function () {
            return securityData.errorMessage;
        };

        vm.login = function () {
            securityData.clearErrorMessage();
            var promise = securityData.login(vm.email, vm.password, vm.rememberMe, getRequestVerificationToken())
                .then(function (data) {
                    vm.userName = vm.email;
                    vm.email = undefined;
                    console.log('securityData.login successful.');
                    $window.location.reload(true);
                    if ($state.params.returnState) {
                        $state.go($state.params.returnState);
                    } else {
                        $state.go('home');
                    }
                    //$('#antiForgeryTokenWrapper').html(data.data);
                    //$state.go($state.$current, null, { reload: true });    // Necessary to refresh anti-forgery token
                }, function (errorMessage) {
                    vm.userName = undefined;
                    console.log('securityData.login failed: ' + errorMessage);
                    return $q.reject(errorMessage);
                });

            vm.password = undefined;

            return promise;
        };

        vm.logoff = function () {
            securityData.clearErrorMessage();
            return securityData.logoff(getRequestVerificationToken())
                .then(function (data) {
                    vm.userName = undefined;
                    $state.go('home');
                    $window.location.reload(true);
                    //$state.reload();
                    //$('#antiForgeryTokenWrapper').html(data.data);
                }, function (errorMessage) {
                    //$state.reload();
                    console.log('securityData.logoff failed: ' + errorMessage);
                    return $q.reject(errorMessage);
                });
        };

        vm.register = function () {
            var promise = securityData.register(vm.email, vm.password, vm.confirmPassword, getRequestVerificationToken())
                .then(function (data) {
                    vm.username = data.data;
                    $window.location.reload(true);
                }, function (errorMessage) {
                    console.log('securityData.register failed: ' + errorMessage);
                    return $q.reject(errorMessage);
                });

            vm.password = undefined;
            vm.confirmPassword = undefined;

            return promise;
        };

        vm.setPassword = function () {
            securityData.clearErrorMessage();
            var promise = securityData.setPassword(vm.newPassword, vm.confirmPassword, getRequestVerificationToken())
                .then(function () {
                    vm.userName = undefined;
                    //$state.go('home');
                    //$window.location.reload();
                }, function (errorMessage) {
                    console.log('securityData.setPassword failed: ' + errorMessage);
                    return $q.reject(errorMessage);
                });

            //vm.password = undefined;
            vm.newPassword = undefined;
            vm.confirmPassword = undefined;

            return promise;
        };

        function getCurrentUser() {
            securityData.currentUser()
                .then(function (data) {
                    vm.userName = data;
                });
        }

        function getRequestVerificationToken() {
            var tokenInputs = document.getElementsByName('__RequestVerificationToken');
            if (tokenInputs.length > 0) {
                return tokenInputs[0].value;
            } else {
                return undefined;
            }
        }
    }
}());
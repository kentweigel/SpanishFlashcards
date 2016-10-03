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
        vm.rememberMe;

        //vm.returnState = $state.params.returnState;
        $('.focus').focus();
        getCurrentUser();

        function getCurrentUser() {
            securityData.currentUser()
                .then(function (data) {
                    vm.userName = data;
                });
        }

        // notDefined = false; // Test to make sure ESLint is working

        vm.login = function () {
            return securityData.login(vm.email, vm.password, vm.rememberMe)
                .then(function (user) {
                    vm.userName = user;
                    console.log('securityData.login successful.');
                    if ($state.params.returnState) {
                        $state.go($state.params.returnState);
                    }
                }, function(error) {
                    vm.userName = undefined;
                    console.log('securityData.login failed.');
                    return $q.reject(error);
                });
        };

        vm.logoff = function () {
            return securityData.logoff()
                .then(function () {
                    vm.userName = undefined;
                    //$state.go('home');
                    $window.location.reload();
                }, function (error) {
                    console.log('securityData.logoff failed.');
                    return $q.reject(error);
                });
        };

        vm.getUserName = function () {
            return vm.userName;
        };
    }
}());
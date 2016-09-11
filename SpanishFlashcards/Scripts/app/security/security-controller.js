(function iife() {
    'use strict';

    angular.module('app')
        .controller('SecurityController', SecurityController);

    SecurityController.$inject = ['securityData', '$state', '$window'];

    function SecurityController(securityData, $state, $window) {
        var vm = this;
        vm.userName = undefined;
        //vm.returnState = $state.params.returnState;
        $('.focus').focus();
        getCurrentUser();

        function getCurrentUser() {
            securityData.currentUser()
                .then(function (data) {
                    vm.userName = data;
                })
        }

        vm.login = function () {
            var emailBox = document.getElementById('email');
            var passwordBox = document.getElementById('password');
            var rememberMeBox = document.getElementById('rememberMe');

            securityData.login(emailBox.value, passwordBox.value, rememberMeBox.checked)
                .then(function () {
                    vm.userName = emailBox.value;
                    if ($state.params.returnState) {
                        $state.go($state.params.returnState);
                    }
                });
        }

        vm.logoff = function () {
            securityData.logoff()
                .then(function () {
                    vm.userName = undefined;
                    //$state.go('home')
                    $window.location.reload();
                });
        }
    }
}());
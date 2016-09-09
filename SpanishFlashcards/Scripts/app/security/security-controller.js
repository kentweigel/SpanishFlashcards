(function iife() {
    'use strict';

    angular.module('app')
        .controller('SecurityController', SecurityController);

    SecurityController.$inject = ['securityData', '$state'];

    function SecurityController(securityData, $state) {
        var vm = this;
        vm.userName = undefined;
        //vm.returnState = $state.params.returnState;
        $('.focus').focus();    // Give focus to selected control, since utility.js functions don't run on ui-router state change, only on document ready.
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
                    $state.go('home')
                });
        }
    }
}());
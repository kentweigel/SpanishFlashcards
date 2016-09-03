(function iife() {
    angular.module('app')
        .directive('cardPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Card/Single'
            }
        })
        .directive('aboutPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Home/About'
            }
        })
        .directive('contactPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Home/Contact'
            }
        })
        .directive('managePanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Manage/Index'
            }
        })
        .directive('registerPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Account/Register'
            }
        })
        .directive('loginPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Account/Login'
            }
        })
        .directive('adminPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Card/Index'
            }
        })
        .directive('createCardPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Card/Create'
            }
        })
        .directive('editCardPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Card/Edit'
            }
        })
        .directive('deleteCardPanel', function () {
            return {
                restrict: 'E',
                templateUrl: '/Card/Delete'
            }
        })
})();
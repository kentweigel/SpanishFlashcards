/// <reference path="../angular.js" />
/// <reference path="../angular-ui-router.js" />

(function iife() {
    'use strict';

    angular.module('app', ['cardData', 'securityData', 'ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");

            $stateProvider
                .state('home', {
                    url: "/home",
                    templateUrl: "Card/Single",
                    controller: "CardController",
                    controllerAs: "ctrl"
                })
                .state('admin', {
                    url: "/admin",
                    cache: false,
                    templateUrl: "Card/Index",
                    controller: "CardAdminController",
                    controllerAs: "ctrl"
                })
                //.state('admin.create', { // Nesting is when you have another <ui-view> tag on the admin page. We don't have that, so don't use nested views.
                .state('create', {
                    url: "/create",
                    templateUrl: "Card/Create",
                    controller: "CardAdminController",
                    controllerAs: "ctrl"
                })
                .state('edit', {
                    url: "/edit/:id",
                    templateProvider: ['$stateParams', '$templateRequest', function ($stateParams, $templateRequest) {
                        return $templateRequest("Card/Edit/" + $stateParams.id);
                    }],
                    controller: "CardAdminController",
                    controllerAs: "ctrl"
                })
                .state('delete', {
                    url: "/delete/:id",
                    templateProvider: ['$stateParams', '$templateRequest', function ($stateParams, $templateRequest) {
                        return $templateRequest("Card/Delete/" + $stateParams.id);
                    }],
                    controller: "CardAdminController",
                    controllerAs: "ctrl"
                })
                .state('login', {
                    url: "/login/:returnState",
                    templateUrl: "Account/Login"
                })
                .state('logoff', {
                    url: "/logoff",
                    templateUrl: "Account/LogOff"
                })
                .state('register', {
                    url: "/register",
                    templateUrl: "Account/Register"
                })
                .state('manage', {
                    url: "/manage",
                    templateUrl: "Manage/Index"
                })
                .state('about', {
                    url: "/about",
                    templateUrl: "Home/About"
                })
                .state('contact', {
                    url: "/contact",
                    templateUrl: "Home/Contact"
                });
        })
        //.run(function ($rootScope, $window) {
        //    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //        if (toState.external) {
        //            // This is great for navigating to another page entirely. See http://stackoverflow.com/questions/30220947/how-would-i-have-ui-router-go-to-an-external-link-such-as-google-com
        //            event.preventDefault();
        //            $window.open(toState.url, '_self');
        //        }
        .run(function ($rootScope, $state) {
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
                if (error.status === 403) { // i.e. Forbidden
                    console.log('Forbidden was returned when switching to state named: ' + toState.name + '. Rerouting to login page.');
                    event.preventDefault();
                    $state.go('login', { returnState: toState.name });
                }
            })
        });
    //.run(function ($rootScope) {
    //    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //        $('.focus').focus();    // This executes, but the focus change doesn't work. I assume that it is not finding elements with the class "focus". (wrong scope?)
    //    })
}());
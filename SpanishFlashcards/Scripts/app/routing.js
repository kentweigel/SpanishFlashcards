/// <reference path="../angular.js" />
/// <reference path="../angular-ui-router.js" />

(function iife() {
    'use strict';

    angular.module('app', ['cardData', 'ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");

            $stateProvider
                .state('home', {
                    url: "/home",
                    templateUrl: "/Card/Single",
                    controller: "CardController",
                    controllerAs: "ctrl"
                })
                .state('admin', {
                    url: "/admin",
                    templateUrl: "/Card/Index",
                    controller: "AdminController",
                    controllerAs: "ctrl"
                })
                .state('admin.edit', {
                    url: "/edit",
                    params: {
                        id: null
                    },
                    templateUrl: "/Card/Edit"
                })
                .state('admin.create', {
                    url: "/admin.create",
                    templateUrl: "/Card/Create",
                    controller: "AdminController",
                    controllerAs: "ctrl"
                })
                .state('login', {
                    url: "/login",
                    templateUrl: "/Account/Login"
                })
                .state('logoff', {
                    url: "/logoff",
                    templateUrl: "/Account/LogOff"
                })
                .state('register', {
                    url: "/register",
                    templateUrl: "/Account/Register"
                })
                .state('manage', {
                    url: "/manage",
                    templateUrl: "/Account/Login"
                })
                .state('about', {
                    url: "/about",
                    templateUrl: "/Home/About"
                })
                .state('contact', {
                    url: "/contact",
                    templateUrl: "/Home/Contact"
                });
        });
})();
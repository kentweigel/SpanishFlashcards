(function () {
    'use strict';

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    alert('THIS IS NOT USED, CURRENTLY!!');
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    angular.module('app', ['ngRoute', 'cardData'])
        .controller('HomeController', homeController)
        .config(configFunction);

    configFunction.$inject = ['$routeProvider', '$locationProvider'];

    function homeController() {
        var vm = this;
    }

    function configFunction($routeProvider, $locationProvider) {
        //$routeProvider
        //    .when('/', {
        //        templateUrl: '/Content/SingleCard.html'
        //    })
        //    .when('/Admin', {
        //        templateUrl: '/Admin/Index'
        //    })
        //    .otherwise({
        //        redirectTo: '/'
        //    });

        $routeProvider
            .when('/', {
                templateUrl: 'Card/Single',
                controller: 'CardController',
                controllerAs: 'controller'
            })
            .when('/Admin', {
                templateUrl: 'Admin/Index',
                controller: 'CardAdminController',
                controllerAs: 'controller'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }
})();
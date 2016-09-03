(function iife() {
    angular.module("securityData", [])
        .controller("securityData", SecurityData);

    SecurityData.$inject = ['$http', '$q'];

    function SecurityData($http, $q) {
        var service = this;

        service.login = function(;


    }
})();

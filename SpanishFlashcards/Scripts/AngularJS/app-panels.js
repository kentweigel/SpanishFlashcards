(function () {
    angular.module('app')
        .directive('appPanels', appPanels);

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    alert('THIS IS NOT USED, CURRENTLY!!');
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    function appPanels() {
        return {
            restrict: 'E',
            templateUrl: 'app-panels.html'
        }
    }
})();
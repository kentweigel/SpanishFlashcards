(function () {
    angular.module('app', ['cardData', '$location'])
        .controller('NavController', NavController);

    NavController.$inject = ['$location'];

    function NavController($location) {
        var vm = this;

        vm.currentPanelName = 'Card';

        vm.setCurrentPanel = function (panelName) {
            vm.currentPanelName = panelName;
            $location.url = panelName;
        }

        vm.isSelected = function (panelName) {
            return vm.currentPanelName === panelName;
        }
    }
})();
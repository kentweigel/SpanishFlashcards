(function iife() {
    angular.module('app')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['cardData'];

    function AdminController(cardData) {
        var vm = this;

        vm.cards = [];
        vm.partsOfSpeech = [];
        vm.currentCard = undefined;
        //vm.selectedPartOfSpeech = undefined;

        getCards();
        getPartsOfSpeech();

        function getCards() {
            cardData.getCards()
                .then(function (result) {
                    vm.cards = result;

                    if (vm.cards.length > 0) {
                        vm.setCurrentCard(0);
                    }
                    else {
                        vm.currentCard = undefined;
                        //vm.selectedPartOfSpeech = 'Noun';
                    }
                })
                .catch(function (error) {
                    alert('Call to AdminController.getCards failed, status: ' + error.status + ' : ' + error.statusText);
                });
        }

        // "Grief" note: Initial value is always a little tricky in AngularJS select box usage, apparently, but this scenario
        // wasn't working with any of the workarounds. A (if not "the") problem was that I was retrieving the list of PartsOfSpeech
        // as a list of objects. When I changed the WebAPI to furnish an array of strings instead of objects, the problems went
        // away. Supposedly you are supposed to be able to use an array of objects, but nothing I tried worked. The problem is
        // that it was trying to match on the object itself, at least in many of the attempts, and AngularJS was always putting
        // in an extra option (first in the list) with the value "?" and selected="selected", so the select box initially came
        // up blank. Yes, I tried "select as" and "track by" and all the things you're supposed to try, except I refused to
        // try building my own option list with ng-options, since many comments have said that won't work, or you shouldn't or...
        function getPartsOfSpeech() {
            cardData.getPartsOfSpeech()
                .then(function (result) {
                    vm.partsOfSpeech = result;
                })
                .catch(function (error) {
                    alert('Call to AdminController.getPartsOfSpeech failed, status: ' + error.status + ' : ' + error.statusText);
                });
        }

        vm.setCurrentCard = function (index) {
            vm.currentCard = vm.cards[index];
            //vm.selectedPartOfSpeech = vm.currentCard.PartOfSpeech;
        }

        vm.addCard = function () {
            // Finish this.
        }

        vm.updateCard = function () {
            // Finish this.
        }

        vm.deleteCard = function () {
            // Finish this.
        }
    }
})();
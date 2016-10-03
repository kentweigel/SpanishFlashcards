/// <reference path="../../node_modules/angular/angular.js" />

(function () {
    'use strict';

    angular.module('app')
        .controller('CardAdminController', CardAdminController);

    CardAdminController.$inject = ['cardData', 'securityData', '$state'];

    function CardAdminController(cardData, securityData, $state) {
        var vm = this;

        vm.cards = [];
        vm.partsOfSpeech = [];
        vm.currentCard = undefined;

        getCards();
        getPartsOfSpeech();
        $('.focus').focus();

        function getCards() {
            cardData.getCards()
                .then(function (result) {
                    vm.cards = result;

                    // If a card id was passed in, then set currentCard.
                    if (vm.cards.length > 0) {
                        if ($state.params.id) {
                            vm.currentCard = vm.cards.find(function (c) { return c.id === Number($state.params.id); });
                        }
                    }
                    else {
                        vm.currentCard = undefined;
                    }
                })
                .catch(function (error) {
                    alert('Call to CardAdminController.getCards failed, status: ' + error.status + ' : ' + error.statusText);
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
                    alert('Call to CardAdminController.getPartsOfSpeech failed, status: ' + error.status + ' : ' + error.statusText);
                });
        }

        //vm.setCurrentCard = function (index) {
        //    vm.currentCard = vm.cards[index];
        //    //vm.selectedPartOfSpeech = vm.currentCard.PartOfSpeech;
        //}

        vm.saveNewCard = function () {
            var spanishBox = document.getElementById('spanish');
            var englishBox = document.getElementById('english');
            var partOfSpeechSelect = document.getElementById('partOfSpeech');
            var card = {
                id: -1,
                spanish: spanishBox.value,
                english: englishBox.value,
                partOfSpeech: partOfSpeechSelect.value
            };

            cardData.postCard(card)
                .then(function (result) {
                    console.log('saveNewCard returned success.');
                    $state.go('admin');
                })
                .catch(function (error) {
                    console.log('saveNewCard returned failure: ' + error.data.message);
                    alert('Unable to save new card on the server.');
                });
        };

        vm.saveCurrentCard = function () {
            cardData.putCard(vm.currentCard)
                .then(function (result) {
                    console.log('saveCurrentCard returned success.');
                    $state.go('admin');
                })
                .catch(function (error) {
                    console.log('saveCurrentCard returned failure.');
                    alert('Unable to save card changes on the server.');
                });
        };

        vm.deleteCard = function (id) {
            cardData.deleteCard(id)
                .then(function (result) {
                    console.log('deleteCurrentCard returned success.');
                    $state.go('admin');
                })
                .catch(function (error) {
                    console.log('deleteCurrentCard returned failure.');
                    alert('Unable to delete card on the server.');
                });
        };

        //vm.login = function (form) {
        //    // This is only here to test the theory that when not authorized for an MVC page
        //    // it redirects to Login page and ui-router still uses the controller for the state
        //    // that was linked to the unauthorized page. Result: that is truly the case. Need to get
        //    // MVC to return 403 rather than redirect, and then trap in ui-router resolve??
        //    securityData.login(email, password, rememberMe);
        //}
    }
}());
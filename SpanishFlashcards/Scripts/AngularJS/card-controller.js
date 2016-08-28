/*
Cards are initially sorted by score. When a card is dismissed, shift its position ahead 5 places if the user indicates that their answer was incorrect.  
The score is calculated every time it is used, which shouldn't become a performance problem until the millions of cards range.

Start by sorting the queue by this formula: #Cards * CorrectCount / TotalCount, testing for TotalCount = 0 before dividing. (set to zero if so)

When dismissing card, if incorrect, then the card should be shown again soon so the user doesn't forget the correct answer, but not right away, 
so there should be a minimum and maximum offset from the current position. (say 5 and 10) Use circular queue pattern and wrap this offset.

If correct, then just let the index advance to the next card, effectively putting the correctly answered card at the end of the queue.

When wrapping in circular queue, decide whether to recalculate score. I lean toward yes. Currently that does not happen.
*/

(function () {
    'use strict';

    angular.module('app')
        .controller('CardController', CardController);
        // It worked having the directive here, but I hadn't done the same in the card-admin directive
        // and yet it was still sharing this controller somehow. The references to card-panel and
        // admin-panel are at the same level so I don't understand that. So I decided to explicitly 
        // share the same card controller and do away with the admin controller.
        //.directive('cardPanel', function () {
        //    return {
        //        restrict: 'E',
        //        templateUrl: '/Card/Single',
        //        controller: CardController,
        //        controllerAs: 'controller'
        //    }
        //});

    CardController.$inject = ['$filter', 'cardData'];

    function CardController($filter, cardData) {
        var vm = this;

        vm.cardsOriginal = [];
        vm.cards = [];
        vm.currentIndex = 0;
        vm.spanishToEnglish = true;
        vm.showStatistics = false;
        vm.allowHints = false;
        vm.includeNouns = true;
        vm.includeVerbs = false;
        vm.includeAdjectives = true;
        vm.includeAdverbs = true;
        vm.includePronouns = true;
        vm.includePrepositions = true;
        vm.includeConjunctions = true;
        vm.showingQuestion = true;

        getCards();

        function getCards() {
            cardData.getCards()
                .then(function (result) {
                    vm.cardsOriginal = result;
                    //vm.cards = result;
                    vm.filterChange();
                    if (vm.cards.length > 0) {
                        vm.currentIndex = 0;
                    }
                    else {
                        vm.currentIndex = undefined;
                    }
                })
                .catch(function (error) {
                    alert('Call to CardController.getCards failed, status: ' + error.status + ' : ' + error.statusText);
                });
        }

        function postHistory(cardId, correct, hintUsed) {
            cardData.postHistory(cardId, correct, hintUsed)
                .then(function (result) {
                    console.log('postHistory returned success.');
                })
                .catch(function (error) {
                    console.log('postHistory returned failure.');
                    alert('postHistory returned failure.');
                })
        }

        function sortCards() {
            vm.cards.sort(function (a, b) {
                return vm.getCardScore(a) - vm.getCardScore(b);
                //return (a.TotalCount + a.CorrectCount) * b.TotalCount - (b.TotalCount + b.CorrectCount) * a.TotalCount;
            });
        }

        vm.getCardScore = function (card) {
            if (card.TotalCount == 0) {
                return 0;
            }
            else {
                return 1 + card.CorrectCount / card.TotalCount;
                //return this.cards.length * card.CorrectCount / card.TotalCount;
            }
        }

        vm.flipClick = function () {
            // Show answer
            vm.showingQuestion = false;
        }

        vm.hintClick = function () {
            alert('No hints have been entered for this card.');
        }

        vm.correctClick = function () {
            try {
                vm.cards[vm.currentIndex].CorrectCount++;
                vm.cards[vm.currentIndex].TotalCount++;
                postHistory(vm.cards[vm.currentIndex].Id, true, false);
                vm.currentIndex++;
                vm.currentIndex %= vm.cards.length;
                //$scope.$apply(); This is unnecessary.

                // Show question
                vm.showingQuestion = true;
            } catch (e) {
                alert(e.message);
            }
        }

        vm.incorrectClick = function () {
            try {
                vm.cards[vm.currentIndex].TotalCount++;
                postHistory(vm.cards[vm.currentIndex].Id, false, false);
                //vm.currentIndex++; Don't do this. Since we are advancing the card, the next card will take it's place and have the same index.
                //vm.currentIndex %= vm.cards.length;

                var movingCard = vm.cards[vm.currentIndex];
                var cardCount = vm.cards.length;
                var offset = 5;
                for (var i = 0; i < offset; i++) {
                    var dest = (vm.currentIndex + i) % cardCount;
                    var src = (vm.currentIndex + i + 1) % cardCount;

                    vm.cards[dest] = vm.cards[src];
                }

                vm.cards[(vm.currentIndex + offset) % cardCount] = movingCard;

                // Show question
                vm.showingQuestion = true;
            } catch (e) {
                alert(e.message);
            }
        }

        vm.filterChange = function () {
            vm.cards = $filter('filter')(vm.cardsOriginal, cardFilter);

            sortCards();
        }

        function cardFilter(card) {
            return (card.PartOfSpeech === 'Noun' && vm.includeNouns) ||
                    (card.PartOfSpeech === 'Verb' && vm.includeVerbs) ||
                    (card.PartOfSpeech === 'Adjective' && vm.includeAdjectives) ||
                    (card.PartOfSpeech === 'Adverb' && vm.includeAdverbs) ||
                    (card.PartOfSpeech === 'Pronoun' && vm.includePronouns) ||
                    (card.PartOfSpeech === 'Preposition' && vm.includePrepositions) ||
                    (card.PartOfSpeech === 'Conjunction' && vm.includeConjunctions);
            }
    }
})();

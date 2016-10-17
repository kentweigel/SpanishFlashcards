/// <reference path="../../node_modules/angular/angular.js" />

(function iife() {
    'use strict';

    angular.module('cardData', [])
        .factory('cardData', CardData);

    CardData.$inject = ['$http', '$q'];

    function CardData($http, $q) {
        var service = this;

        service.cards = [];
        service.partsOfSpeech = [];
        service.errorMessage;

        service.clearErrorMessage = function () {
            service.errorMessage = undefined;
        };

        service.getCards = function () {
            if (service.cards.length > 0) {
                return $q.when(service.cards);
            }
            else {
                return $http.get('Api/CardApi/', { params: { timeout: 300 } })
                    .then(function (data, status, headers, config) {
                        service.cards = data.data;
                        return service.cards;
                    })
                    .catch(function (error) {
                        console.log(error.data.message);
                        service.errorMessage = error.data.message;
                        return $q.reject(error.data.message);
                    });
            }
        };

        service.getPartsOfSpeech = function () {
            if (service.partsOfSpeech.length > 0) {
                return $q.when(service.partsOfSpeech);
            }
            else {
                return $http.get('Api/PartOfSpeechApi/', { params: { timeout: 300 } })
                    .then(function (data, status, headers, config) {
                        service.partsOfSpeech = data.data;
                        return service.partsOfSpeech;
                    })
                    .catch(function (error) {
                        console.log(error.data.message);
                        service.errorMessage = error.data.message;
                        return $q.reject(error.data.message);
                    });
            }
        };

        service.postCard = function (card) {
            var cardCopy = $.extend({}, card); // JavaScript passes by reference, so we need to protect card by making a shallow copy, especially for unit tests.
            cardCopy.partOfSpeech = service.partsOfSpeech.find(function (p) { return p.name === card.partOfSpeech; }).id; // Switch back to integer for EF model.
            return $http.post('Api/CardApi/', cardCopy, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    card = data.data;
                    // Distasteful as it is, we need to replace the integer id for the part of speech, with the textual name here,
                    // since it is significantly easier to do it here than in the action. (don't go trying Include again and waste more hours)
                    card.partOfSpeech = service.partsOfSpeech.find(function (p) { return p.id === +card.partOfSpeech; }).name;
                    service.cards[service.cards.length] = card;
                    return card;   // The returned data is the new card.
                })
                .catch(function (error) {
                    console.log(error.data.message);
                    service.errorMessage = error.data.message;
                    return $q.reject(error.data.message);
                });
        };

        service.putCard = function (card) {
            var cardCopy = $.extend({}, card); // JavaScript passes by reference, so we need to protect card by making a shallow copy, especially for unit tests.
            cardCopy.partOfSpeech = service.partsOfSpeech.find(function (p) { return p.name === card.partOfSpeech; }).id; // Switch back to integer for EF model.
            return $http.put('Api/CardApi/', cardCopy, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    card = data.data;
                    // See note in .then() of postCard for explanation.
                    card.partOfSpeech = service.partsOfSpeech.find(function (p) { return p.id === +card.partOfSpeech; }).name;
                    var cardIndex = service.cards.findIndex(function (c) { return c.id === +card.id; });
                    service.cards.splice(cardIndex, 1, card);
                    return card;   // The returned data is the new card.
                })
                .catch(function (error) {
                    console.log(error.data.message);
                    service.errorMessage = error.data.message;
                    return $q.reject(error.data.message);
                });
        };

        service.deleteCard = function (id) {
            return $http.delete('Api/CardApi/' + id, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    // See note in .then() of postCard for explanation.
                    var index = service.cards.findIndex(function (c) { return c.id === id; });
                    if (index >= 0) {
                        service.cards.splice(index, 1);
                    } else {
                        console.log('cardData.deleteCard failed to find card with id = ' + id);
                    }
                    return id;   // The returned data is the deleted card.
                })
                .catch(function (error) {
                    console.log(error.data.message);
                    service.errorMessage = error.data.message;
                    return $q.reject(error.data.message);
                });
        };

        service.postHistory = function (cardId, correct, hintUsed) {
            var data = {
                Id: null,
                CardId: cardId,
                Correct: correct,
                CreatedDate: null,
                HintUsed: hintUsed
            };

            return $http.post('Api/HistoryApi/', data, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    return data.data;   // The returned data is the new history Id field, but we don't need it, since we only see aggregate history. (sums)
                })
                .catch(function (error) {
                    console.log(error.data.message);
                    service.errorMessage = error.data.message;
                    return $q.reject(error.data.message);
                });
        };

        return service;
    }
}());
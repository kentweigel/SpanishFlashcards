(function iife() {
    'use strict';

    angular.module('cardData', [])
        .factory('cardData', CardData);

    CardData.$inject = ['$http', '$q'];

    function CardData($http, $q) {
        var service = this;

        service.cards = [];
        service.partsOfSpeech = [];

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
                        console.log(error);
                        throw error;
                    });
            }
        }

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
                        console.log(error);
                        throw error;
                    });
            }
        }

        service.postCard = function (card) {
            return $http.post('Api/CardApi/', card, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    card = data.data;
                    card.partOfSpeech = service.partsOfSpeech.find(function (p) { return p.id === +card.partOfSpeech; }).name;
                    service.cards[service.cards.length] = card;
                    return data.data;   // The returned data is the new card.
                })
                .catch(function (error) {
                    console.log(error);
                    throw error;
                });
        }

        service.putCard = function (card) {
            var dbCard = {
                Id: card.id,
                Spanish: card.spanish,
                English: card.english,
                PartOfSpeech: service.partsOfSpeech.find(function(p) { return p.name === card.partOfSpeech }).id
            }; // Camel vs Pascal case doesn't appear to matter here. See POST here and in card-admin-controller.js
            return $http.put('Api/CardApi/', dbCard, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    card = data.data;
                    card.partOfSpeech = service.partsOfSpeech.find(function (p) { return p.id === +card.partOfSpeech; }).name;
                    return data.data;   // The returned data is the new card.
                })
                .catch(function (error) {
                    console.log(error);
                    throw error;
                });
        }

        service.deleteCard = function (id) {
            return $http.delete('Api/CardApi/' + id, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    var index = service.cards.findIndex(function(c) { return c.id === id });
                    if (index >= 0) {
                        service.cards.splice(index, 1);
                    } else {
                        console.log('cardData.deleteCard failed to find card with id = ' + id);
                    }
                    return data.data;   // The returned data is the new card Id field.
                })
                .catch(function (error) {
                    console.log(error);
                    throw error;
                });
        }

        service.postHistory = function (cardId, correct, hintUsed) {
            var data = {
                Id: null,
                CardId: cardId,
                Correct: correct,
                CreatedDate: null,
                HintUsed: hintUsed
            }

            return $http.post('Api/HistoryApi/', data, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    return data.data;   // The returned data is the new history Id field, but we don't need it, since we only see aggregate history. (sums)
                })
                .catch(function (error) {
                    console.log(error);
                    throw error;
                });
        }

        return service;
    }
}());
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
                return $http.get(service.getBaseLocation() + 'Api/CardApi/', { params: { timeout: 300 } })
                    .then(function (data, status, headers, config) {
                        service.cards = data.data;
                        return service.cards;
                    })
                    .catch(function (error) {
                        console.log(error);
                        return error;
                    });
            }
        }

        service.getPartsOfSpeech = function () {
            if (service.partsOfSpeech.length > 0) {
                return $q.when(service.partsOfSpeech);
            }
            else {
                return $http.get(service.getBaseLocation() + 'Api/PartOfSpeechApi/', { params: { timeout: 300 } })
                    .then(function (data, status, headers, config) {
                        service.partsOfSpeech = data.data;
                        return service.partsOfSpeech;
                    })
                    .catch(function (error) {
                        console.log(error);
                        return error;
                    });
            }
        }

        service.postCard = function (card) {
            return $http.post(service.getBaseLocation() + 'Api/CardApi/', card, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    return data.data;   // The returned data is the new card Id field.
                })
                .catch(function (error) {
                    console.log(error);
                    return error;
                });
        }

        service.putCard = function (card) {
            return $http.put(service.getBaseLocation() + 'Api/CardApi/', card, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    return data.data;
                })
                .catch(function (error) {
                    console.log(error);
                    return error;
                });
        }

        service.deleteCard = function (card) {
            return $http.delete(service.getBaseLocation() + 'Api/CardApi/', card, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    return data.data;   // The returned data is the new card Id field.
                })
                .catch(function (error) {
                    console.log(error);
                    return error;
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

            return $http.post(service.getBaseLocation() + 'Api/HistoryApi/', data, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    return data.data;   // The returned data is the new history Id field, but we don't need it, since we only see aggregate history. (sums)
                })
                .catch(function (error) {
                    console.log(error);
                    return error;
                });
        }

        service.getBaseLocation = function () {
            var baseUrlElement = document.getElementById("baseUrl");
            var baseUrl = baseUrlElement.value;

            return baseUrl;
        }

        return service;
    }
}());
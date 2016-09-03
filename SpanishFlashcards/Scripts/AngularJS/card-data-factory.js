(function () {
    'use strict';

    angular.module('cardData', [])
        .factory('cardData', cardData);

    cardData.$inject = ['$http'];

    function cardData($http) {
        var factory = this;

        factory.cards = [];
        factory.partsOfSpeech = [];

        factory.getCards = function () {
            if (factory.cards.length > 0) {
                return factory.cards;
            }
            else {
                return $http.get(factory.getBaseLocation() + 'Api/CardApi/', { params: { timeout: 300 } })
                    .then(function (data, status, headers, config) {
                        factory.cards = data.data;
                        return factory.cards;
                    })
                    .catch(function (error) {
                        console.log(error);
                        return error;
                    });
            }
        }

        factory.getPartsOfSpeech = function () {
            if (factory.partsOfSpeech.length > 0) {
                return factory.partsOfSpeech;
            }
            else {
                return $http.get(factory.getBaseLocation() + 'Api/PartOfSpeechApi/', { params: { timeout: 300 } })
                    .then(function (data, status, headers, config) {
                        factory.partsOfSpeech = data.data;
                        return factory.partsOfSpeech;
                    })
                    .catch(function (error) {
                        console.log(error);
                        return error;
                    });
            }
        }

        factory.postCard = function (card) {
            return $http.post(factory.getBaseLocation() + 'Api/CardApi/', card, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    return data.data;   // The returned data is the new card Id field.
                })
                .catch(function (error) {
                    console.log(error);
                    return error;
                });
        }

        factory.postHistory = function (cardId, correct, hintUsed) {
            var data = {
                Id: null,
                CardId: cardId,
                Correct: correct,
                CreatedDate: null,
                HintUsed: hintUsed
            }

            return $http.post(factory.getBaseLocation() + 'Api/HistoryApi/', data, { params: { timeout: 300 } })
                .then(function (data, status, headers, config) {
                    return data.data;   // The returned data is the new history Id field, but we don't need it, since we only see aggregate history. (sums)
                })
                .catch(function (error) {
                    console.log(error);
                    return error;
                });
        }

        factory.getBaseLocation = function () {
            var baseUrlElement = document.getElementById("baseUrl");
            var baseUrl = baseUrlElement.value;

            return baseUrl;
        }

        return factory;
    }
})();
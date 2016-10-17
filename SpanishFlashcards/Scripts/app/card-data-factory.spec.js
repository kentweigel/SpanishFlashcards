/// <reference path="/node_modules/jasmine/bin/jasmine.js" />

'use strict';

describe('cardData', function () {
    var testErrorMessage = 'Error message';
    var getCardsRequestHandler;
    var getPartsOfSpeechRequestHandler;
    var postCardRequestHandler;
    var putCardRequestHandler;
    var deleteCardRequestHandler;
    var postHistoryRequestHandler;
    var $httpBackend, $q, cardData;
    var rejectGetCards = false;
    var rejectGetPartsOfSpeech = false;
    var rejectPostCard = false;
    var rejectPutCard = false;
    var rejectDeleteCard = false;
    var rejectPostHistory = false;
    var getCardsApiAddress = 'Api/CardApi/?timeout=300';
    var getPartsOfSpeechApiAddress = 'Api/PartOfSpeechApi/?timeout=300';
    var postCardApiAddress = 'Api/CardApi/?timeout=300';
    var putCardApiAddress = 'Api/CardApi/?timeout=300';
    var deleteCardApiAddress = 'Api/CardApi/83?timeout=300';    // Hard-coded 83 for id argument.
    var postHistoryApiAddress = 'Api/HistoryApi/?timeout=300';
    var testCardListData = [
        {
            correctCount: 5,
            english: "good",
            hintUsedCount: 0,
            id: 83,
            partOfSpeech: "Adjective",
            spanish: "bien",
            totalCount: 5
        },
        {
            correctCount: 2,
            english: "help",
            hintUsedCount: 0,
            id: 84,
            partOfSpeech: "Verb",
            spanish: "ayudar",
            totalCount: 2
        }
    ];
    var testCardData = {
        correctCount: 5,
        english: "good",
        hintUsedCount: 0,
        id: 83,
        partOfSpeech: "Adjective",
        spanish: "bien",
        totalCount: 5
    };
    var testCardApiData = {
        correctCount: 5,
        english: "good",
        hintUsedCount: 0,
        id: 83,
        partOfSpeech: 2,
        spanish: "bien",
        totalCount: 5
    };
    var testPartsOfSpeechData = [
        {
            id: 0,
            name: "Noun"
        },
        {
            id: 1,
            name: "Verb"
        },
        {
            id: 2,
            name: "Adjective"
        }
    ];
    var testHistoryData = [
        {
            id: 3,
            correct: true,
            hintUsed: false
        }
    ];

    beforeEach(module('cardData'));

    require.config({
        baseUrl: '../',
        paths: {
            "cardData": 'app/card-data-factory'
        }
    });

    beforeEach(function (done) {
        require(['cardData'], function () {
            done();
        });
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');

        getCardsRequestHandler = $httpBackend.when('GET', getCardsApiAddress)
            .respond(function (method, url, data, headers, params) {
                if (rejectGetCards) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { data: testCardListData }];
                }
            });

        getPartsOfSpeechRequestHandler = $httpBackend.when('GET', getPartsOfSpeechApiAddress)
            .respond(function (method, url, data, headers, params) {
                if (rejectGetPartsOfSpeech) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, testPartsOfSpeechData];
                }
            });

        postCardRequestHandler = $httpBackend.when('POST', postCardApiAddress)
            .respond(function (method, url, data, headers, params) {
                var jsonData = JSON.parse(data);
                var validData = jsonData.correctCount === testCardApiData.correctCount &&
                        jsonData.english === testCardApiData.english &&
                        jsonData.hintUsedCount === testCardApiData.hintUsedCount &&
                        jsonData.id === testCardApiData.id &&
                        jsonData.partOfSpeech === testCardApiData.partOfSpeech &&
                        jsonData.spanish === testCardApiData.spanish &&
                        jsonData.totalCount === testCardApiData.totalCount;
                if (!validData || rejectPostCard) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, testCardApiData]; // See note in card-data-factory.js in .then() of postCard for explanation.
                }
            });

        putCardRequestHandler = $httpBackend.when('PUT', putCardApiAddress)
            .respond(function (method, url, data, headers, params) {
                var jsonData = JSON.parse(data);
                var validData = jsonData.correctCount === testCardApiData.correctCount &&
                        jsonData.english === testCardApiData.english &&
                        jsonData.hintUsedCount === testCardApiData.hintUsedCount &&
                        jsonData.id === testCardApiData.id &&
                        jsonData.partOfSpeech === testCardApiData.partOfSpeech &&
                        jsonData.spanish === testCardApiData.spanish &&
                        jsonData.totalCount === testCardApiData.totalCount;
                if (!validData || rejectPutCard) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, testCardApiData];
                }
            });

        deleteCardRequestHandler = $httpBackend.when('DELETE', deleteCardApiAddress)
            .respond(function (method, url, data, headers, params) {
                if (rejectDeleteCard) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { data: testCardData.id }];
                }
            });

        postHistoryRequestHandler = $httpBackend.when('POST', postHistoryApiAddress)
            .respond(function (method, url, data, headers, params) {
                var jsonData = JSON.parse(data);
                var validData = jsonData.id === testHistoryData.id &&
                        jsonData.correct === testHistoryData.correct &&
                        jsonData.hintUsed === testHistoryData.hintUsed;
                if (!validData || rejectPostHistory) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { data: testCardData.id }];
                }
            });

        var cardData = $injector.get('cardData');
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCards success', function () {
        it('should return 2 cards', inject(function (cardData) {
            $httpBackend.expectGET(getCardsApiAddress);
            rejectGetCards = false;
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.getCards()
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(testCardListData);
            expect(wasRejected).toEqual(false);
            expect(cardData.errorMessage).toEqual(undefined);
        }));
    });

    describe('getPartsOfSpeech success', function () {
        it('should return 2 parts of speech', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress);
            rejectGetPartsOfSpeech = false;
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.getPartsOfSpeech()
                .then(function (data) {
                    returnValue = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(testPartsOfSpeechData);
            expect(wasRejected).toEqual(false);
            expect(cardData.errorMessage).toEqual(undefined);
        }));
    });

    describe('postCard success', function () {
        it('should return new card', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress); // Also need to set up getPartsOfSpeech, since postCard.then() calls it.
            rejectGetPartsOfSpeech = false;
            cardData.getPartsOfSpeech(); // And call getPartsOfSpeech to assign the partsOfSpeech array.
            $httpBackend.flush();
            $httpBackend.expectPOST(postCardApiAddress);
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.postCard(testCardData)
                .then(function (data) {
                    returnValue = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(testCardData);
            expect(wasRejected).toEqual(false);
            expect(cardData.errorMessage).toEqual(undefined);
        }));
    });

    describe('putCard success', function () {
        it('should return new card', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress); // Also need to set up getPartsOfSpeech, since putCard.then() calls it.
            rejectGetPartsOfSpeech = false;
            cardData.getPartsOfSpeech(); // And call getPartsOfSpeech to assign the partsOfSpeech array.
            $httpBackend.flush();
            $httpBackend.expectPUT(putCardApiAddress);
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.putCard(testCardData)
                .then(function (data) {
                    returnValue = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(testCardData);
            expect(wasRejected).toEqual(false);
            expect(cardData.errorMessage).toEqual(undefined);
        }));
    });

    describe('deleteCard success', function () {
        it('should return new card', inject(function (cardData) {
            rejectDeleteCard = false;
            $httpBackend.expectGET(getPartsOfSpeechApiAddress); // Also need to set up getPartsOfSpeech, since deleteCard.then() calls it.
            rejectGetPartsOfSpeech = false;
            cardData.getPartsOfSpeech(); // And call getPartsOfSpeech to assign the partsOfSpeech array.
            $httpBackend.flush();
            $httpBackend.expectDELETE(deleteCardApiAddress);
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.deleteCard(testCardData.id)
                .then(function (data) {
                    returnValue = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(testCardData.id);
            expect(wasRejected).toEqual(false);
            expect(cardData.errorMessage).toEqual(undefined);
        }));
    });

    describe('postHistory success', function () {
        it('should return new id', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress); // Also need to set up getPartsOfSpeech, since postHistory.then() calls it.
            rejectGetPartsOfSpeech = false;
            cardData.getPartsOfSpeech(); // And call getPartsOfSpeech to assign the partsOfSpeech array.
            $httpBackend.flush();
            $httpBackend.expectPOST(postHistoryApiAddress);
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.postHistory(testHistoryData.id, testHistoryData.correct, testHistoryData.hindUsed)
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(testCardData.id);
            expect(wasRejected).toEqual(false);
            expect(cardData.errorMessage).toEqual(undefined);
        }));
    });

    describe('getCards failure', function () {
        it('should return error', inject(function (cardData) {
            $httpBackend.expectGET(getCardsApiAddress);
            rejectGetCards = true;
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.getCards()
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue === undefined).toEqual(true);
            expect(wasRejected).toEqual(true);
            expect(cardData.errorMessage).toEqual(testErrorMessage);
        }));
    });

    describe('getPartsOfSpeech failure', function () {
        it('should return error', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress);
            rejectGetPartsOfSpeech = true;
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.getPartsOfSpeech()
                .then(function (data) {
                    returnValue = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue === undefined).toEqual(true);
            expect(wasRejected).toEqual(true);
            expect(cardData.errorMessage).toEqual(testErrorMessage);
        }));
    });

    describe('postCard failure', function () {
        it('should return error', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress); // Also need to set up getPartsOfSpeech, since postCard.then() calls it.
            rejectGetPartsOfSpeech = false;
            cardData.getPartsOfSpeech(); // And call getPartsOfSpeech to assign the partsOfSpeech array.
            $httpBackend.flush();
            $httpBackend.expectPOST(postCardApiAddress);
            rejectPostCard = true;
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.postCard(testCardData)
                .then(function (data) {
                    returnValue = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue === undefined).toEqual(true);
            expect(wasRejected).toEqual(true);
            expect(cardData.errorMessage).toEqual(testErrorMessage);
        }));
    });

    describe('putCard failure', function () {
        it('should return error', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress); // Also need to set up getPartsOfSpeech, since putCard.then() calls it.
            rejectGetPartsOfSpeech = false;
            cardData.getPartsOfSpeech(); // And call getPartsOfSpeech to assign the partsOfSpeech array.
            $httpBackend.flush();
            $httpBackend.expectPUT(putCardApiAddress);
            rejectPutCard = true;
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.putCard(testCardData)
                .then(function (data) {
                    returnValue = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue === undefined).toEqual(true);
            expect(wasRejected).toEqual(true);
            expect(cardData.errorMessage).toEqual(testErrorMessage);
        }));
    });

    describe('deleteCard failure', function () {
        it('should return error', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress); // Also need to set up getPartsOfSpeech, since deleteCard.then() calls it.
            rejectGetPartsOfSpeech = false;
            cardData.getPartsOfSpeech(); // And call getPartsOfSpeech to assign the partsOfSpeech array.
            $httpBackend.flush();
            $httpBackend.expectDELETE(deleteCardApiAddress);
            rejectDeleteCard = true;
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.deleteCard(testCardData.id)
                .then(function (data) {
                    returnValue = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue === undefined).toEqual(true);
            expect(wasRejected).toEqual(true);
            expect(cardData.errorMessage).toEqual(testErrorMessage);
        }));
    });

    describe('postHistory failure', function () {
        it('should return error', inject(function (cardData) {
            $httpBackend.expectGET(getPartsOfSpeechApiAddress); // Also need to set up getPartsOfSpeech, since postHistory.then() calls it.
            rejectGetPartsOfSpeech = false;
            cardData.getPartsOfSpeech(); // And call getPartsOfSpeech to assign the partsOfSpeech array.
            $httpBackend.flush();
            $httpBackend.expectPOST(postHistoryApiAddress);
            rejectPostHistory = true;
            var wasRejected = false;
            var returnValue;
            cardData.clearErrorMessage();
            cardData.postHistory(testHistoryData.id, testHistoryData.correct, testHistoryData.hindUsed)
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue === undefined).toEqual(true);
            expect(wasRejected).toEqual(true);
            expect(cardData.errorMessage).toEqual(testErrorMessage);
        }));
    });
});
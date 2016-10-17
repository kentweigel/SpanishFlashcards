/// <reference path="/node_modules/jasmine/bin/jasmine.js" />

'use strict';

describe('CardAdminController', function () {
	var testErrorMessage = 'Error message';
	var mockCardData;
	var causeError = false;
    var $controller, $state, $q, $rootScope;
    var testCardData = {
        correctCount: 5,
        english: "good",
        hintUsedCount: 0,
        id: 83,
        partOfSpeech: "Adjective",
        spanish: "bien",
        totalCount: 5
    };
    var testNewCardData = {
        english: "good",
        id: -1,
        partOfSpeech: "Adjective",
        spanish: "bien"
    };

	angular.module('app', []);

	$state = {
		params: {
			returnState: 'admin'
		},
		go: function () { }
	};

	beforeEach(module('app'));

	require.config({
		baseUrl: '../',
		paths: {
			"CardAdminController": 'app/card-admin-controller',
			"jquery": 'jquery-3.1.0'
		}
	});

	beforeEach(function (done) {
		require(['jquery'], function () {
			done();
		});
	});

	beforeEach(function (done) {
		require(['CardAdminController'], function () {
			done();
		});
	});

	beforeEach(function () {
		module(function ($provide) {
			// Create mock cardData factory
			$provide.factory('cardData', function ($q) {
				var mock = this;
				mock.errorMessage = undefined;

				mock.clearErrorMessage = jasmine.createSpy('clearErrorMessage').and.callFake(function () {
					mock.errorMessage = undefined;
				});

				mock.getCards = jasmine.createSpy('getCards').and.callFake(function () {
					return $q.when([]);
				});

				mock.getPartsOfSpeech = jasmine.createSpy('getPartsOfSpeech').and.callFake(function () {
					return $q.when([]);
				});

				mock.postCard = jasmine.createSpy('postCard').and.callFake(function (card) {
					if (causeError) {
						mock.errorMessage = testErrorMessage;
						return $q.reject(testErrorMessage);
					} else {
						return $q.when(card);
					}
				});

				mock.putCard = jasmine.createSpy('putCard').and.callFake(function (card) {
					if (causeError) {
						mock.errorMessage = testErrorMessage;
						return $q.reject(testErrorMessage);
					} else {
						return $q.when(card);
					}
				});

				mock.deleteCard = jasmine.createSpy('deleteCard').and.callFake(function (id) {
					if (causeError) {
						mock.errorMessage = testErrorMessage;
						return $q.reject(testErrorMessage);
					} else {
						return $q.when(id);
					}
				});

				return mock;
			});
			//$provide.value('cardData', mockCardData);
		});

		inject(function (_cardData_, _$controller_, _$q_, _$rootScope_) {
			mockCardData = _cardData_;
			$q = _$q_;
			$rootScope = _$rootScope_;
			$controller = _$controller_('CardAdminController', { cardData: _cardData_, $state: $state, $q: $q });
		});
	});

	describe('saveNewCard success', function () {
		it('should not set mockCardData.errorMessage', function () {
			causeError = false;
			mockCardData.clearErrorMessage();
			$controller.currentCard = testNewCardData;
			$controller.saveNewCard();
			expect(mockCardData.postCard).toHaveBeenCalled();
			expect(mockCardData.errorMessage === undefined).toEqual(true);
		});
	});

	describe('saveCurrentCard success', function () {
		it('should not set mockCardData.errorMessage', function () {
			causeError = false;
			mockCardData.clearErrorMessage();
			$controller.currentCard = testCardData;
			$controller.saveCurrentCard();
			expect(mockCardData.putCard).toHaveBeenCalled();
			expect(mockCardData.errorMessage === undefined).toEqual(true);
		});
	});

	describe('deleteCard success', function () {
		it('should not set mockCardData.errorMessage', function () {
			causeError = false;
			mockCardData.clearErrorMessage();
			$controller.deleteCard();
			expect(mockCardData.deleteCard).toHaveBeenCalled();
			expect(mockCardData.errorMessage === undefined).toEqual(true);
		});
	});

	describe('saveNewCard failure', function () {
		it('should set mockCardData.errorMessage', function () {
			causeError = true;
			mockCardData.clearErrorMessage();
			$controller.currentCard = testNewCardData;
			$controller.saveNewCard(testCardData);
			expect(mockCardData.postCard).toHaveBeenCalled();
			expect(mockCardData.errorMessage === undefined).toEqual(false);
		});
	});

	describe('saveCurrentCard failure', function () {
		it('should set mockCardData.errorMessage', function () {
			causeError = true;
			mockCardData.clearErrorMessage();
			$controller.currentCard = testCardData;
			$controller.saveCurrentCard(testCardData);
			expect(mockCardData.putCard).toHaveBeenCalled();
			expect(mockCardData.errorMessage === undefined).toEqual(false);
		});
	});

	describe('deleteCard failure', function () {
		it('should set mockCardData.errorMessage', function () {
			causeError = true;
			mockCardData.clearErrorMessage();
			$controller.deleteCard(testCardData.id);
			expect(mockCardData.deleteCard).toHaveBeenCalled();
			expect(mockCardData.errorMessage === undefined).toEqual(false);
		});
	});
});
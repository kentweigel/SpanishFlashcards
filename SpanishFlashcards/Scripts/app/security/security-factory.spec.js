/// <reference path="/node_modules/jasmine/bin/jasmine.js" />

'use strict';

describe('securityData', function () {
    var testEmailAddress = 'email@address.com';
    var $httpBackend, $q, securityData, loginRequestHandler, logoffRequestHandler, currentUserHandler;
    var rejectLogin = false;
    var rejectLogoff = false;
    var rejectCurrentUser = false;
    var loginApiAddress = 'Api/AccountApi/Login/?timeout=300';
    var logoffApiAddress = 'Api/AccountApi/LogOff/?timeout=300';
    var currentUserApiAddress = 'Api/AccountApi/CurrentUser/?timeout=300';

    beforeEach(module('securityData'));

    require.config({
        baseUrl: '../../',
        paths: {
            "securityData": 'app/security/security-factory'
        }
    });

    beforeEach(function (done) {
        require(['securityData'], function () {
            done();
        });
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');

        loginRequestHandler = $httpBackend.when('POST', loginApiAddress)
            //.respond({ email: testEmailAddress });
            .respond(function (method, url, data, headers, params) {
                if (rejectLogin) {
                    return [400, {email: undefined}];
                } else {
                    return [200, {email: testEmailAddress}];
                }
            });

        logoffRequestHandler = $httpBackend.when('POST', logoffApiAddress)
            .respond(function (method, url, data, headers, params) {
                if (rejectLogoff) {
                    return [400, { email: undefined }];
                } else {
                    return [200, { email: undefined }];
                }
            });

        loginRequestHandler = $httpBackend.when('GET', currentUserApiAddress)
            .respond(function (method, url, data, headers, params) {
                if (rejectCurrentUser) {
                    return [400, { email: undefined }];
                } else {
                    return [200, { email: testEmailAddress }];
                }
            });

        var securityData = $injector.get('securityData');
    }));

    //beforeEach(function () {
    //    module(function ($provide) {
    //        $provide.value('$http', $httpBackend);
    //    });
    //});

    //afterEach(function () {
    //    $httpBackend.verifyNoOutstandingExpectation();
    //    $httpBackend.verifyNoOutstandingRequest();
    //});

    describe('login success', function () {
        it('should return email address', inject(function (securityData) {
            rejectLogin = false;

            $httpBackend.expectPOST(loginApiAddress);
            var wasRejected = false;
            var userName;
            securityData.login(testEmailAddress, 'password', true)
                .then(function (data) {
                    userName = data.email;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(testEmailAddress);
            expect(wasRejected).toEqual(false);
        }));
    });

    describe('logoff success', function () {
        it('should return undefined', inject(function (securityData) {
            rejectLogoff = false;

            $httpBackend.expectPOST(logoffApiAddress);
            var wasRejected = false;
            var userName;
            securityData.logoff()
                .then(function (data) {
                    userName = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(undefined);
            expect(wasRejected).toEqual(false);
        }));
    });

    describe('currentUser success', function () {
        it('should return email address/username', inject(function (securityData) {
            rejectCurrentUser = false;

            $httpBackend.expectGET(currentUserApiAddress);
            var wasRejected = false;
            var userName;
            securityData.currentUser()
                .then(function (data) {
                    userName = data.email;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(testEmailAddress);
            expect(wasRejected).toEqual(false);
        }));
    });

    describe('login failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            rejectLogin = true;

            $httpBackend.expectPOST(loginApiAddress);
            var wasRejected = false;
            var userName;
            securityData.login(testEmailAddress, 'password', true)
                .then(function (data) {
                    userName = data.email;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(undefined);
            expect(wasRejected).toEqual(true);
        }));
    });

    describe('logoff failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            rejectLogoff = true;

            $httpBackend.expectPOST(logoffApiAddress);
            var wasRejected = false;
            var userName;
            securityData.logoff()
                .then(function (data) {
                    userName = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(undefined);
            expect(wasRejected).toEqual(true);
        }));
    });

    describe('currentUser failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            rejectCurrentUser = true;

            $httpBackend.expectGET(currentUserApiAddress);
            var wasRejected = false;
            var userName;
            securityData.currentUser()
                .then(function (data) {
                    userName = data.email;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(undefined);
            expect(wasRejected).toEqual(true);
        }));
    });

});
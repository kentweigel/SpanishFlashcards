/// <reference path="/node_modules/jasmine/bin/jasmine.js" />

'use strict';

describe('securityData', function () {
    var testEmailAddress = 'email@address.com';
    var testValidPassword = 'validPassword';
    var testInvalidPassword = 'invalidPassword';
    var testErrorMessage = 'Error message';
    var testRememberMe = true;
    var $httpBackend, $q, securityData;
    var changePasswordRequestHandler, currentUserRequestHandler, loginRequestHandler, logoffRequestHandler, setPasswordRequestHandler, registerRequestHandler;
    var rejectCurrentUser = false;
    var rejectLogoff = false;
    var changePasswordApiAddress = 'Api/AccountApi/ChangePassword/?timeout=300';
    var currentUserApiAddress = 'Api/AccountApi/CurrentUser/?timeout=300';
    var loginApiAddress = 'Api/AccountApi/Login/?timeout=300';
    var logoffApiAddress = 'Api/AccountApi/LogOff/?timeout=300';
    var setPasswordApiAddress = 'Api/AccountApi/SetPassword/?timeout=300';
    var registerApiAddress = 'Api/AccountApi/Register/?timeout=300';

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

        changePasswordRequestHandler = $httpBackend.when('POST', changePasswordApiAddress)
            .respond(function (method, url, data, headers, params) {
                var jsonData = JSON.parse(data);
                var validData = jsonData.oldPassword === testValidPassword &&
                        jsonData.newPassword === testValidPassword &&
                        jsonData.confirmPassword === testValidPassword;
                if (!validData) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { data: undefined }];
                }
            });

        currentUserRequestHandler = $httpBackend.when('GET', currentUserApiAddress)
            .respond(function (method, url, data, headers, params) {
                if (rejectCurrentUser) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { email: testEmailAddress }];
                }
            });

        loginRequestHandler = $httpBackend.when('POST', loginApiAddress)
            //.respond({ email: testEmailAddress }); // This works too, but is less flexible.
            .respond(function (method, url, data, headers, params) {
                var jsonData = JSON.parse(data);
                var validData = jsonData.email === testEmailAddress && jsonData.password === testValidPassword && jsonData.rememberMe === testRememberMe;
                if (!validData) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { data: '<input name="__RequestVerificationToken" type="hidden" value="Gibberish">' }];
                }
            });

        logoffRequestHandler = $httpBackend.when('POST', logoffApiAddress)
            .respond(function (method, url, data, headers, params) {
                if (rejectLogoff) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { data: '<input name="__RequestVerificationToken" type="hidden" value="Gibberish">' }];
                }
            });

        registerRequestHandler = $httpBackend.when('POST', registerApiAddress)
            .respond(function (method, url, data, headers, params) {
                var jsonData = JSON.parse(data);
                var validData = jsonData.email === testEmailAddress && jsonData.password === testValidPassword && jsonData.confirmPassword === testValidPassword;
                if (!validData) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { data: jsonData.email }];
                }
            });

        setPasswordRequestHandler = $httpBackend.when('POST', setPasswordApiAddress)
            .respond(function (method, url, data, headers, params) {
                var jsonData = JSON.parse(data);
                var validData = jsonData.newPassword === testValidPassword && jsonData.confirmPassword === testValidPassword;
                if (!validData) {
                    return [400, { message: testErrorMessage }];
                } else {
                    return [200, { data: undefined }];
                }
            });

        var securityData = $injector.get('securityData');
    }));

    //beforeEach(function () {
    //    module(function ($provide) {
    //        $provide.value('$http', $httpBackend);
    //    });
    //});

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('changePassword success', function () {
        it('should return undefined', inject(function (securityData) {
            $httpBackend.expectPOST(changePasswordApiAddress);
            var wasRejected = false;
            var returnValue;
            securityData.clearErrorMessage();
            securityData.changePassword(testValidPassword, testValidPassword, testValidPassword)
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(undefined);
            expect(wasRejected).toEqual(false);
            expect(securityData.errorMessage).toEqual(undefined);
        }));
    });

    describe('currentUser success', function () {
        it('should return email address/username', inject(function (securityData) {
            rejectCurrentUser = false;
            $httpBackend.expectGET(currentUserApiAddress);
            var wasRejected = false;
            var userName;
            securityData.clearErrorMessage();
            securityData.currentUser()
                .then(function (data) {
                    userName = data.email;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(testEmailAddress);
            expect(wasRejected).toEqual(false);
            expect(securityData.errorMessage).toEqual(undefined);
        }));
    });

    describe('login success', function () {
        it('should return email address', inject(function (securityData) {
            $httpBackend.expectPOST(loginApiAddress);
            var wasRejected = false;
            var inputTag;
            securityData.clearErrorMessage();
            securityData.login(testEmailAddress, testValidPassword, testRememberMe)
                .then(function (data) {
                    inputTag = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(inputTag !== undefined).toEqual(true);
            expect(wasRejected).toEqual(false);
            expect(securityData.errorMessage).toEqual(undefined);
        }));
    });

    describe('logoff success', function () {
        it('should return undefined', inject(function (securityData) {
            rejectLogoff = false;
            $httpBackend.expectPOST(logoffApiAddress);
            var wasRejected = false;
            var inputTag;
            securityData.clearErrorMessage();
            securityData.logoff()
                .then(function (data) {
                    inputTag = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(inputTag !== undefined).toEqual(true);
            expect(wasRejected).toEqual(false);
            expect(securityData.errorMessage).toEqual(undefined);
        }));
    });

    describe('register success', function () {
        it('should return email address', inject(function (securityData) {
            $httpBackend.expectPOST(registerApiAddress);
            var wasRejected = false;
            var returnValue;
            securityData.clearErrorMessage();
            securityData.register(testEmailAddress, testValidPassword, testValidPassword)
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(testEmailAddress);
            expect(wasRejected).toEqual(false);
            expect(securityData.errorMessage).toEqual(undefined);
        }));
    });

    describe('setPassword success', function () {
        it('should return undefined', inject(function (securityData) {
            $httpBackend.expectPOST(setPasswordApiAddress);
            var wasRejected = false;
            var returnValue;
            securityData.clearErrorMessage();
            securityData.setPassword(testValidPassword, testValidPassword)
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(undefined);
            expect(wasRejected).toEqual(false);
            expect(securityData.errorMessage).toEqual(undefined);
        }));
    });

    describe('changePassword failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            $httpBackend.expectPOST(changePasswordApiAddress);
            var wasRejected = false;
            var returnValue;
            securityData.clearErrorMessage();
            securityData.changePassword(testValidPassword, testValidPassword, testInvalidPassword)
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(undefined);
            expect(wasRejected).toEqual(true);
            expect(securityData.errorMessage === undefined).toEqual(false);
        }));
    });

    describe('currentUser failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            rejectCurrentUser = true;
            $httpBackend.expectGET(currentUserApiAddress);
            var wasRejected = false;
            var userName;
            securityData.clearErrorMessage();
            securityData.currentUser()
                .then(function (data) {
                    userName = data.email;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(undefined);
            expect(wasRejected).toEqual(true);
            expect(securityData.errorMessage === undefined).toEqual(false);
        }));
    });

    describe('login failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            $httpBackend.expectPOST(loginApiAddress);
            var wasRejected = false;
            var userName;
            securityData.clearErrorMessage();
            securityData.login(testEmailAddress, testInvalidPassword, testRememberMe)
                .then(function (data) {
                    userName = data.email;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(undefined);
            expect(wasRejected).toEqual(true);
            expect(securityData.errorMessage === undefined).toEqual(false);
        }));
    });

    describe('logoff failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            rejectLogoff = true;
            $httpBackend.expectPOST(logoffApiAddress);
            var wasRejected = false;
            var userName;
            securityData.clearErrorMessage();
            securityData.logoff()
                .then(function (data) {
                    userName = data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(userName).toEqual(undefined);
            expect(wasRejected).toEqual(true);
            expect(securityData.errorMessage === undefined).toEqual(false);
        }));
    });

    describe('register failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            $httpBackend.expectPOST(registerApiAddress);
            var wasRejected = false;
            var returnValue;
            securityData.clearErrorMessage();
            securityData.register(testEmailAddress, testValidPassword, testInvalidPassword)
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(undefined);
            expect(wasRejected).toEqual(true);
            expect(securityData.errorMessage === undefined).toEqual(false);
        }));
    });

    describe('setPassword failure', function () {
        it('should be rejected and return undefined', inject(function (securityData) {
            $httpBackend.expectPOST(setPasswordApiAddress);
            var wasRejected = false;
            var returnValue;
            securityData.clearErrorMessage();
            securityData.setPassword(testValidPassword, testInvalidPassword)
                .then(function (data) {
                    returnValue = data.data;
                }, function (error) {
                    wasRejected = true;
                });
            $httpBackend.flush();
            expect(returnValue).toEqual(undefined);
            expect(wasRejected).toEqual(true);
            expect(securityData.errorMessage === undefined).toEqual(false);
        }));
    });
});
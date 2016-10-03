/// <reference path="../../node_modules/jasmine/bin/jasmine.js" />

'use strict';

describe('SecurityController', function () {
    var testEmailAddress = 'email@address.com';
    var mockSecurityData;
    var rejectLoginPromise = false;
    var rejectLogoffPromise = false;
    var $controller, $state, $window, $q, $rootScope;

    // Create mock securityData factory
    //mockSecurityData = {  // toHaveBeenCalled throws error if this is used instead of spy
    //    currentUser: function () {
    //        return $q.when(testEmailAddress);
    //    },
    //    login: function (email, password, rememberMe) {
    //        return $q.when(testEmailAddress);
    //    }
    //};

    $state = {
        params: {
            returnState: 'admin'
        },
        go: function () { }
    };

    $window = {
        location: {
            reload: function (returnState) { }
        }
    };

    beforeEach(module('app'));

    beforeEach(function () {
        module(function ($provide) {
            // Create mock securityData factory
            $provide.factory('securityData', function ($q) {
                var login = jasmine.createSpy('login').and.callFake(function () {
                    if (rejectLoginPromise) {
                        return $q.reject('rejected');
                    } else {
                        return $q.when(testEmailAddress);
                    }
                });

                var logoff = jasmine.createSpy('logoff').and.callFake(function () {
                    if (rejectLogoffPromise) {
                        return $q.reject('rejected');
                    } else {
                        return $q.when();
                    }
                });

                var currentUser = jasmine.createSpy('currentUser').and.callFake(function () {
                    return $q.when(testEmailAddress);
                });

                return {
                    login: login,
                    logoff: logoff,
                    currentUser: currentUser
                };
            });
            //$provide.value('securityData', mockSecurityData);
        });

        inject(function (_securityData_, _$controller_, _$q_, _$rootScope_) {
            mockSecurityData = _securityData_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $controller = _$controller_('SecurityController', { securityData: _securityData_, $state: $state, $window: $window, $q: $q });
        });
    });

    describe('login success', function () {
        it('should set userName', function () {
            rejectLoginPromise = false;
            $controller.email = testEmailAddress;
            $controller.password = 'test';
            $controller.rememberMe = true;
            //$controller.userName = undefined;

            $controller.login();

            $rootScope.$digest();

            expect(mockSecurityData.login).toHaveBeenCalled();
            expect($controller.userName).toEqual(testEmailAddress);

        });
    });

    describe('logoff success', function () {
        it('should clear userName', function () {
            rejectLoginPromise = false;
            rejectLogoffPromise = false;
            $controller.email = testEmailAddress;
            $controller.password = 'test';
            $controller.rememberMe = true;
            //$controller.userName = undefined;

            $controller.login();

            $rootScope.$digest();

            expect(mockSecurityData.login).toHaveBeenCalled();
            expect($controller.userName).toEqual(testEmailAddress);

            $controller.logoff();

            $rootScope.$digest();

            expect(mockSecurityData.logoff).toHaveBeenCalled();
            expect($controller.userName).toEqual(undefined);

        });
    });

    describe('login failure', function () {
        it('should be rejected and should clear userName', function () {
            rejectLoginPromise = true;
            $controller.email = testEmailAddress;
            $controller.password = 'test';
            $controller.rememberMe = true;
            //$controller.userName = undefined;

            var wasRejected = false;
            $controller.login()
                .then(function () { },
                function () {
                    wasRejected = true;
                });

            $rootScope.$digest();

            expect(mockSecurityData.login).toHaveBeenCalled();
            expect($controller.userName).toEqual(undefined);
            expect(wasRejected).toEqual(true);
        });
    });

    describe('logoff failure', function () {
        it('should be rejected', function () {
            rejectLoginPromise = false;
            rejectLogoffPromise = true;
            $controller.email = testEmailAddress;
            $controller.password = 'test';
            $controller.rememberMe = true;
            //$controller.userName = undefined;

            $controller.login();

            $rootScope.$digest();

            expect(mockSecurityData.login).toHaveBeenCalled();
            expect($controller.userName).toEqual(testEmailAddress);

            var wasRejected = false;
            $controller.logoff()
                .then(function () { }, function () {
                    wasRejected = true;
                });

            $rootScope.$digest();

            expect(mockSecurityData.logoff).toHaveBeenCalled();
            expect(wasRejected).toEqual(true);
        });
    });
});
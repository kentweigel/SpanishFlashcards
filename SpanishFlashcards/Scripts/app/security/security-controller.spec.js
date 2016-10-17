/// <reference path="/node_modules/jasmine/bin/jasmine.js" />

'use strict';

describe('SecurityController', function () {
    var testErrorMessage = 'Error message';
    var testEmailAddress = 'email@address.com';
    var testValidPassword = 'validPassword';
    var testInvalidPassword = 'invalidPassword';
    var mockSecurityData;
    var rejectChangePasswordPromise = false;
    var rejectLoginPromise = false;
    var rejectLogoffPromise = false;
    var rejectSetPasswordPromise = false;
    var rejectRegisterPromise = false;
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

    angular.module('app', []);

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

    require.config({
        baseUrl: '../../',
        paths: {
            "SecurityController": 'app/security/security-controller',
            "jquery": 'jquery-3.1.0'
        }
    });

    beforeEach(function (done) {
        require(['jquery'], function () {
            done();
        });
    });

    beforeEach(function (done) {
        require(['SecurityController'], function () {
            done();
        });
    });

    beforeEach(function () {
        module(function ($provide) {
            // Create mock securityData factory
            $provide.factory('securityData', function ($q) {
                var mock = this;
                mock.errorMessage = undefined;

                mock.changePassword = jasmine.createSpy('changePassword').and.callFake(function () {
                    if (rejectChangePasswordPromise) {
                        mock.errorMessage = testErrorMessage;
                        return $q.reject('rejected');
                    } else {
                        return $q.when();
                    }
                });

                mock.clearErrorMessage = jasmine.createSpy('clearErrorMessage').and.callFake(function () {
                    mock.errorMessage = undefined;
                    return;
                });

                mock.currentUser = jasmine.createSpy('currentUser').and.callFake(function () {
                    return $q.when(testEmailAddress);
                });

                mock.login = jasmine.createSpy('login').and.callFake(function () {
                    if (rejectLoginPromise) {
                        mock.errorMessage = testErrorMessage;
                        return $q.reject('rejected');
                    } else {
                        return $q.when(testEmailAddress);
                    }
                });

                mock.logoff = jasmine.createSpy('logoff').and.callFake(function () {
                    if (rejectLogoffPromise) {
                        mock.errorMessage = testErrorMessage;
                        return $q.reject('rejected');
                    } else {
                        return $q.when();
                    }
                });

                mock.setPassword = jasmine.createSpy('setPassword').and.callFake(function () {
                    if (rejectSetPasswordPromise) {
                        mock.errorMessage = testErrorMessage;
                        return $q.reject('rejected');
                    } else {
                        return $q.when();
                    }
                });

                mock.register = jasmine.createSpy('register').and.callFake(function () {
                    if (rejectRegisterPromise) {
                        mock.errorMessage = testErrorMessage;
                        return $q.reject('rejected');
                    } else {
                        return $q.when(testEmailAddress);
                    }
                });

                return mock;
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

    describe('changePassword success', function () {
        it('should not be rejected and should clear passwords', function () {
            rejectChangePasswordPromise = false;
            $controller.password = testValidPassword;
            $controller.newPassword = testValidPassword;
            $controller.confirmPassword = testValidPassword;
            mockSecurityData.clearErrorMessage();

            $controller.changePassword();

            $rootScope.$digest();

            expect(mockSecurityData.changePassword).toHaveBeenCalled();
            expect($controller.password).toEqual(undefined);
            expect($controller.newPassword).toEqual(undefined);
            expect($controller.confirmPassword).toEqual(undefined);
            expect(mockSecurityData.errorMessage).toEqual(undefined);
        });
    });

    describe('login success', function () {
        it('should set userName and clear password', function () {
            rejectLoginPromise = false;
            $controller.email = testEmailAddress;
            $controller.password = testValidPassword;
            $controller.rememberMe = true;
            mockSecurityData.clearErrorMessage();

            $controller.login();

            $rootScope.$digest();

            expect(mockSecurityData.login).toHaveBeenCalled();
            expect($controller.userName).toEqual(testEmailAddress);
            expect($controller.password).toEqual(undefined);
            expect(mockSecurityData.errorMessage).toEqual(undefined);
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
            mockSecurityData.clearErrorMessage();

            $controller.login();

            $rootScope.$digest();

            expect(mockSecurityData.login).toHaveBeenCalled();
            expect($controller.userName).toEqual(testEmailAddress);

            $controller.logoff();

            $rootScope.$digest();

            expect(mockSecurityData.logoff).toHaveBeenCalled();
            expect($controller.userName).toEqual(undefined);
            expect(mockSecurityData.errorMessage).toEqual(undefined);
        });
    });

    describe('register success', function () {
        it('should not be rejected, should set email and should clear passwords', function () {
            rejectRegisterPromise = false;
            $controller.email = testEmailAddress;
            $controller.password = testValidPassword;
            $controller.confirmPassword = testValidPassword;
            mockSecurityData.clearErrorMessage();

            var wasRejected = false;
            $controller.register()
                .then(function (data) { },
                function () {
                    wasRejected = true;
                });

            $rootScope.$digest();

            expect(mockSecurityData.register).toHaveBeenCalled();
            expect($controller.email).toEqual(testEmailAddress);
            expect($controller.password).toEqual(undefined);
            expect($controller.newPassword).toEqual(undefined);
            expect($controller.confirmPassword).toEqual(undefined);
            expect(mockSecurityData.errorMessage).toEqual(undefined);
        });
    });

    describe('setPassword success', function () {
        it('should not be rejected and should clear passwords', function () {
            rejectSetPasswordPromise = false;
            $controller.password = testValidPassword;
            $controller.newPassword = testValidPassword;
            $controller.confirmPassword = testValidPassword;
            mockSecurityData.clearErrorMessage();

            $controller.setPassword();

            $rootScope.$digest();

            expect(mockSecurityData.setPassword).toHaveBeenCalled();
            expect($controller.newPassword).toEqual(undefined);
            expect($controller.confirmPassword).toEqual(undefined);
            expect(mockSecurityData.errorMessage).toEqual(undefined);
        });
    });

    describe('changePassword failure', function () {
        it('should be rejected and should clear passwords', function () {
            rejectChangePasswordPromise = true;
            $controller.password = testValidPassword;
            $controller.newPassword = testValidPassword;
            $controller.confirmPassword = testInvalidPassword;
            mockSecurityData.clearErrorMessage();

            var wasRejected = false;
            $controller.changePassword()
                .then(function () { },
                function () {
                    wasRejected = true;
                });

            $rootScope.$digest();

            expect(mockSecurityData.changePassword).toHaveBeenCalled();
            expect($controller.password).toEqual(undefined);
            expect($controller.newPassword).toEqual(undefined);
            expect($controller.confirmPassword).toEqual(undefined);
            expect(mockSecurityData.errorMessage).toEqual(testErrorMessage);
            expect(wasRejected).toEqual(true);
        });
    });

    describe('login rejected', function () {
        it('should be rejected and should clear userName', function () {
            rejectLoginPromise = true;
            $controller.email = testEmailAddress;
            $controller.password = 'test';
            $controller.rememberMe = true;
            //$controller.userName = undefined;
            mockSecurityData.clearErrorMessage();

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
            expect(mockSecurityData.errorMessage).toEqual(testErrorMessage);
        });
    });

    describe('logoff rejected', function () {
        it('should be rejected', function () {
            rejectLoginPromise = false;
            rejectLogoffPromise = true;
            $controller.email = testEmailAddress;
            $controller.password = 'test';
            $controller.rememberMe = true;
            //$controller.userName = undefined;
            mockSecurityData.clearErrorMessage();

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
            expect(mockSecurityData.errorMessage).toEqual(testErrorMessage);
        });
    });

    describe('register failure', function () {
        it('should be rejected, should clear passwords', function () {
            rejectRegisterPromise = true;
            $controller.email = testEmailAddress;
            $controller.password = testValidPassword;
            $controller.confirmPassword = testValidPassword;
            mockSecurityData.clearErrorMessage();

            var wasRejected = false;
            $controller.register()
                .then(function () { },
                function () {
                    wasRejected = true;
                });

            $rootScope.$digest();

            expect(mockSecurityData.register).toHaveBeenCalled();
            expect($controller.password).toEqual(undefined);
            expect($controller.confirmPassword).toEqual(undefined);
            expect(mockSecurityData.errorMessage).toEqual(testErrorMessage);
        });
    });

    describe('setPassword failure', function () {
        it('should be rejected and should clear passwords', function () {
            rejectSetPasswordPromise = true;
            $controller.password = testValidPassword;
            $controller.newPassword = testValidPassword;
            $controller.confirmPassword = testInvalidPassword;
            mockSecurityData.clearErrorMessage();

            var wasRejected = false;
            $controller.setPassword()
                .then(function () { },
                function () {
                    wasRejected = true;
                });

            $rootScope.$digest();

            expect(mockSecurityData.setPassword).toHaveBeenCalled();
            expect($controller.newPassword).toEqual(undefined);
            expect($controller.confirmPassword).toEqual(undefined);
            expect(wasRejected).toEqual(true);
            expect(mockSecurityData.errorMessage).toEqual(testErrorMessage);
        });
    });
});
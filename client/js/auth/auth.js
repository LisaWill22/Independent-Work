'use strict';

angular.module('auth', [
        'ui.router'
    ]).config(function($stateProvider) {
        $stateProvider
            .state('app.auth', {
                abstract: true,
                controller: 'AuthCtrl',
                views: {
                    'container': { templateUrl: 'auth/views/index.html' }
                }
            })
            .state('app.auth.login', {
                url: '/login',
                templateUrl: 'auth/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('app.auth.logout', {
                url: '/logout',
                templateUrl: 'auth/views/logout.html',
                controller: 'LogoutCtrl'
            })
            .state('app.auth.forgot-password', {
                url: '/forgot-password',
                templateUrl: 'auth/views/forgot-password.html',
                controller: 'ForgotPasswordCtrl'
            });
    });
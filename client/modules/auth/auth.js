'use strict';

angular.module('auth', [
        'ui.router'
    ]).config(function($stateProvider) {
        $stateProvider
            .state('app.auth', {
                controller: 'AuthCtrl',
                views: {
                    'container': { templateUrl: '/modules/auth/views/index.html' }
                }
            })
            .state('app.auth.login', {
                url: '/login',
                templateUrl: '/modules/auth/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('app.auth.logout', {
                url: '/logout',
                templateUrl: '/modules/auth/views/logout.html',
                controller: 'LogoutCtrl'
            });
    });

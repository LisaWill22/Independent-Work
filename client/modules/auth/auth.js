'use strict';

angular.module('auth', [
        'ui.router'
    ]).config(function($stateProvider) {
        $stateProvider
            .state('app.login', {
                url: '/login',
                views: {
                    'container': { templateUrl: '/modules/auth/views/login.html' }
                }
            })
            .state('app.logout', {
                url: '/logout',
                views: {
                    'container': { templateUrl: '/modules/auth/views/logout.html' }
                }
            });
    });

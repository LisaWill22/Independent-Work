'use strict';

angular.module('settings', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider){

        $stateProvider
            .state('app.settings', {
                url: '/settings',
                abstract: true,
                views: {
                    'container': {
                        templateUrl: 'settings/views/index.html',
                        controller: 'SettingsCtrl'
                    }
                }
            })
            // All user profile settings
            .state('app.settings.profile', {
                url: '/profile',
                controller: 'ProfileCtrl',
                templateUrl: 'settings/views/profile.html'
            })
            .state('app.settings.account', {
                url: '/account',
                controller: 'AccountSettingsCtrl',
                templateUrl: 'settings/views/account.html'
            })
            .state('app.settings.messaging', {
                url: '/messaging',
                controller: 'MsgSettingsCtrl',
                templateUrl: 'settings/views/messaging.html'
            })
            // Employer specific
            .state('app.settings.postings', {
                url: '/postings',
                controller: 'PostingSettingsCtrl',
                templateUrl: 'settings/views/postings.html'
            });
            // Contractor specific
    });

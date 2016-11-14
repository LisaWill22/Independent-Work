'use strict';

angular.module('contractors', [
        'ui.router',
        'ngAnimate'
    ])
    .config(function($stateProvider) {
        $stateProvider
            .state('app.contractors', {
                url: '/contractors',
                views: {
                    'container': {
                        controller: 'ContractorsCtrl',
                        templateUrl: 'contractors/views/index.html'
                    }
                }
            })
            .state('app.contractors.profile', {
                url: '/:id',
                controller: 'ContractorProfileCtrl',
                templateUrl: 'contractors/views/profile.html'
            })
    });

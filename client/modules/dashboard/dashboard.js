'use strict';

angular.module('dashboard', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider){

        $stateProvider
            .state('app.dash', {
                url: '/dash',
                controller: 'DashCtrl',
                views: {
                    'container': { templateUrl: '/modules/dash/views/dash.html' }
                }
            });
    });

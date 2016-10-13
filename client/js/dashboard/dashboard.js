'use strict';

angular.module('dashboard', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider){

        $stateProvider
            .state('app.dashboard', {
                url: '/dashboard',
                controller: 'DashCtrl',
                views: {
                    'container': { templateUrl: 'dashboard/views/index.html' }
                }
            });
    });

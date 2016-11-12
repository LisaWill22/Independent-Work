'use strict';

angular.module('dashboard', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider){

        $stateProvider
            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'container': {
                        controller: 'DashboardCtrl',
                        templateUrl: 'dashboard/views/index.html'
                    }
                }
            });
    });

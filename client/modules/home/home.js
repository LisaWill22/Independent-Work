'use strict';

angular.module('home', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('app.home', {
                url: '/',
                views: {
                    'container': { templateUrl: '/modules/home/views/index.html' },
                    'top@app.home': { templateUrl: '/modules/home/views/top.html' },
                    'mission@app.home': { templateUrl: '/modules/home/views/mission.html' },
                    'independent@app.home': { templateUrl: '/modules/home/views/independent.html' },
                    'new_way@app.home': { templateUrl: '/modules/home/views/new_way.html' },
                    'join@app.home': { templateUrl: '/modules/home/views/join.html' },
                    'contact@app.home': { templateUrl: '/modules/home/views/contact.html' }
                }
            });

    });

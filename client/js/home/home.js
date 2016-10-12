'use strict';

angular.module('home', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider){

        $stateProvider
            .state('app.home', {
                url: '/',
                views: {
                    'container': { templateUrl: '/js/home/views/index.html' },
                    'top@app.home': { templateUrl: '/js/home/views/top.html' },
                    'mission@app.home': { templateUrl: '/js/home/views/mission.html' },
                    'independent@app.home': { templateUrl: '/js/home/views/independent.html' },
                    'new_way@app.home': { templateUrl: '/js/home/views/new_way.html' },
                    'join@app.home': { templateUrl: '/js/home/views/join.html' },
                    'contact@app.home': { templateUrl: '/js/home/views/contact.html' }
                }
            });

    });

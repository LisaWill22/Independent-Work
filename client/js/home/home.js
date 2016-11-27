'use strict';

angular.module('home', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider){

        $stateProvider
            .state('app.home', {
                url: '/',
                views: {
                    'container': { templateUrl: 'home/views/index.html' },
                    'top@app.home': { templateUrl: 'home/views/top.html' },
                    'mission@app.home': { templateUrl: 'home/views/mission.html' },
                    'independent@app.home': { templateUrl: 'home/views/independent.html' },
                    'new_way@app.home': { templateUrl: 'home/views/new_way.html' },
                    'join@app.home': { templateUrl: 'home/views/join.html' },
                    'contact@app.home': {
                        controller: 'ContactFormCtrl',
                        templateUrl: 'home/views/contact.html'
                    }
                }
            });

    });

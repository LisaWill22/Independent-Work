var app = angular.module('independent-work-app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider

    .state('home', {
        url: '/',
        views: {
            'container': { templateUrl: '/templates/home/index.html' },
            'top@home': { templateUrl: '/templates/home/top.html' },
            'mission@home': { templateUrl: '/templates/home/mission.html' },
            'independent@home': { templateUrl: '/templates/home/independent.html' },
            'new_way@home': { templateUrl: '/templates/home/new_way.html' },
            'join@home': { templateUrl: '/templates/home/join.html' },
            'contact@home': { templateUrl: '/templates/home/contact.html' }
        }
    })
});
var app = angular.module('independent-work-app', ['ngAnimate','ui.router']);

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
    .state('login', {
        url: '/login',
        views: {
            'container': { templateUrl: '/templates/account/login.html' }
        }
    })
    .state('signup', {
        url: '/signup',
        views: {
            'container': { templateUrl: '/templates/account/signup.html' }
        }
    })
});
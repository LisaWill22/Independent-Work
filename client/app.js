var app = angular.module('independent-work-app', [
    'ngAnimate',
    'ui.router',
    'home',
    'auth',
    'signup',
    'dashboard'
]);

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('app', {
            templateUrl: 'layout.html',
            controller: 'AppCtrl',
            abstract: true
        });
});

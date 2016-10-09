var app = angular.module('independent-work-app', [
    'ngAnimate',
    'ui.router',
    'home',
    'auth',
    'signup'
]);

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('app', {
            template: '<div ui-view="container"></div>',
            controller: 'AppCtrl',
            abstract: true
        });
});

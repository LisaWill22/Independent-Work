var app = angular.module('independent-work-app', [
    'ngAnimate',
    'ui.router',
    // IW modules
    'home',
    'auth',
    'signup',
    'dashboard',
    // third party components
    'toastr'
]);

app.config(function($stateProvider, $urlRouterProvider, toastrConfig){
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('app', {
            templateUrl: 'layout.html',
            controller: 'AppCtrl',
            abstract: true
        });

    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right'
    });
});

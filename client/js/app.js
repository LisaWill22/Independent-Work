var app = angular.module('independent-work-app', [
    'ngAnimate',
    // third party components
    'toastr',
    'ui.router',
    'ngStorage',
    'angular-loading-bar',
    // IW modules
    'app.templates',
    'home',
    'auth',
    'signup',
    'dashboard'
]);

app.config(function($stateProvider, $urlRouterProvider, $localStorageProvider, toastrConfig){
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('app', {
            templateUrl: 'partials/layout.html',
            controller: 'AppCtrl',
            abstract: true
        });

    // Set the toastr configs
    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right'
    });

    // Set up local storage prefix
    $localStorageProvider.setKeyPrefix('iw-app');
});

var app = angular.module('independent-work-app', [
    'ngAnimate',
    'ui.router',
    // IW modules
    'app.templates',
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
            templateUrl: 'partials/layout.html',
            controller: 'AppCtrl',
            abstract: true
        });

    // Set the toastr configs
    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right'
    });
});

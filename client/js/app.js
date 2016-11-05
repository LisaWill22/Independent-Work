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
    'dashboard',
    'settings',
    // Generic Services
    'SessionService'
]);

app.config(function($stateProvider, $urlRouterProvider, $localStorageProvider, $compileProvider, toastrConfig){

    // Send the user to the home page if they get a bad route
    $urlRouterProvider.otherwise('/');

    // Register the base app state
    $stateProvider
        .state('app', {
            templateUrl: 'partials/layout.html',
            controller: 'AppCtrl',
            abstract: true,
            resolve: {
                session: function(Session) {
                    return Session.refreshSession();
                }
            }
        });

    // Set the toastr configs
    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right'
    });

    // Set up local storage prefix
    $localStorageProvider.setKeyPrefix('iw-app');

    // Performance enhancement
    $compileProvider.debugInfoEnabled(false);
});

app.run(function() {

});

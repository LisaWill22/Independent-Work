'use strict';

angular.module('signup', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('app.signup', {
                url: '/signup',
                controller: 'SignupCtrl',
                views: {
                    'container': { templateUrl: '/modules/signup/views/signup.html' }
                }
            })
            .state('app.signup.contractor', {
                url: '/contractor',
                controller: 'ContractorSignupCtrl',
                templateUrl: '/modules/signup/views/signup-contractor.html'
            })
            .state('app.signup.employer', {
                url: '/employer',
                controller: 'EmployerSignupCtrl',
                templateUrl: '/modules/signup/views/signup-employer.html'
            });
    });

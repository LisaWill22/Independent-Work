'use strict';

angular.module('signup', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider){

        $stateProvider
            .state('app.signup', {
                url: '/signup',
                views: {
                    'container': {
                        controller: 'SignupCtrl',
                        templateUrl: 'signup/views/index.html'
                    }
                }
            })
            .state('app.signup.contractor', {
                url: '/contractor',
                controller: 'ContractorSignupCtrl',
                templateUrl: 'signup/views/signup-contractor.html'
            })
            .state('app.signup.employer', {
                url: '/employer',
                controller: 'EmployerSignupCtrl',
                templateUrl: 'signup/views/signup-employer.html'
            });
    });

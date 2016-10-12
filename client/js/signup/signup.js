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
                        templateUrl: '/js/signup/views/index.html'
                    }
                }
            })
            .state('app.signup.contractor', {
                url: '/contractor',
                controller: 'ContractorSignupCtrl',
                templateUrl: '/js/signup/views/signup-contractor.html'
            })
            .state('app.signup.employer', {
                url: '/employer',
                controller: 'EmployerSignupCtrl',
                templateUrl: '/js/signup/views/signup-employer.html'
            });
    });

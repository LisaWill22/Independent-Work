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
                abstract: true,
                controller: 'ContractorSignupCtrl',
                templateUrl: 'signup/views/index.html'
            })
            .state('app.signup.contractor.one', {
                url: '/step-one',
                controller: 'ContractorSignupOneCtrl',
                templateUrl: 'signup/views/signup-contractor-1.html'
            })
            .state('app.signup.contractor.two', {
                url: '/step-two',
                controller: 'ContractorSignupTwoCtrl',
                templateUrl: 'signup/views/signup-contractor-2.html'
            })
            .state('app.signup.employer', {
                url: '/employer',
                controller: 'EmployerSignupCtrl',
                abstract:true,
                templateUrl: 'signup/views/index.html'
            })
            .state('app.signup.employer.one', {
                url: '/step-one',
                controller: 'EmployerSignupOneCtrl',
                templateUrl: 'signup/views/signup-employer-1.html'
            })
            .state('app.signup.employer.two', {
                url: '/step-two',
                controller: 'EmployerSignupTwoCtrl',
                templateUrl: 'signup/views/signup-employer-2.html'
            });
    });

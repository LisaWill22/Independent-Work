'use strict';

var app = angular.module('independent-work-app', [
	'ngAnimate',
	'ngSanitize',
	'ngMessages',
	// third party components
	'toastr',
	'ui.router',
	'ui.select',
	'ui.bootstrap',
	'ui.tinymce',
    'ui.mask',
	'ngStorage',
	'ngFileUpload',
	'ngImgCrop',
	'angular-loading-bar',
	'btford.socket-io',
	'base64',
	'mgcrea.bootstrap.affix',
	'angular.vertilize',
    // Handles .env based configs
    'environment',
	// IW modules
	'app.templates',
	'auth',
	'chat',
	'contractors',
	'dashboard',
	'home',
	'signup',
	'posts',
	'settings',
	// Generic components
    'appValues',
    'appFilters',
	'boForm',
	// Generic Services
	'SessionService'
]);

app.config(function($stateProvider, $urlRouterProvider, $localStorageProvider, $compileProvider, $locationProvider, toastrConfig, envServiceProvider) {

	// Send the user to the home page if they get a bad route
	$urlRouterProvider.otherwise('/');


	window.Intercom('boot', {
   app_id: 'opo8zis9'
});


	// Register the base app state
	$stateProvider
		.state('app', {
			templateUrl: 'partials/layout.html',
			controller: 'AppCtrl',
			abstract: true,
			resolve: {
				session: function(Session) {
					return Session.refreshSession();
				},
				skills: function($http) {
					return $http.get('/api/skills');
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

    // Set up environment based configs // set the domains and variables for each environment
    envServiceProvider.config({
        domains: {
            development: ['localhost'],
            production: ['independentwork.com', 'launchpeer-iw.herokuapp.com', 'www.independentwork.com']
        },
        vars: {
            development: {
                socketUrl: 'http://localhost:3000',
            },
            production: {
                socketUrl: 'https://independentwork.com',
            }
        }
    });

    // run the environment check, so the comprobation is made
    // before controllers and services are built
    envServiceProvider.check();
});

app.run(function($timeout, $rootScope) {

	// override ui-router scrolling
	$rootScope.$on('$stateChangeSuccess', function() {
		window.scrollTo(0, 0);
	});

	// handles initial page loading animations
	$timeout(function () {
	    $('#app-container').css('opacity', 1);
	    $('#home-loading').css('opacity', 0);
	}, 1500);
	$timeout(function () {
	    $('#home-loading').remove();
	}, 1501);

	// TODO: Move this to a factory
	// Init WOW for animations on scroll
	var wow = new WOW({
		boxClass: 'wow', // animated element css class (default is wow)
		animateClass: 'animated', // animation css class (default is animated)
		offset: 0, // distance to the element when triggering the animation (default is 0)
		mobile: true, // trigger animations on mobile devices (default is true)
		live: true, // act on asynchronously loaded content (default is true)
		callback: function(box) {
			// the callback is fired every time an animation is started
			// the argument that is passed in is the DOM node being animated
		},
		scrollContainer: null // optional scroll container selector, otherwise use window
	});
	wow.init();

	// Set up window var for some plugins
	window.angular = angular;

});

//Service to interact with the socket library
app.factory('socket', function (socketFactory, envService) {
	const socketServerUrl = envService.read('socketUrl');

    var myIoSocket = io.connect(socketServerUrl);

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
});

// Used in UI select

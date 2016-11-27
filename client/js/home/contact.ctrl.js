'use strict';

angular.module('home')
    .controller('ContactFormCtrl', function($scope, $rootScope, toastr) {

        console.log('ContactFormCtrl loaded >>', $scope);

        $rootScope.hideFooter = false;

        $scope.onError = function() {
            toastr.warning('There was an error submitting the contact form. Please try again soon.');
        };

        $scope.beforeSubmit = function () {
            // Mail options from the server generic send mail route
            // let mailOptions = {
            //     from: 'node-litemailer@rainbows.com', // sender address
            //     to: 'info@node-litemailer.com', // list of receivers
            //     subject: 'Hello - sent from node-litemailer', // Subject line
            //     text: 'Hello world !', // plaintext body
            //     html: '<b>Hello world !</b>' // html body
            // };
            $scope.data = {
                from: 'contactFormSubmit@independentwork.com',
                to: 'brentoneill@gmail.com',
                // to: 'lisa@independentwork.com',
                subject: 'You have a new contact form submission from ' + $scope.data.name,
                text: $scope.data.message,
                html: '<p>' + $scope.data.message + '</p>'
            };
        };

        $scope.afterSubmit = function() {
            $scope.data = {};
            $scope.contactForm.$setPristine();
            toastr.success('Your message was submitted successfully! Someone from IW will contact you soon.');
        };
    });

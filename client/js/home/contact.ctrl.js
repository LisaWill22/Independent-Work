'use strict';

angular.module('home')
    .controller('ContactFormCtrl', function($scope, $rootScope, toastr) {

        console.log('ContactFormCtrl loaded >>', $scope);
        console.log("Contact Form Controller", $scope.data);

        $rootScope.hideFooter = false;

        $scope.onError = function() {
            toastr.warning('There was an error submitting the contact form. Please try again soon.');
        };

        $scope.contactEmail = 'hello@independentwork.com';
        $scope.contactPhone = '8778744820';
        $scope.contactAddress = {
            streetAddress: {
                line1: 'PO Box 44472',
                line2: null
            },
            city: 'Tacoma',
            state: 'WA',
            zip: 98448
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
                from: 'contact.form.submit@independentwork.com',
                // to: 'hello@independentwork.com',
                to: $scope.contactEmail,
                subject: 'You have a new contact form submission from ' + $scope.data.name,
                text: $scope.data.message,
                html: '<p>' + $scope.data.message + '</p>'
            };
        };

        $scope.afterSubmit = function() {
            console.log($scope);
            $scope.contactForm.$setPristine();
            toastr.success('Your message was submitted successfully! Someone from IW will contact you soon.');

            $timeout(function() {
                $scope.data = {};
            }, 250);
        };
    });

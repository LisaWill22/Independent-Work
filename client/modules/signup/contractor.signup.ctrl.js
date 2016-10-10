'use strict';

angular.module('signup')
    .controller('ContractorSignupCtrl', function($scope, $http, $state) {
        console.log('ContractorSignupCtrl loaded >>', $scope);
        $scope.data = {};
        $scope.signup = function () {
            console.log('clicked');
            $http.post('/auth/signup', $scope.data)
                .then(function(response) {
                    console.log(response);
                }, function(err) {
                    console.log(err);
                });
        };

    });

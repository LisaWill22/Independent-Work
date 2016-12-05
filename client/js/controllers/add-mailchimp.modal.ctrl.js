'use strict';

angular.module('independent-work-app')
    .controller('addToMailChimpModalCtrl', function($scope, $rootScope, $uibModalInstance, $http, toastr) {
        console.log('addToMailChimpModalCtrl >>', $scope);

        $scope.data = {};
        $scope.success = false;

        $scope.addToList = function() {
            return $http.post(mailChimpUrl, $scope.data)
                .then(function(res) {
                    console.log(res);
                })
                .catch(function(err) {
                    console.log(err);
                })
        }
    });

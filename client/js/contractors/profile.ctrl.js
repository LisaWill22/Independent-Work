'use strict';

angular.module('contractors')
    .controller('ContractorProfileCtrl', function($scope, $http, $state, $stateParams) {

        console.log('ContractorProfileCtrl loaded >>', $scope);
        $scope.data = {};
        $scope.$parent.hideTitle = true;

        if ($stateParams.id) {
            $http.get('/api/users/' + $stateParams.id)
                .then(function(res) {
                    $scope.contractor = res.data;
                })
        } else {
            $state.go('app.contractors');
        }

        $scope.sendMessage = function(contractor) {
            console.log(contractor);
            console.log($scope.data.message);
            $scope.data.message = null;
        };

    });

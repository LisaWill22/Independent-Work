'use strict';

angular.module('contractors')
    .controller('ContractorProfileCtrl', function($scope, $http, $state, $stateParams, toastr) {

        console.log('ContractorProfileCtrl loaded >>', $scope);

        $scope.data = {};
        $scope.$parent.hideTitle = true;

        if ($stateParams.id) {
            $scope.loading = true;
            getContractor()
                .then(function(res) {
                    $scope.contractor = res.data;
                    console.log($scope.contractor);
                    $scope.loading = false;
                })
                .catch(function(err) {
                    toastr.warning('Oops, something went wrong..');
                    $scope.loading = false;
                });
        } else {
            $state.go('app.contractors');
        }

        $scope.sendMessage = function(contractor) {
            $scope.data.message = null;
            console.log("SENDING CHAT");
        };

        function getContractor() {
            return $http.get('/api/users/' + $stateParams.id);
        }

    });

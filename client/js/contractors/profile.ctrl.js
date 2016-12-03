'use strict';

angular.module('contractors')
    .controller('ContractorProfileCtrl', function($scope, $http, $state, $stateParams, toastr) {

        console.log('ContractorProfileCtrl loaded >>', $scope);

        $scope.data = {};
        $scope.$parent.hideTitle = true;

        $scope.loading = true;
        
        if ($stateParams.id) {
            $http.get('/api/users/' + $stateParams.id)
                .then(function(res) {
                    $scope.contractor = res.data;
                    getProfileImg();
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
        };

        function getProfileImg() {
            // Get profile image
            return $http.get('/api/users/' + $scope.contractor._id + '/profile-image')
                .then(function(res) {
                    $scope.contractorImageUrl = res.data.image;
                    $scope.loading = false;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }

    });

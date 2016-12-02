'use strict';

angular.module('contractors')
    .controller('ContractorProfileCtrl', function($scope, $http, $state, $stateParams) {

        console.log('ContractorProfileCtrl loaded >>', $scope);

        $scope.data = {};
        $scope.$parent.hideTitle = true;

        if ($stateParams.id) {
            setTimeout(function() {
                $scope.loading = true;
            }, 300);
            $http.get('/api/users/' + $stateParams.id)
                .then(function(res) {
                    $scope.contractor = res.data;
                    getProfileImg();
                })
        } else {
            $state.go('app.contractors');
        }

        $scope.sendMessage = function(contractor) {
            console.log(contractor);
            console.log($scope.data.message);
            $scope.data.message = null;
        };

        function getProfileImg() {
            // Get profile image
            return $http.get('/api/user/' + $scope.contractor._id + '/profile-image')
                .then(function(res) {
                    $scope.contractorImageUrl = res.data.image;
                    $scope.loading = false;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }

    });

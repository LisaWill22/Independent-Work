'use strict';

angular.module('settings')
    .controller('ProfileCtrl', function($scope, $http, toastr) {

        console.log('ProfileCtrl loaded >>', $scope);

        $scope.data = angular.copy($scope.currentUser);
        $scope.data.showEmail = 'true';

        $scope.saveProfile = function() {
            $http.put('/api/users/' + $scope.currentUser._id, $scope.data)
                .then(function(res) {
                    $scope.$emit('Session:refresh', res.data.user);
                    toastr.success('Your profile saved successfully!');
                })
                .catch(function(err) {
                    toastr.warning('Whoops, something went wrong...\n ' + err);
                })
                .finally(function() {

                });
        };

        $http.get('/api/skills')
            .then(function(res){
                $scope.skills = res.data;
            })
            .catch(function(err) {
                $scope.skills = [];
            })
            .finally(function() {

            });
    });

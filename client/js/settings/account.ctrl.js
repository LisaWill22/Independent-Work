'use strict';

angular.module('settings')
    .controller('AccountSettingsCtrl', function($scope, toastr) {
        console.log('AccountSettingsCtrl loaded >>', $scope);
        $scope.data = angular.copy($scope.currentUser);

        $scope.onError = function(err) {
             console.log(err);
             toastr.warning('Ooops! Something went wrong...');
        }

        $scope.beforeSubmit = function() {

        };

        $scope.afterSubmit = function(res) {
            $scope.data = angular.copy($scope.currentUser);
            toastr.success('Your password was updated successfully!')
        };
    });

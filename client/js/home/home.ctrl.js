'use strict';

angular.module('home')
    .controller('HomeCtrl', function($scope, $rootScope, $timeout, toastr) {
        $rootScope.hideFooter = false;

        console.log('HOME ctrl loaded > ', $scope);

        $scope.onError = function(err) {
            console.log(err);
        };

        $scope.afterSubmit = function(res) {
            $scope.data.email = '';
            $scope.successMessage = res.msg;
            $scope.subscribeForm.$setPristine();
            $scope.subscribeForm.$setUntouched();
            toastr.success('Your email address has been added to our list!');
            $timeout(function() {
                $scope.successMessage = null;
            }, 30000);
        };

        $('#subscribe').ajaxChimp({
            url: "//independentwork.us13.list-manage.com/subscribe/post?u=1caaabe4f2e84eeb4df6c6745&amp;id=fb2065f650",
            callback: $scope.afterSubmit
        });
    });

'use strict';

angular.module('posts')
    .controller('PostDetailCtrl', function($scope, $http, $stateParams, toastr) {

        console.log('PostDetailCtrl loaded >>', $scope);

        refreshPost();

        $scope.$on('Post:refresh', function() {
            refreshPost();
        });

        function refreshPost() {
            $scope.loading = true;
            $http.get('/api/posts/' + $stateParams.id)
                .then(function(res) {
                    console.log(res.data);
                    $scope.post = res.data;
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('Whoops, there was an error loading that post. Please try again.');
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }
    });

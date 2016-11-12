'use strict';

angular.module('dashboard')
    .controller('DashboardCtrl', function($scope, $http, $timeout, toastr) {
        console.log('DashboardCtrl loaded >>', $scope);

        $scope.loading = true;

        // Load in projects
        $http.get('/api/projects')
            .then(function(res) {
                $timeout(function() {
                    $scope.projects = res.data;
                    $scope.loading = false;
                }, 1000);
            })
            .catch(function(err) {
                console.log(err);
                toastr.warning('There was an error getting projects. Please try again');
            })
    });

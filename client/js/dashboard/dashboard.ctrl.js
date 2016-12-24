'use strict';

angular.module('dashboard')
    .controller('DashboardCtrl', function(skills, $scope, $rootScope, $http, $timeout, toastr) {
        console.log('DashboardCtrl loaded >>', $scope);

        $rootScope.hideFooter = true;
        $scope.searchDone = false;
        $scope.filtersCollapsed = true;

        $scope.data = {};
        $scope.data.query = '';
        $scope.skills = skills.data;
        $scope.data.skillsMatch = 'any';

        // Load in postings
        if ($scope.contractor) {
            $scope.loading = true;
            getPosts();
        }

        // Load all contractors (paginated?)
        if ($scope.employer) {
            $scope.loading = true;
            doSearch();
        }

        // throttle the search to prevent duplications
        var dbSearch = _.throttle(doSearch);

        $rootScope.$on('Posts:reload', function() {
            $scope.loading = true;
            getPosts();
        });

        // Adds back skill to list of options on removal
        $scope.onSkillRemove = function(item, model) {
            if ($scope.skills.indexOf(item) === -1) {
                $scope.skills.push(item);
            }
        };

        $scope.doSearch = function() {
            dbSearch();
        };

        // Filter by skills
        // $scope.$watch('data.skillsToFilterBy', function(newVal, oldVal) {
        //     if (!angular.equals(newVal, oldVal) && $scope.searchDone && $scope.items && $scope.items.length) {
        //         if ($scope.data.skillsMatch === 'any') {
        //             $scope.items = _.filter($scope.items, function(contractor) {
        //                 $scope.data.skillsToFilterBy.forEach(function(skill) {
        //                     if (contractor.skills.indexOf(skill) >= 0) {
        //                         return contractor;
        //                     }
        //                 });
        //             })
        //         } else if ($scope.data.skillsMatch === 'all') {
        //             $scope.items = _.filter($scope.items, function(contractor) {
        //                 return angular.equals(contractor.skills, $scope.data.skillsToFilterBy);
        //             });
        //         }
        //     } else if (!newVal) {
        //
        //     }
        // });
        //
        // $scope.$watch('data.locationToFilterBy', function(newVal, oldVal) {
        //
        // });

        function doSearch () {
            $scope.loading = true;
            $scope.searchDone = false;
            $scope.data.skillsToFilterBy = null;
            $http.get('/sapi/search/contractors?query=' + $scope.data.query)
                .then(function(res) {
                    console.log(res);
                    if (res.data.users && res.data.users.length) {
                        $scope.items = _.filter(res.data.users, function(user) {
                            return user.roles && user.roles.indexOf('contractor') !== -1 && user.firstName;
                        });
                    } else {
                        console.log('no items');
                        $scope.items = null;
                    }

                    $scope.oldQuery = angular.copy($scope.data.query);
                    console.log($scope.oldQuery);
                    $scope.loading = false;
                    $scope.searchDone = true;
                })
                .catch(function(err) {
                    console.error(err);
                    toastr.warning('Dang boss! Something went wrong...');
                    $scope.items = null;
                    $scope.oldQuery = angular.copy($scope.data.query);
                    $scope.loading = false;
                    $scope.searchDone = true;
                });
        }

        function getPosts() {
            return $http.get('/api/posts/dashboard/includes=skills,user')
                .then(function(res) {
                    $timeout(function() {
                        $scope.items = _.sortBy(res.data.posts, '_createdDate').reverse();
                        $scope.loading = false;
                    }, 1000);
                })
                .catch(function(err) {
                    console.error(err);
                    toastr.warning('There was an error getting projects. Please try again');
                });
        }

    });

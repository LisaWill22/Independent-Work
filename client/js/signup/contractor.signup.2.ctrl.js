'use strict';

angular.module('signup')
	.controller('ContractorSignupTwoCtrl', function($scope, $state, $timeout, toastr, states, skills, $http) {
		console.log('ContractorSignupTwoCtrl loaded >>', $scope);

		$scope.states = states;

		$scope.skills = skills.data;


		if (!$scope.currentUser) {
			return $state.go('app.signup.contractor.one');
		}

		$scope.onError = function(err) {
			console.error(err);
			toastr.error('There was an error creating updating your account. Please try again.');
		};

		$scope.afterSubmit = function(res) {
			$scope.$emit('Session:refresh', res.data.user);
			$timeout(function() {
				toastr.success('You have successfully updated your profile!');
				$state.go('app.dashboard');
			}, 300);
		};


		$scope.addSkill = function(skillName) {
      console.log(newSkill);

			var newSkill;

			var skillNameExists = $scope.skills.find(function(skill) {
				return skillName.toLowerCase() === skill.name.toLowerCase();
			});

			// Prevent the skill from adding if it already exists
			if (!skillNameExists) {
				newSkill = {
					name: skillName,
					description: null,
					cateogries: [],
					_created: new Date()
				};
			} else {
				newSkill = null;
			}

			return newSkill;
		};



	});

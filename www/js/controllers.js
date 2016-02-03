angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {

})

.controller('resetPasswordCtrl', function($scope) {

})

.controller('createPasswordCtrl', function($scope) {

})

.controller('passwordSuccessCtrl', function($scope) {

})

.controller('termsAndConditionCtrl', function($scope) {

})

.controller('createLoginCtrl', function($scope,Sign,$state) {
  var account=$scope.account={
    username:'',
    password:''
  };

  $scope.onFormSubmit=onFormSubmit;

  function onFormSubmit(e){
    e.preventDefault();

    Sign.signup(account)
      .then(function(resp){
        $state.go('profile');
      })
      .catch(function(err){
        console.error(err);
      });
  }
})

.controller('profileCtrl', function($scope) {

})

.controller('scheduleCtrl', function($scope) {

})

.controller('plantsCtrl', function($scope) {

})

.controller('plantGrowthCtrl', function($scope) {

})

.controller('plantDetailsCtrl', function($scope) {

})

.controller('waterFrequencyCtrl', function($scope) {

})

.controller('plantGrowthListCtrl', function($scope) {

})

.controller('growthReadingCtrl', function($scope) {

})

angular.module('app.controllers', [])
  .controller('AppController',function($scope,Config,$ionicLoading){
    var events=Config.events;

    $scope.$on(events.REQUEST_START,function(){
      $ionicLoading.show('Loading...');
    });

    $scope.$on(events.RESPONSE,function(){
      $ionicLoading.hide()
    });

    $scope.$on(events.REQUEST_ERROR,function(){
      $ionicLoading.hide();
    });

    $scope.$on(events.RESPONSE_ERROR,function(){
      $ionicLoading.hide();
    });
  })
  .controller('loginCtrl', function ($scope) {

  })

  .controller('resetPasswordCtrl', function ($scope) {

  })

  .controller('createPasswordCtrl', function ($scope) {

  })

  .controller('passwordSuccessCtrl', function ($scope) {

  })

  .controller('termsAndConditionCtrl', function ($scope) {

  })

  //用户注册
  .controller('createLoginCtrl', function ($scope, Sign, $state) {
    var account = $scope.account = {
      username: '',
      password: '',
      repeatPassword:''
    };

    $scope.onFormSubmit = onFormSubmit;

    function onFormSubmit(e) {
      e.preventDefault();

      Sign.signup(account)
        .then(function (resp) {
          $state.go('profile');
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  })

  .controller('profileCtrl', function ($scope,Sign,$state) {
    var countryList=[
      {id:1,name:'China'},
      {id:2,name:'United States'},
      {id:3,name:'Krea'}
    ];

    var profile=$scope.profile={
      firstName:'',
      lastName:'',
      email:'',
      country:'',
      state:'',
      city:''
    };

    $scope.countryList=countryList;

    $scope.onProfileFormSubmit=onProfileFormSubmit;

    $scope.$watch('profile.country',function(n,o){
      console.log(n,o);
    },true);

    function onProfileFormSubmit(e){
      console.log(profile);
      Sign.updateProfile(profile)
        .then(function(resp){
          $state.go('tabsController.schedule')
        })
        .catch(function(err){
          console.log(err);
        });
    }

  })

  .controller('scheduleCtrl', function ($scope) {

  })

  .controller('plantsCtrl', function ($scope) {

  })

  .controller('plantGrowthCtrl', function ($scope) {

  })

  .controller('plantDetailsCtrl', function ($scope) {

  })

  .controller('waterFrequencyCtrl', function ($scope) {

  })

  .controller('plantGrowthListCtrl', function ($scope) {

  })

  .controller('growthReadingCtrl', function ($scope) {

  });

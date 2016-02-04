angular.module('app.controllers', [])
  .controller('AppController', function ($scope, Config, $ionicLoading, $timeout) {
    var events = Config.events;

    $scope.$on(events.REQUEST_START, function () {
      $ionicLoading.show({hideOnStateChange:true});
    });

    $scope.$on(events.RESPONSE, function () {
      hideLoading();
    });

    $scope.$on(events.REQUEST_ERROR, function () {
      hideLoading();
    });

    $scope.$on(events.RESPONSE_ERROR, function () {
      hideLoading();
    });

    function hideLoading() {
      $timeout(function () {
        $ionicLoading.hide();
      }, 0);
    }
  })
  .controller('LoginCtrl', function ($scope,Sign) {
    var account=$scope.account={};

    $scope.onFormSubmit=onFormSubmit;

    function onFormSubmit(e){
      Sign.signin(account)
        .then(function(){

        })
        .catch(function(err){

        });
    }
  })

  .controller('ResetPasswordCtrl', function ($scope,$ionicHistory,Sign,$state) {

    var vm=$scope.account={};

    $scope.onFormSubmit=function(){
      Sign.sendEmail(vm.email)
        .then(function(resp){
          $state.go('passwordCreate')
        })
        .catch(function(err){
          console.log(err);
        });
    };

    $scope.goBack=function(){
      $ionicHistory.goBack()
    };
  })

  .controller('CreatePasswordCtrl', function ($scope) {
    var vm=$scope.vm={};

    $scope.onFormSubmit=function(e){
      console.log(vm);
    };
  })

  .controller('PasswordSuccessCtrl', function ($scope) {

  })

  .controller('TermsAndConditionCtrl', function ($scope) {

  })

  //用户注册
  .controller('CreateLoginCtrl', function ($scope, Sign, $state) {
    var account = $scope.account = {
      username: '',
      password: '',
      repeatPassword: ''
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

  .controller('ProfileCtrl', function ($scope, Sign, $state) {
    var countryList = [
      {id: 1, name: 'China'},
      {id: 2, name: 'United States'},
      {id: 3, name: 'Krea'}
    ];

    var profile = $scope.profile = {
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      state: '',
      city: ''
    };

    $scope.countryList = countryList;

    $scope.onProfileFormSubmit = onProfileFormSubmit;

    $scope.$watch('profile.country', function (n, o) {
      console.log(n, o);
    }, true);

    function onProfileFormSubmit(e) {
      console.log(profile);
      Sign.updateProfile(profile)
        .then(function (resp) {
          $state.go('tabsController.schedule')
        })
        .catch(function (err) {
          console.log(err);
        });
    }

  })

  .controller('ScheduleCtrl', function ($scope) {

  })

  .controller('PlantsCtrl', function ($scope, Plant) {
    $scope.plantList = Plant.query();
  })

  .controller('PlantGrowthCtrl', function ($scope) {

  })

  .controller('PlantDetailsCtrl', function ($scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/waterFrequency.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.modal.show();
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    //作用域销毁时，删除modal
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });
  })

  .controller('PlantGrowthListCtrl', function ($scope) {

  })

  .controller('GrowthReadingCtrl', function ($scope) {

  });

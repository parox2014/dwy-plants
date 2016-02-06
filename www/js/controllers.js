angular.module('app.controllers', [])
  .controller('AppController', function ($scope, Config, $ionicLoading, $timeout, $ionicPopup, $state, $toast) {
    var events = Config.events;
    var vm=$scope.vm={isShow:false};
    $scope.$on(events.REQUEST_START, function () {
      $ionicLoading.show({hideOnStateChange: true});
    });

    $scope.$on(events.RESPONSE, function () {
      hideLoading();
    });

    $scope.$on(events.REQUEST_ERROR, function () {
      hideLoading();
    });

    $scope.$on(events.RESPONSE_ERROR, function (e, resp) {

      console.error(resp);

      if (resp.status === 401) {
        $toast.show('User is expired,please relogin');
        return $state.go('login', {}, {location: 'replace'});
      }

      $ionicPopup.alert({
        title: 'Warning',
        template: resp.data.message
      });
      hideLoading();
    });

    $scope.$on('$stateChangeStart',function(e,state){
      $timeout(function(){
        vm.isShow=state.name==='main.tabs.plants';
      },0);

    });

    function hideLoading() {
      $timeout(function () {
        $ionicLoading.hide();
      }, 0);
    }

    //$cordovaLocalNotification.scheduler()
  })
  .controller('LoginCtrl', function ($scope, Sign, $state, $toast, $timeout) {
    var account = $scope.account = {};

    $scope.onFormSubmit = onFormSubmit;

    function onFormSubmit(e) {
      Sign.signin(account)
        .then(function () {
          $toast.show('Login Sucess');
          $timeout(function () {
            $state.go('main.tabs.schedule', {}, {location: 'replace'});
          }, 1000);

        });
    }
  })

  .controller('ResetPasswordCtrl', function ($scope, $ionicHistory, Sign, $state) {

    var vm = $scope.account = {};

    //$scope.onFormSubmit = function () {
    //  Sign.sendEmail(vm.email)
    //    .then(function (resp) {
    //      $state.go('passwordCreate')
    //    });
    //};
  })

  .controller('ModifyPasswordCtrl', function ($scope,Sign,$state,$toast) {
    var vm = $scope.vm = {};

    $scope.onFormSubmit = function (e) {
      Sign.modifyPassword(vm)
        .then(function(resp){
          $toast.show('modify password success');
          $state.go('login');
        });
    };
  })

  .controller('PasswordSuccessCtrl', function ($scope) {

  })

  .controller('TermsAndConditionCtrl', function ($scope) {

  })

  //用户注册
  .controller('RegisterCtrl', function ($scope, Sign, $state) {
    var account = $scope.account = {
      email: 'parox2014@gmail.com',
      password: String(123456),
      password2: String(123456),
      pass_agreement: 1
    };

    $scope.onFormSubmit = onFormSubmit;

    function onFormSubmit(e) {
      e.preventDefault();

      Sign.signup(account)
        .then(function (resp) {

          return Sign.signin({email: resp.email, password: resp.password});
        })
        .then(function (resp) {
          $state.go('profile');
        });
    }
  })

  .controller('ProfileCtrl', function ($scope, Sign, $state, $toast, GeoNames) {

    var profile = $scope.profile = {};

    $scope.onProfileFormSubmit = onProfileFormSubmit;


    function onProfileFormSubmit(e) {
      var params=handleParam();
      Sign.updateProfile(params)
        .then(function (resp) {
          $toast.show('updat profile success');
          $state.go('main.tabs.schedule')
        });
    }

    function handleParam(){
      var params={};

      params.first_name=profile.first_name;
      params.last_name=profile.last_name;

      if(angular.isObject(profile.country)){
        params.country=profile.country.countryName;
      }

      if(angular.isObject(profile.state)){
        params.state=profile.state.name;
      }

      if(angular.isObject(profile.city)){
        params.city=profile.city.name;
      }

      return params;
    }

  })

  .controller('ScheduleCtrl', function ($scope, Schedule) {
    //Schedule.query();
  })

  .controller('PlantsCtrl', function ($scope, Plant) {
    $scope.plantList = Plant.queryDemo(function(resp){
      console.log($scope.plantList);
    });

  })

  .controller('PlantsAddCtrl',function($scope,Plant,$toast,$ionicModal){
    var plant=$scope.plant=new Plant({
      water_times:3,
      sunlight:true
    });

    $scope.vm={
      title:'Add Plants'
    };

    $scope.addPlant=function(){
      plant.sunlight=plant.sunlight?1:0;
      plant.nosunlight=plant.nosunlight?1:0;

      plant.$save(function(){
        $toast.show('Add plant success');
        $scope.$ionicGoBack();
      });
    };

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
  })

  .controller('PlantGrowthCtrl', function ($scope) {

  })

  .controller('PlantDetailsCtrl', function ($scope, $ionicModal,$stateParams,Plant,$toast) {

    $scope.vm={
      title:'Plants Details'
    };

    var plant=$scope.plant=new Plant({id:$stateParams.id});

    plant.$get();

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

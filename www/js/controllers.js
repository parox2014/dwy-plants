angular.module('app.controllers', [])
  .controller('AppController', function ($scope, Config, $ionicLoading, $timeout, $ionicPopup, $state, $toast) {
    var events = Config.events;
    var vm = $scope.vm = {isShow: false};
    $scope.$on(events.REQUEST_START, function (e,config) {
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

      var data = resp.data;
      var msg = angular.isArray(data) ? data[0].message : data.message;

      $ionicPopup.alert({
        title: 'Warning',
        template: angular.toJson(resp)
      });
      hideLoading();
    });

    $scope.$on('$stateChangeStart', function (e, state) {
      $timeout(function () {
        vm.isShow = state.name === 'main.tabs.plants';
      }, 0);

    });

    function hideLoading() {
      $timeout(function () {
        $ionicLoading.hide();
      }, 0);
    }
  })
  .controller('MainCtrl', function ($scope, WaterTime, Sign, $toast, $state, Session,Notification) {

    $scope.currentUser = Session.getSessionUser();

    $scope.signout = function () {
      Sign.signout()
        .then(function () {
          $toast.show('Sign out sccess');

          $state.go('login');
        });
    };

    WaterTime.init();
    Notification.init();
  })
  .controller('LoginCtrl', function ($scope, Sign, $state, $toast, $timeout,Session,$location) {
    var account = $scope.account = {};
    var isLogin=Session.isLogin();

    $scope.onFormSubmit = onFormSubmit;
    alert(isLogin);

    if(isLogin){
      try {
        $location.path('/main/tabs/schedule');
        //$state.go('main.tabs.schedule', {}, {location: 'replace'});
      }catch (e){
        alert(angular.toJson(e));
      }

    }


    function onFormSubmit() {
      Sign.signin(account)
        .then(function () {

          $toast.show('Login Sucess');
          $timeout(function () {
            $location.path('/main/tabs/schedule');
            //$state.go('main.tabs.schedule', {}, {location: 'replace'});
          }, 1000);

        });
    }
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
        .then(function () {
          $state.go('main.profileSettings', {toState: 'main.tabs.schedule'});
        });
    }
  })

  .controller('ProfileSettingsCtrl', function ($scope, Sign, $state, $toast, Session, $stateParams) {

    var profile = $scope.profile = angular.extend({}, Session.getSessionUser());
    var toState = $stateParams.toState || 'main.tabs.schedule';

    $scope.onProfileFormSubmit = onProfileFormSubmit;


    function onProfileFormSubmit() {
      var params = handleParam();
      Sign.updateProfile(params)
        .then(function () {
          $toast.show('updat profile success');
          $state.go(toState);
        });
    }

    function handleParam() {
      var params = {};

      params.first_name = profile.first_name;
      params.last_name = profile.last_name;

      if (angular.isObject(profile.country)) {
        params.country = profile.country.countryName;
      }

      if (angular.isObject(profile.state)) {
        params.state = profile.state.name;
      }

      if (angular.isObject(profile.city)) {
        params.city = profile.city.name;
      }

      return params;
    }

  })

  .controller('WaterTimeSettingsCtrl', function (WaterTime, $scope) {
    $scope.vm = WaterTime;

    $scope.onFormSubmit = function () {
      WaterTime.$update(function (resp) {
        console.log(resp);
      });
    };
  })

  .controller('PasswordSettingsCtrl', function ($scope, Sign, $state, $ionicPopup) {
    var vm = $scope.vm = {};

    $scope.onFormSubmit = function () {
      Sign.modifyPassword(vm)
        .then(function () {
          vm.password = '';
          vm.password2 = '';
          $ionicPopup.alert({
            title: 'Hint',
            template: 'Password update success,please relogin now'
          }).then(function () {
            $state.go('login', {}, {location: 'replace'});
          });
        });
    };
  })
  .controller('ScheduleCtrl', function ($scope, Schedule, WaterTime, $toast) {
    $scope.morningSchedules = Schedule.query({water_time: 'morning'});

    $scope.noonSchedules = Schedule.query({water_time: 'noon'});

    $scope.afternoonSchedules = Schedule.query({water_time: 'afternoon'});

    $scope.WaterTime = WaterTime;

    $scope.onIsDoneChange = function (schedule) {
      schedule.$toggleDone(function () {
        $toast.show('update schedule status sucess');
      });
    };
  })

  .controller('PlantsDemoCtrl', function ($scope, Plant, Cache, $state) {
    $scope.plantList = Plant.queryDemo();

    $scope.selectDemo = function (plant) {
      Cache.plantDemo = plant;
      $state.go('main.tabs.plantsAdd', {demoId: plant.id});
    }
  })

  .controller('PlantsCtrl', function ($scope, Plant) {
    $scope.vm = {
      viewTitle: 'Plant'
    };
    $scope.plantList = Plant.query();
  })
  .controller('PlantDetailsCtrl', function ($scope, $stateParams, Plant, $toast, WaterFrequencyModal, $state, WaterTime) {

    $scope.vm = {
      title: 'Plants Details'
    };

    $scope.waterTime = WaterTime;

    var plant = $scope.plant = new Plant({id: $stateParams.id, sunlight: true});

    plant.$get();

    $scope.savePlant = function () {
      plant.$update(function () {
        $toast.show('Update plant success');
        $state.go('main.tabs.plants');
      });
    };

    WaterFrequencyModal.init($scope);
  })

  .factory('WaterFrequencyModal', function ($ionicModal, WaterTime) {
    return {
      init: function ($scope) {
        $scope.WaterTime = WaterTime;

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
      }
    }
  })
  .controller('PlantsAddCtrl', function ($scope, Plant, $toast, $ionicModal, Cache, $state, WaterFrequencyModal, WaterTime) {
    var plantDemo = Cache.plantDemo;

    if (!plantDemo) {
      $toast.show('Please select one plant demo first');
      return $state.go('main.tabs.plantDemo')
    }

    var plant = $scope.plant = new Plant({
      name: plantDemo.name,
      image: plantDemo.image,
      description: plantDemo.description,
      end_date: moment().add(1, 'days').toDate(),
      water_times: 3,
      sunlight: true,
      nosunlight: false
    });

    $scope.waterTime = WaterTime;

    $scope.vm = {
      title: 'Add Plants'
    };

    $scope.savePlant = function () {
      plant.$save(function () {
        Cache.plantDemo = null;
        $toast.show('Add plant success');
        $state.go('main.tabs.plants', {}, {location: 'replace'});
      });
    };

    WaterFrequencyModal.init($scope);
  })

  .controller('PlantGrowthCtrl', function ($scope, Growth, Plant) {
    $scope.vm = {
      viewTitle: 'PlantGrowth'
    };
    $scope.plantList = Plant.query();
  })
  .controller('PlantGrowthDetailsCtrl', function ($scope, Growth, Plant, $stateParams) {
    var plantId = $stateParams.plantId;

    //query today's growth
    $scope.growthList = Growth.query({
      plant_id: plantId,
      date: moment().format('YYYY-MM-DD')
    });

    $scope.plant = Plant.get({id: plantId});
  })


  .controller('PlantGrowthListCtrl', function ($scope, $stateParams, Growth) {

    //query this plant's all growth
    $scope.growthList = Growth.query({
      plant_id: $stateParams.plantId
    });

    $scope.vm = $stateParams;
  })

  .controller('GrowthReadingCtrl', function ($scope, $stateParams, Growth, Plant, $toast) {
    var plantId = $stateParams.plantId;
    var growth = $scope.growth = new Growth({
      date: new Date(),
      plant_id: plantId
    });

    $scope.plant = Plant.get({id: plantId});

    $scope.addNewGrowthReading = function () {
      growth.$save(function () {
        $toast.show('add new growth reading success');
        $scope.$ionicGoBack();
      });
    };

  });

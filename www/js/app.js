(function(){
  angular.serialParam=function serialParam(param) {
    var paramArr = [];

    for (var key in param) {
      if (param.hasOwnProperty(key)) {
        paramArr.push(key + '=' + param[key]);
      }
    }

    return paramArr.join('&');
  };

  angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.services', 'app.directives'])

    .run(function ($ionicPlatform, $ionicHistory, $location, $rootScope, $cordovaToast, $state,
                   ScheduleNotification, Schedule, Plant) {

      $ionicPlatform.ready(function () {

        //$rootScope.$on('$cordovaLocalNotification:click', function (event, notification) {
        //  alert("clicked: " + notification.id);
        //});


        $rootScope.$on('$cordovaLocalNotification:trigger', function (event, notification) {
          //$state.go('scheduleDetails',{id:notification.id});
          Schedule.get({id: notification.id}, function (schedule) {

            Plant.get({id: schedule.plant_id}, function (plant) {

              schedule.plant = plant;

              ScheduleNotification.show(schedule, function () {
                //$scope.$ionicGoBack();
              });
            });
          })
        });

        //双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {

          var needExitAppViews = ['/tab/schedule', '/tab/plants', '/tab/growth', '/tab/settings', '/login','/register']
          var currentPath = $location.path();
          //判断处于哪个页面时双击退出
          if (needExitAppViews.indexOf(currentPath) > -1) {
            if ($rootScope.backButtonPressedOnceToExit) {
              ionic.Platform.exitApp();
            } else {
              $rootScope.backButtonPressedOnceToExit = true;
              $cordovaToast.showShortTop('Press back again to exit app');
              setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
              }, 2000);
            }
          }
          else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortTop('Press back again to exit app');
            setTimeout(function () {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
          }
          e.preventDefault();
          return false;
        }, 101);


        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

      });

    })
    .config(function ($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider) {

      //设置ajax请求拦截器
      $httpProvider.interceptors.push('Interceptor');
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
      $httpProvider.defaults.transformRequest = angular.serialParam;

      $ionicConfigProvider.tabs.position('bottom');
      $ionicConfigProvider.navBar.alignTitle('center');
      $ionicConfigProvider.tabs.style('standard');

      $stateProvider
      //登录
        .state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        })
        //注册条款
        .state('termsAndCondition', {
          url: '/termsAndCondition',
          templateUrl: 'templates/termsAndCondition.html'
        })
        //注册
        .state('register', {
          url: '/register',
          templateUrl: 'templates/register.html',
          controller: 'RegisterCtrl'
        })

        //注册
        .state('profileCreate', {
          url: '/profile-create',
          templateUrl: 'templates/profile-create.html',
          controller: 'ProfileSettingsCtrl'
        })

        .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'templates/tabs.html',
          controller: 'TabsCtrl',
          onEnter: signInRequired
        })

        .state('tab.schedule', {
          url: '/schedule',
          cache: false,
          views: {
            'tab-schedule': {
              templateUrl: 'templates/tab-schedule.html',
              controller: 'ScheduleCtrl'
            }
          }
        })

        .state('tab.plantDemo', {
          url: '/plantsDemo',
          cache: false,
          views: {
            'tab-plants': {
              templateUrl: 'templates/tab-plant-demos.html',
              controller: 'PlantsDemoCtrl'
            }
          }
        })

        .state('tab.plants', {
          url: '/plants',
          cache: false,
          views: {
            'tab-plants': {
              templateUrl: 'templates/tab-plants.html',
              controller: 'PlantsCtrl'
            }
          }
        })

        .state('tab.plantsAdd', {
          url: '/plantsAdd/:demoId',
          cache: false,
          views: {
            'tab-plants': {
              templateUrl: 'templates/tab-plant-details.html',
              controller: 'PlantsAddCtrl'
            }
          }
        })
        .state('tab.plantDetails', {
          url: '/plantDetail/:id',
          cache: false,
          views: {
            'tab-plants': {
              templateUrl: 'templates/tab-plant-details.html',
              controller: 'PlantDetailsCtrl'
            }
          }
        })


        .state('tab.growth', {
          url: '/growth',
          cache: false,
          views: {
            'tab-growth': {
              templateUrl: 'templates/tab-plants.html',
              controller: 'PlantGrowthCtrl'
            }
          }
        })

        .state('tab.growthDetails', {
          url: '/growthDetails/:plantId',
          cache: false,
          views: {
            'tab-growth': {
              templateUrl: 'templates/tab-growth-details.html',
              controller: 'PlantGrowthDetailsCtrl'
            }
          }
        })


        .state('tab.growthList', {
          url: '/growthList/:plantId',
          views: {
            'tab-growth': {
              templateUrl: 'templates/tab-growth-list.html',
              controller: 'PlantGrowthListCtrl'
            }
          }
        })

        .state('tab.growthReading', {
          url: '/growthReading/:plantId',
          views: {
            'tab-growth': {
              templateUrl: 'templates/tab-growth-reading.html',
              controller: 'GrowthReadingCtrl'
            }
          }
        })
        .state('tab.settings', {
          url: '/settings',
          views: {
            'tab-settings': {
              templateUrl: 'templates/tab-settings.html',
              controller: 'SettingsCtrl'
            }
          }
        })

        .state('tab.passwordSettings', {
          url: '/password-settings',
          views: {
            'tab-settings': {
              templateUrl: 'templates/tab-setting-password.html',
              controller: 'PasswordSettingsCtrl'
            }
          }
        })

        .state('tab.profileSettings', {
          url: '/profile-settings/:toState',
          views: {
            'tab-settings': {
              templateUrl: 'templates/tab-setting-profile.html',
              controller: 'ProfileSettingsCtrl'
            }
          }
        })

        .state('tab.waterTimeSettings', {
          url: '/water-time-settings',
          views: {
            'tab-settings': {
              templateUrl: 'templates/tab-settings-water-time.html',
              controller: 'WaterTimeSettingsCtrl'
            }
          }
        });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/tab/schedule');

      function signInRequired(Session, $state) {
        //alert(Session.isLogin());
        if (!Session.isLogin()) {
          return $state.go('login', {}, {location: 'replace'});
        }
      }
    });
})();



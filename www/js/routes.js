angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

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
        templateUrl: 'templates/createLogin.html',
        controller: 'RegisterCtrl'
      })

      //main为应用主路由，main里面所有的路由，都需要用户登录才能访问
      .state('main',{
        url:'/main',
        abstract:true,
        templateUrl:'templates/menu.html',
        controller:'MainCtrl',
        onEnter:signInRequired
      })

      .state('main.tabs', {
        url: '/tabs',
        abstract: true,
        views:{
          main:{
            templateUrl: 'templates/tabsController.html'
          }
        }
      })

      .state('main.tabs.schedule', {
        url: '/schedule',
        cache:false,
        views: {
          'schedule': {
            templateUrl: 'templates/schedule.html',
            controller: 'ScheduleCtrl'
          }
        }
      })

      .state('main.tabs.plantDemo', {
        url: '/plantsDemo',
        cache:false,
        views: {
          plants: {
            templateUrl: 'templates/plantsDemo.html',
            controller: 'PlantsDemoCtrl'
          }
        }
      })

      .state('main.tabs.plants', {
        url: '/plants',
        cache:false,
        views: {
          plants: {
            templateUrl: 'templates/plants.html',
            controller: 'PlantsCtrl'
          }
        }
      })

      .state('main.tabs.plantsAdd', {
        url: '/plantsAdd/:demoId',
        cache:false,
        views: {
          plants: {
            templateUrl: 'templates/plantDetails.html',
            controller: 'PlantsAddCtrl'
          }
        }
      })

      .state('main.tabs.plantGrowth', {
        url: '/growth',
        views: {
          plantGrowth: {
            templateUrl: 'templates/plantGrowth.html',
            controller: 'PlantGrowthCtrl'
          }
        }
      })

      .state('plantDetails', {
        url: '/plantDetail/:id',
        cache:false,
        templateUrl: 'templates/plantDetails.html',
        controller: 'PlantDetailsCtrl'
      })/*.state('main.tabs.plantDetails', {
        url: '/plantDetail/:id',
        views:{
          plants:{
            templateUrl: 'templates/plantDetails.html',
            controller: 'PlantDetailsCtrl'
          }
        }
      })*/

      .state('main.tabs.plantGrowthList', {
        url: '/growthList',
        views:{
          plantGrowth:{
            templateUrl: 'templates/plantGrowthList.html',
            controller: 'PlantGrowthListCtrl'
          }
        }
      })

      .state('main.tabs.growthReading', {
        url: '/growthReading',
        views:{
          plantGrowth:{
            templateUrl: 'templates/growthReading.html',
            controller: 'GrowthReadingCtrl'
          }
        }
      })
      .state('main.settings',{
        url:'/settings',
        views:{
          main:{
            templateUrl:'templates/settings.html'
          }
        }
      })

      .state('main.passwordSettings', {
        url: '/password-settings',
        views:{
          main:{
            templateUrl: 'templates/createPassword.html',
            controller: 'PasswordSettingsCtrl'
          }
        }
      })

      .state('main.profileSettings', {
        url: '/profile-settings/:toState',
        views:{
          main:{
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      })

      .state('main.waterTimeSettings', {
        url: '/water-time-settings',
        views:{
          main:{
            templateUrl: 'templates/settingsWaterTime.html',
            controller:'WaterTimeSettingsCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    function signInRequired(Session, $state) {
      if (!Session.isLogin()) {
        return $state.go('login',{},{location:'replace'});
      }
    }
  });

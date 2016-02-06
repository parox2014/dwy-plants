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
        templateUrl: 'templates/termsAndCondition.html',
        controller: 'TermsAndConditionCtrl'
      })
      //注册
      .state('register', {
        url: '/register',
        templateUrl: 'templates/createLogin.html',
        controller: 'RegisterCtrl'
      })

      //填写用户资料
      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      })

      //密码重置
      .state('resetPassword', {
        url: '/passwordReset',
        templateUrl: 'templates/resetPassword.html',
        controller: 'ResetPasswordCtrl'
      })

      //创建新密码
      .state('createPassword', {
        url: '/passwordCreate',
        templateUrl: 'templates/createPassword.html',
        controller: 'ModifyPasswordCtrl'
      })

      //创建新密码成功
      .state('passwordSuccess', {
        url: '/passwordSuccess',
        templateUrl: 'templates/passwordSuccess.html',
        controller: 'PasswordSuccessCtrl'
      })



      //main为应用主路由，main里面所有的路由，都需要用户登录才能访问
      .state('main',{
        url:'/main',
        abstract:true,
        templateUrl:'templates/menu.html'
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
        url: '/plantsAdd',
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
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    function signInRequired(Session, $state) {
      if (!Session.token) {
        $state.go('login');
      }
    }
  });

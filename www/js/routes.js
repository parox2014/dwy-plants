angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('resetPassword', {
        url: '/passwordReset',
        templateUrl: 'templates/resetPassword.html',
        controller: 'ResetPasswordCtrl'
      })

      .state('createPassword', {
        url: '/passwordCreate',
        templateUrl: 'templates/createPassword.html',
        controller: 'CreatePasswordCtrl'
      })

      .state('passwordSuccess', {
        url: '/passwordSuccess',
        templateUrl: 'templates/passwordSuccess.html',
        controller: 'PasswordSuccessCtrl'
      })

      .state('termsAndCondition', {
        url: '/termsAndCondition',
        templateUrl: 'templates/termsAndCondition.html',
        controller: 'TermsAndConditionCtrl'
      })

      .state('createLogin', {
        url: '/loginCreate',
        templateUrl: 'templates/createLogin.html',
        controller: 'CreateLoginCtrl'
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      })

      .state('tabsController.schedule', {
        url: '/schedule',
        views: {
          'tab1': {
            templateUrl: 'templates/schedule.html',
            controller: 'ScheduleCtrl'
          }
        }
      })

      .state('tabsController.plants', {
        url: '/plants',
        views: {
          'tab2': {
            templateUrl: 'templates/plants.html',
            controller: 'PlantsCtrl'
          }
        }
      })

      .state('tabsController.plantGrowth', {
        url: '/growth',
        views: {
          'tab3': {
            templateUrl: 'templates/plantGrowth.html',
            controller: 'PlantGrowthCtrl'
          }
        }
      })

      .state('tabsController', {
        url: '/tabs',
        abstract: true,
        templateUrl: 'templates/tabsController.html'
      })

      .state('plantDetails', {
        url: '/plantDetail/:id',
        templateUrl: 'templates/plantDetails.html',
        controller: 'PlantDetailsCtrl'
      })

      .state('menu', {
        url: '/side-menu',
        abstract: true,
        templateUrl: 'templates/menu.html'
      })

      .state('plantGrowthList', {
        url: '/growthList',
        templateUrl: 'templates/plantGrowthList.html',
        controller: 'PlantGrowthListCtrl'
      })

      .state('growthReading', {
        url: '/growthReading',
        templateUrl: 'templates/growthReading.html',
        controller: 'GrowthReadingCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    function signInRequired(Session, $state) {
      if (!Session.user) {
        //$state.go('login');
      }
    }
  });

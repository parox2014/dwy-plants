angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
      
    
      
        
    .state('resetPassword', {
      url: '/passwordReset',
      templateUrl: 'templates/resetPassword.html',
      controller: 'resetPasswordCtrl'
    })
        
      
    
      
        
    .state('createPassword', {
      url: '/passwordCreate',
      templateUrl: 'templates/createPassword.html',
      controller: 'createPasswordCtrl'
    })
        
      
    
      
        
    .state('passwordSuccess', {
      url: '/passwordSuccess',
      templateUrl: 'templates/passwordSuccess.html',
      controller: 'passwordSuccessCtrl'
    })
        
      
    
      
        
    .state('termsAndCondition', {
      url: '/termsAndCondition',
      templateUrl: 'templates/termsAndCondition.html',
      controller: 'termsAndConditionCtrl'
    })
        
      
    
      
        
    .state('createLogin', {
      url: '/loginCreate',
      templateUrl: 'templates/createLogin.html',
      controller: 'createLoginCtrl'
    })
        
      
    
      
        
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'profileCtrl'
    })
        
      
    
      
        
    .state('tabsController.schedule', {
      url: '/schedule',
      views: {
        'tab1': {
          templateUrl: 'templates/schedule.html',
          controller: 'scheduleCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.plants', {
      url: '/plants',
      views: {
        'tab2': {
          templateUrl: 'templates/plants.html',
          controller: 'plantsCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.plantGrowth', {
      url: '/growth',
      views: {
        'tab3': {
          templateUrl: 'templates/plantGrowth.html',
          controller: 'plantGrowthCtrl'
        }
      }
    })
        
      
    
      
    .state('tabsController', {
      url: '/tabs',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
      
    
      
        
    .state('plantDetails', {
      url: '/plantDetail',
      templateUrl: 'templates/plantDetails.html',
      controller: 'plantDetailsCtrl'
    })
        
      
    
      
        
    .state('waterFrequency', {
      url: '/waterFrequency',
      templateUrl: 'templates/waterFrequency.html',
      controller: 'waterFrequencyCtrl'
    })
        
      
    
      
    .state('menu', {
      url: '/side-menu',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })
      
    
      
        
    .state('plantGrowthList', {
      url: '/growthList',
      templateUrl: 'templates/plantGrowthList.html',
      controller: 'plantGrowthListCtrl'
    })
        
      
    
      
        
    .state('growthReading', {
      url: '/growthReading',
      templateUrl: 'templates/growthReading.html',
      controller: 'growthReadingCtrl'
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
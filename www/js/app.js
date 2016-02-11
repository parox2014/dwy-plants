angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

  .run(function ($ionicPlatform, $ionicHistory, $location, $rootScope, $cordovaToast) {
    $ionicPlatform.ready(function () {

      $rootScope.$on('$cordovaLocalNotification:click', function (event, notification) {
        alert("clicked: " + notification.id);
      });

      $rootScope.$on('$cordovaLocalNotification:trigger', function (event, notification) {
        alert('triggered: ' + notification.id);
      });

      //双击退出
      $ionicPlatform.registerBackButtonAction(function (e) {

        var needExitAppViews = ['/main/tabs/schedule', '/main/tabs/plants', '/main/tabs/plantGrowth', '/main/settings', '/login']
        var currentPath = $location.path();
        //判断处于哪个页面时双击退出
        if (needExitAppViews.indexOf(currentPath) > -1) {
          if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortTop('Press backbutton again to exit app');
            setTimeout(function () {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
          }
        }
        else if ($ionicHistory.backView()) {
          $ionicHistory.goBack();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortTop('Press backbutton again to exit app');
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
        e.preventDefault();
        return false;
      }, 101);


      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });

  });

(function () {
  angular
    .module('app.services', ['ngResource'])
    .factory('Config', function () {
      var BASE='http://plants.yunzujia.net/api/v1';
      return {
        api: {
          SIGNIN: BASE+'/signin',
          SIGNOUT: '/signout',
          SIGNUP: BASE+'/auth/register',
          PROFILE: '/profile',
          SCHEDULE: '/schedule',
          PLANT: '/plant',
          EMAIL: '/email'
        },
        events: {
          REQUEST_START: '$requestStart',
          REQUEST_ERROR: '$requestError',
          RESPONSE_ERROR: '$responseError',
          RESPONSE: '$response'
        }
      }
    })
    .factory('Session', [function () {
      return {
        user: null,
        destroy: function () {
          this.user = null
        }
      }
    }])
    //登录注册服务
    .factory('Sign', SignService)
    //日程
    .factory('Schedule', ScheduleService)
    .factory('Plant', PlantService)
    //地区服务
    .factory('Region', RegionService)
    //请求拦截器
    .factory('Interceptor', Interceptor)
    .config(function ($locationProvider, $httpProvider) {
      //$locationProvider.hashPrefix('!');
      //设置ajax请求拦截器
      $httpProvider.interceptors.push('Interceptor');
      //配置请求头
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    });


  function SignService($http, Session, $q, Config) {
    var api = Config.api;

    return {
      signin: signin,
      signout: signout,
      signup: signup,
      updateProfile: updateProfile,
      sendEmail: sendEmail
    };

    /**
     * 用户登录
     * @param account {Object}
     * @returns {IPromise<T>}
     */
    function signin(account) {
      var deffered = $q.defer();

      $http.post(api.SIGNIN, account)
        .success(function (resp) {

          Session.user = resp;
          deffered.resolve(resp);
        })
        .error(function (err) {

          deffered.reject(err);
        });

      return deffered.promise;
    }

    /**
     * 退出登录
     * @returns {*}
     */
    function signout() {
      return $http.get(api.SIGNOUT);
    }


    /**
     * 用户注册
     * @param account
     * @returns {IPromise<T>}
     */
    function signup(account) {
      var deffered = $q.defer();

      $http.post(api.SIGNUP, account)
        .success(function (resp) {

          Session.user = resp;
          deffered.resolve(resp);
        })
        .error(function (err) {

          deffered.reject(err);
        });

      return deffered.promise;
    }


    /**
     * 更新用户资料
     * @param profile
     * @returns {IHttpPromise<T>|*}
     */
    function updateProfile(profile) {
      return $http.put(api.PROFILE, profile);
    }

    /**
     * 发送邮件
     * @param email {String} 电子邮箱
     * @returns {IHttpPromise<T>|*}
     */
    function sendEmail(email) {
      return $http.post(api.EMAIL, {email: email});
    }
  }


  function RegionService($http) {
    return {
      queryCountryList: getCountry,
      queryProviceList: getProvice,
      queryCityList: getCity
    };

    function getCountry() {

    }

    function getProvice() {

    }

    function getCity() {

    }
  }


  function ScheduleService(Config, $http, $q, $resource) {
    return $resource(Config.api.SIGNIN + '/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    })
  }


  function PlantService(Config, $resource) {
    var Plant = $resource(Config.api.PLANT + '/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    return {
      query: function () {
        var plants = [];

        for (var i = 0; i < 20; i++) {
          plants.push({
            id: 1000 + i,
            name: 'Plant ' + i
          });
        }
        return plants;
      }
    }
  }


  function Interceptor($q, $rootScope, Config) {
    var events = Config.events;
    return {
      request: function (config) {
        $rootScope.$broadcast(events.REQUEST_START, config);
        return config;
      },
      requestError: function (rejection) {
        $rootScope.$broadcast(events.REQUEST_ERROR, rejection);
        return $q.reject(rejection);
      },
      response: function (response) {
        $rootScope.$broadcast(events.RESPONSE, response);
        return response;
      },
      responseError: function (rejection) {
        $rootScope.$broadcast(events.RESPONSE_ERROR, rejection);
        return $q.reject(rejection);
      }
    };
  }
})();


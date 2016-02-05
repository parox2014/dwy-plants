(function () {
  angular
    .module('app.services', ['ngResource'])
    .factory('Config', function () {
      var BASE = 'http://plants.yunzujia.net/api';
      return {
        api: {
          SIGNIN: BASE + '/auth/login',
          SIGNOUT: '/signout',
          SIGNUP: BASE + '/auth/register',
          PROFILE: '/profile',
          SCHEDULE: BASE+'/schedule',
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
      'use strict';
      var token = window.localStorage.getItem('token');

      var Session = {};

      Object.defineProperty(Session, 'token', {
        get: function () {
          return token
        },
        set: function (value) {
          if (!angular.isString(value)) {
            throw new Error('token must be string')
          }

          if (value.length < 10) {
            throw new Error('token\'s length invalid');
          }
          //保存token，同时保存到本地存储
          token = value;
          this._saveToLocalstorage(value);
        }
      });

      /**
       * 销毁session
       */
      Session.destroy = function () {
        token = null;
        window.localStorage.removeItem('token');
      };

      Session._saveToLocalstorage = function (token) {
        window.localStorage.setItem('token', token);
      };

      /**
       * 获取token参数
       * @returns {{token}}
       */
      Session.getTokenParam = function () {
        return {token: token};
      };

      Session.token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImlzcyI6Imh0dHA6XC9cL3BsYW50c19hcGkudGVzdC5jb21cL2FwaVwvYXV0aFwvbG9naW4iLCJpYXQiOjE0NTQ1NzUxODksImV4cCI6MTQ1NzE2NzE4OSwibmJmIjoxNDU0NTc1MTg5LCJqdGkiOiI2YTMwNmNiMzc4MDkyNjYyZmM1ZjBiM2JkMTdkMzM0MCJ9.96edlchPmB7Z8Vclrv8-CGeTtpXwIwSvQI6EY8DYL7o';
      return Session;
    }])
    //登录注册服务
    .factory('Sign', SignService)
    //日程
    .factory('Schedule', ScheduleService)
    .factory('Plant', PlantService)
    //地区服务
    .factory('Region', RegionService)
    .factory('$toast',ToastService)
    //请求拦截器
    .factory('Interceptor', Interceptor)
    .config(function ($locationProvider, $httpProvider) {
      //$locationProvider.hashPrefix('!');
      //设置ajax请求拦截器
      $httpProvider.interceptors.push('Interceptor');
      //配置请求头
      //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
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

          Session.token = resp.token;
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
      return $http.post(api.PROFILE, profile);
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


  function ScheduleService(Config, $resource, Session) {
    return $resource(Config.api.SCHEDULE + '/:id', {
      id: '@id',
      token:Session.token
    }, {
      update: {
        method: 'PUT'
      }
    })
  }


  function PlantService(Config, $resource,Session) {
    var Plant = $resource(Config.api.PLANT + '/:id', {
      id: '@id',
      token:Session.token
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

  function ToastService($compile,$rootScope,$document,$timeout){
    var tpl='<div class="popup-container toast-showing" ng-class="{active:vm.show,\'toast-hidden\':!vm.show}"><div class="toast">{{vm.template}}</div></div>';
    var body=$document[0].body;
    var events='animationend webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd';
    function Toast(option){
      var defaults={
        template:'',
        delay:2000,
        show:false
      };

      if(angular.isString(option)){
        defaults.template=option;
        this.option=defaults;
      }else{
        this.option=angular.extend(defaults,option);
      }

      this.scope=$rootScope.$new();

      this.scope.vm=this.option;

      this.$el=$compile(tpl)(this.scope);
      angular.element(body).append(this.$el);
    }

    Toast.prototype={
      show:function(){
        var self=this;
        this.scope.vm.show=true;
        $timeout(function(){
          self.hide();
        },this.option.delay);
        return this;
      },
      hide:function(){
        var self=this;
        this.scope.vm.show=false;
        this.$el.bind(events,function(){
          self.destroy();
        });
        return this;
      },
      destroy:function(){
        this.$el.remove();
        this.scope.$destroy();
      }
    };

    return {
      show:function(option){
        var toast=new Toast(option);
        return toast.show();
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


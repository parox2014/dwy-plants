(function () {
  angular
    .module('app.services', ['ngResource'])
    .factory('Config', function () {
      var BASE = 'http://plants.yunzujia.net:8992/v1';
      var GEO_NAMES_BASE = 'http://api.geonames.org';
      return {
        api: {
          SIGNIN: BASE + '/user/login',
          SIGNOUT: '/signout',
          SIGNUP: BASE + '/user/signup',
          PROFILE: BASE + '/user/update',
          MY_PROFILE: BASE + '/user/me',
          WATER_TIME: BASE + '/water-times',
          CHANGE_PASSWORD: BASE + '/user/change-password',
          SCHEDULE: BASE + '/schedules',
          PLANT: BASE + '/plants',
          PLANT_DEMO: BASE + '/plant-demo',
          COUNTRY_JSON: GEO_NAMES_BASE + '/countryInfoJSON',
          CHILDREN_JSON: GEO_NAMES_BASE + '/childrenJSON'
        },
        events: {
          REQUEST_START: '$requestStart',
          REQUEST_ERROR: '$requestError',
          RESPONSE_ERROR: '$responseError',
          RESPONSE: '$response'
        },
        GEO_NAMES_ACCOUNT: 'plants_schedule'
      }
    })
    .factory('Session', function ($http) {
      'use strict';
      var localStorage = window.localStorage;
      var token = localStorage.getItem('token');
      var user = angular.fromJson(localStorage.getItem('user'));

      if (token) {
        setAuthorization(token);
      }

      var Session = {};

      Session.set = function (value) {
        if (!angular.isString(value)) {
          throw new Error('token must be string')
        }

        if (value.length < 10) {
          throw new Error('token\'s length invalid');
        }
        //save the access token,and save to localStorage
        token = value;
        this._saveToLocalstorage(value);

        setAuthorization(value);
      };


      Session.get = function () {
        return token;
      };

      Session.setSessionUser = function (userObj) {
        user = userObj;

        localStorage.setItem('user', angular.toJson(userObj));
      };

      Session.updateSessionUser=function(userObj){
        angular.extend(user,userObj);
        localStorage.setItem('user', angular.toJson(userObj));
      };

      Session.getSessionUser = function () {
        return user;
      };

      Session.isLogin = function () {
        return !!token;
      };
      /**
       * 销毁session
       */
      Session.destroy = function () {
        token = null;
        user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      };

      Session._saveToLocalstorage = function (token) {
        localStorage.setItem('token', token);
      };

      /**
       * 获取token参数
       * @returns {{token}}
       */
      Session.getTokenParam = function () {
        return {access_token: token};
      };


      function setAuthorization(token) {
        //$http.defaults.headers.common['Authorization']='Basic '+token;
      }

      return Session;
    })
    //登录注册服务
    .factory('Sign', SignService)
    .factory('WaterTime',WaterTimeService)
    //日程
    .factory('Schedule', ScheduleService)
    .factory('Plant', PlantService)
    .factory('Cache', function () {
      return {}
    })
    //地区服务
    .factory('GeoNames', GeoNamesService)
    .factory('$toast', ToastService)
    //请求拦截器
    .factory('Interceptor', Interceptor)
    .config(function ($locationProvider, $httpProvider) {
      //$locationProvider.hashPrefix('!');
      //设置ajax请求拦截器
      $httpProvider.interceptors.push('Interceptor');
      //配置请求头
      //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

      $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';

      $httpProvider.defaults.transformRequest = serialParam;
    });

  function serialParam(param) {
    var paramArr = [];

    for (var key in param) {
      if (param.hasOwnProperty(key)) {
        paramArr.push(key + '=' + param[key]);
      }
    }

    return paramArr.join('&');
  }

  function SignService($http, Session, $q, Config) {
    var api = Config.api;

    return {
      signin: signin,
      signout: signout,
      signup: signup,
      updateProfile: updateProfile,
      getMyProfile: getMyProfile,
      modifyPassword: modifyPassword
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

          Session.set(resp.access_token);
          Session.setSessionUser(resp);
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
      var defer=$q.defer();

      Session.destroy();

      defer.resolve('sucess');

      return defer.promise;
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
     * @param profile {Object}
     * @returns {IHttpPromise<T>|*}
     */
    function updateProfile(profile) {
      var defer = $q.defer();

      $http.put(api.PROFILE, profile, {params: Session.getTokenParam()})
        .success(function (resp) {
          Session.updateSessionUser(resp);
          defer.resolve(resp);
        })
        .error(function (err) {
          defer.reject(err);
        });

      return defer.promise;
    }


    /**
     * get my profile
     * @returns {IHttpPromise<T>|*}
     */
    function getMyProfile() {
      return $http.get(api.MY_PROFILE, {params: Session.getTokenParam()});
    }

    /**
     * modify password
     * @param formData {Object} password password2
     * @returns {IHttpPromise<T>|*}
     */
    function modifyPassword(formData) {
      return $http.post(api.CHANGE_PASSWORD, formData, {params: Session.getTokenParam()})
    }
  }


  function GeoNamesService($http, Config, $q) {
    var api = Config.api;
    var localStorage = window.localStorage;
    var apiMap = {
      country: api.COUNTRY_JSON,
      state: api.CHILDREN_JSON,
      city: api.CHILDREN_JSON
    };

    return {
      queryCountryList: getCountry,
      queryProviceList: getProvice,
      queryCityList: getCity
    };

    /**
     * get common parmas
     * @private
     * @returns {{userName: string, callback: string, lang: string, _: number}}
     */
    function getParmas() {
      return {
        userName: Config.GEO_NAMES_ACCOUNT,
        callback: 'JSON_CALLBACK',
        lang: 'zh-CN',
        _: Date.now()
      };
    }

    /**
     * query country or state or city by type and save the data to localStorage
     * @private
     * @param type {String}
     * @param params {Object}
     * @param localStorageKey {String}
     * @returns {IPromise<T>}
     */
    function query(type, params, localStorageKey) {
      var defer = $q.defer();
      var uri = apiMap[type];
      var data = localStorage.getItem(localStorageKey);

      if (data) {
        defer.resolve(angular.fromJson(data));
      } else {
        $http.jsonp(uri, {
            params: params,
            transformResponse: function (resp) {
              return resp.geonames ? resp.geonames : [];
            }
          })
          .success(function (resp) {
            localStorage.setItem(localStorageKey, angular.toJson(resp));
            defer.resolve(resp);
          });
      }

      return defer.promise;
    }

    /**
     * get all country on the earth
     * @returns {IPromise.<T>}
     */
    function getCountry() {
      return query('country', getParmas(), 'countryList');
    }

    /**
     * get country's children by country's geonameId
     * @param geonameId {String}
     * @returns {IPromise.<T>}
     */
    function getProvice(geonameId) {
      var params = getParmas();

      params.geonameId = geonameId;

      return query('state', params, geonameId);
    }

    /**
     * get state or province's children by geonameId
     * @param geonameId {String}
     * @returns {IPromise.<T>}
     */
    function getCity(geonameId) {
      var params = getParmas();

      params.geonameId = geonameId;

      return query('city', params, geonameId);
    }
  }


  function ScheduleService(Config, $resource, Session) {
    //?time=future&water_time=morning&is_done=0&plant_id=1&expand=plant
    return $resource(Config.api.SCHEDULE + '/:id', {
      id: '@id',
      access_token: Session.get()
    }, {
      query: {
        method: 'GET',
        params: {
          time: 'today',
          is_done: 0,
          expand: 'plant'
        },
        isArray: true,
        transformResponse: function (resp) {
          resp = angular.fromJson(resp);
          return resp.items;
        }
      },
      update: {
        method: 'PUT'
      }
    })
  }


  function PlantService(Config, $resource, Session) {
    return $resource(Config.api.PLANT + '/:id', {
      id: '@id',
      access_token: Session.get()
    }, {
      get: {
        method: 'GET',
        isArray: false,
        transformResponse: transformResponseOne
      },
      save: {
        method: 'POST',
        transformRequest: transformRequest,
        transformResponse:transformResponseOne
      },
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: transformResponseList
      },
      update: {
        method: 'PUT',
        transformRequest: transformRequest,
        transformResponse: transformResponseOne
      },
      queryDemo: {
        url: Config.api.PLANT_DEMO,
        method: 'GET',
        params: {page: 1},
        isArray: true,
        transformResponse: transformResponseList
      }
    });

    /**
     * transform request param to formdata
     * @private
     * @param param
     * @returns {String}
     */
    function transformRequest(param) {
      param.sunlight = param.sunlight ? 1 : 0;
      param.nosunlight = param.nosunlight ? 1 : 0;
      param.end_date = moment(param.end_date).format('YYYY-MM-DD');

      return serialParam(param);
    }

    /**
     * transform one response
     * @private
     * @param resp {Response}
     * @returns {Object}
     */
    function transformResponseOne(resp) {
      resp = angular.fromJson(resp);
      resp.sunlight = angular.equals(Number(resp.sunlight), 1);
      resp.nosunlight = angular.equals(Number(resp.nosunlight), 1);
      resp.end_date = moment(resp.end_date).toDate();
      return resp;
    }

    /**
     * transform response list
     * @param resp
     * @returns {Array}
     */
    function transformResponseList(resp) {
      resp = angular.fromJson(resp);
      return resp ? resp.items : [];
    }
  }

  function ToastService($compile, $rootScope, $document, $timeout) {
    var tpl = '<div class="popup-container toast-showing" ng-class="{active:vm.show,\'toast-hidden\':!vm.show}"><div class="toast">{{vm.template}}</div></div>';
    var body = $document[0].body;
    var events = 'animationend webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd';

    function Toast(option) {
      var defaults = {
        template: '',
        delay: 3000,
        show: false
      };

      if (angular.isString(option)) {
        defaults.template = option;
        this.option = defaults;
      } else {
        this.option = angular.extend(defaults, option);
      }

      this.scope = $rootScope.$new();

      this.scope.vm = this.option;

      this.$el = $compile(tpl)(this.scope);
      angular.element(body).append(this.$el);
    }

    Toast.prototype = {
      show: function () {
        var self = this;
        this.scope.vm.show = true;
        $timeout(function () {
          self.hide();
        }, this.option.delay);
        return this;
      },
      hide: function () {
        var self = this;
        this.scope.vm.show = false;
        this.$el.bind(events, function () {
          self.destroy();
        });
        return this;
      },
      destroy: function () {
        this.$el.remove();
        this.scope.$destroy();
      }
    };

    return {
      show: function (option) {
        var toast = new Toast(option);
        return toast.show();
      }
    }
  }

  function WaterTimeService(Config,$resource,Session){
    var WaterTime= $resource(Config.api.WATER_TIME+'/:id',{
      id:'@user_id',
      access_token:Session.get()
    },{
      update:{
        method:'PUT'
      }
    });

    var waterTime=new WaterTime();

    waterTime.init=function(){
      waterTime.user_id=Session.getSessionUser().id;
      waterTime.$get();
    };
    return waterTime;
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


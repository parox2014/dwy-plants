(function(){
  angular
    .module('app.services', [])
    .factory('Config',function(){
      return {
        api:{
          SIGNIN:'',
          SIGNOUT:'',
          SIGNUP:'/signup',
          PROFILE:'/profile'
        },
        events:{
          REQUEST_START:'$requestStart',
          REQUEST_ERROR:'$requestError',
          RESPONSE_ERROR:'$responseError',
          RESPONSE:'$response'
        }
      }
    })
    .factory('Session', [function(){
      return {
        user:null,
        destroy:function(){
          this.user=null
        }
      }
    }])
    //登录注册服务
    .factory('Sign',SignService)

    //地区服务
    .factory('Region',RegionService)
    //请求拦截器
    .factory('Interceptor',Interceptor)
    .config(function($locationProvider,$httpProvider){
      $locationProvider.hashPrefix('!');
      //设置ajax请求拦截器
      $httpProvider.interceptors.push('Interceptor');
      //配置请求头
      $httpProvider.defaults.headers.common['X-Requested-With']='XMLHttpRequest';
    });



  function SignService($http,Session,$q,Config){
    var api=Config.api;

    return {
      signin:signin,
      signout:signout,
      signup:signup,
      updateProfile:updateProfile
    };

    function signin(){

    }

    function signout(){

    }

    function signup(account){
      var deffered=$q.defer();

      $http.post(api.SIGNUP,account)
        .success(function(resp){

          Session.user=resp;
          deffered.resolve(resp);
        })
        .error(function(err){

          deffered.reject(err);
        });

      return deffered.promise;
    }

    function updateProfile(profile){

      var deffered=$q.defer();

      $http.post(api.PROFILE,profile)
        .success(function(resp){
          deffered.resolve(resp);
        })
        .error(function(err){

          deffered.reject(err);
        });

      return deffered.promise;
    }
  }

  function RegionService($http){
    return {
      queryCountryList:getCountry,
      queryProviceList:getProvice,
      queryCityList:getCity
    };

    function getCountry(){

    }

    function getProvice(){

    }

    function getCity(){

    }
  }

  function ScheduleService

  function Interceptor($q,$rootScope,Config){
    var events=Config.events;
    return {
      request:function(config){
        $rootScope.$broadcast(events.REQUEST_START,config);
        return config;
      },
      requestError:function(rejection){
        $rootScope.$broadcast(events.REQUEST_ERROR,rejection);
        return $q.reject(rejection);
      },
      response:function(response){
        $rootScope.$broadcast(events.RESPONSE,response);
        return response;
      },
      responseError: function(rejection) {
        $rootScope.$broadcast(events.RESPONSE_ERROR,rejection);
        return $q.reject(rejection);
      }
    };
  }
})();


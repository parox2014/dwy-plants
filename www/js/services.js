(function(){
  angular
    .module('app.services', [])
    .factory('Config',function(){
      return {
        api:{
          SIGNIN:'',
          SIGNOUT:'',
          SIGNUP:'/signup'
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

    .service('Sign',SignService);



  function SignService($http,Session,$q,Config){
    var api=Config.api;

    return {
      signin:signin,
      signout:signout,
      signup:signup
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
  }
})();


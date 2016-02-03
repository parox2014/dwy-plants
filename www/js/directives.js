(function () {
  angular.module('app.directives', [])


    .directive('repeatPassword',repeatPasswordDirective);

  /**
   * @description 重复密码一致性验证
   */
  function repeatPasswordDirective($parse) {
    return {
      restrict: 'EA',
      replace: false,
      require: '?^ngModel',
      link: function ($scope, element, attr, ngModelCtrl) {

        var getterOPW = $parse(attr.ngModel);
        var getterRPW = $parse(attr.repeatPassword);

        //监听密码的输入，有变动，则验证原始密码与重复密码是否相同
        $scope.$watch(getterOPW, function (val) {
          var rpw = getterRPW($scope);

          validatePassword(val, rpw);
        });

        //监听重复密码的输入，有变动，则验证原始密码与重复密码是否相同
        $scope.$watch(getterRPW, function (val) {
          var opw = getterOPW($scope);

          validatePassword(opw, val);
        });

        function validatePassword(origin, repeat) {
          var isSame;
          if(!origin&&!repeat){
            isSame=true;
          }else{
            isSame= origin == repeat;
          }
          ngModelCtrl.$setValidity('repeatPassword', isSame);
        }
      }
    };
  }
})();




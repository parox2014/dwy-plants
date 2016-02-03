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

        var getterNgModel = $parse(attr.ngModel);
        var getterPassword = $parse(attr.repeatPassword);

        //监听密码的输入，有变动，则验证原始密码与重复密码是否相同
        $scope.$watch(getterNgModel, function (val) {
          var opw = getterPassword($scope);
          validatePassword(opw, val);
        });

        //监听重复密码的输入，有变动，则验证原始密码与重复密码是否相同
        $scope.$watch(getterPassword, function (val) {
          var rpw = getterNgModel($scope);

          if (!rpw)return;

          validatePassword(val, rpw);
        });

        function validatePassword(origin, confirm) {
          var isSame = origin == confirm;
          ngModelCtrl.$setValidity('repeatPassword', isSame);
        }
      }
    };
  }
})();




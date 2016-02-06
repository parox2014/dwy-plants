(function () {
  angular.module('app.directives', [])


    .directive('repeatPassword', repeatPasswordDirective)
    .directive('ngGeoNames', ngGeoNamesDirective);

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
          if (!origin && !repeat) {
            isSame = true;
          } else {
            isSame = origin == repeat;
          }
          ngModelCtrl.$setValidity('repeatPassword', isSame);
        }
      }
    };
  }

  function ngGeoNamesDirective(GeoNames) {
    return {
      restrict: 'E',
      templateUrl: 'templates/geoNames.html',
      scope: {
        viewModel: '='
      },
      link: function (scope, element, attrs) {
        var vm = scope.vm = {
          countryDisabled: true,
          stateDisabled: true,
          cityDisabled: true
        };

        scope.$watch('viewModel.country', function (country) {
          if (!country)return;

          vm.stateDisabled = true;
          GeoNames.queryProviceList(country.geonameId)
            .then(function (resp) {
              vm.stateDisabled = false;
              scope.stateList = resp;
            })
        }, true);

        scope.$watch('viewModel.state', function (state) {
          if (!state)return;

          vm.cityDisabled = true;
          GeoNames.queryCityList(state.geonameId)
            .then(function (resp) {
              vm.cityDisabled = false;
              scope.cityList = resp;
            })
        }, true);

        GeoNames.queryCountryList()
          .then(function (resp) {
            vm.countryDisabled = false;
            scope.countryList = resp;
          });
      }
    }
  }
})();




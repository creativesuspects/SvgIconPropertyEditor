angular
  .module('umbraco')
  .controller(
    'SvgIconPropertyEditor.IconPicker.Controller',
    function ($scope, $http, $element, $sce) {
      const svgPath = $scope.model.svgPath;

      $scope.model.results = [];

      setTimeout(function () {
        var input = $element[0].querySelector('#icon-search');
        if (input) input.focus();
        $scope.load();
      }, 20);

      $scope.submit = function (result) {
        if ($scope.model.submit) {
          $scope.model.submit(result);
        }
      };

      $scope.close = function () {
        if ($scope.model.close) {
          $scope.model.close();
        }
      };

      $scope.renderSvg = function (icon) {
        var iconElem = angular.element(icon);

        var svg =
          '<svg xmlns="http://www.w3.org/2000/svg" class="' +
          iconElem.attr('id') +
          '" viewbox="' +
          iconElem.attr('viewBox') +
          '">';
        for (let i = 0; i < iconElem[0].children.length; i++) {
          svg += iconElem[0].children[i].outerHTML;
        }
        svg += '</svg>';

        return svg;
      };

      $scope.formatData = function (data) {
        $scope.model.results = [];

        var svg = angular.element(data);
        angular.forEach(svg.find('symbol'), function (symbol) {
          var item = {
            symbolId: angular.element(symbol).attr('id'),
            svg: $scope.renderSvg(symbol),
          };

          $scope.model.results.push(item);
        });
      };

      $scope.trustAsHtml = $sce.trustAsHtml;

      $scope.load = function () {
        if ($scope.model.search === '') {
          return;
        }

        $scope.model.loading = true;

        $http.get(svgPath).then(function (response) {
          if (
            response !== null &&
            response !== undefined &&
            response.data !== undefined
          ) {
            $scope.formatData(response.data);
          } else {
            $scope.model.results = null;
          }
          $scope.model.loading = false;
        });
      };
    }
  );

angular
  .module('umbraco')
  .controller(
    'SvgIconPropertyEditor.Icon.Controller',
    function ($scope, editorService, $sce) {
      var vm = this;
      vm.add = add;
      vm.showPrompt = showPrompt;
      vm.hidePrompt = hidePrompt;
      vm.remove = remove;
      vm.getIconHtml = getIconHtml;

      vm.svgPath = $scope.model.config.svgPath;
      vm.svgPathVersioned =
        vm.svgPath +
        '?d=' +
        Umbraco.Sys.ServerVariables.application.cacheBuster;

      function add() {
        const item = {
          symbolId: '',
          svg: '',
          svgPath: '',
        };
        $scope.model.value.push(item);
      }

      function showPrompt(item) {
        item.deletePrompt = true;
      }

      function hidePrompt(item) {
        item.deletePrompt = false;
      }

      function remove($index) {
        $scope.model.value.splice($index, 1);
      }

      function getIconHtml(item) {
        return (
          '<svg xmlns="http://www.w3.org/2000/svg"><use xlink:href="' +
          vm.svgPathVersioned +
          '#' +
          item.symbolId +
          '"></use></svg>'
        );
      }

      const sortableOptions = {
        distance: 10,
        tolerance: 'pointer',
        opacity: 0.7,
        scroll: true,
        cursor: 'move',
        handle: '> .list-view-layout__sort-handle',
      };

      vm.sortableOptions = sortableOptions;

      if (!$scope.model.value) {
        $scope.model.value = [];
        vm.add();
      }

      $scope.addIcon = function (item) {
        const iconPicker = {
          title: 'Select icon',
          view: '/App_Plugins/SvgIconPropertyEditor/IconPicker/iconPicker.html',
          size: 'medium',
          svgPath: vm.svgPathVersioned,
          submit: function (model) {
            item.symbolId = model.symbolId;
            item.svg = model.svg;
            item.svgPath = vm.svgPath;
            editorService.close();
          },
          close: function () {
            editorService.close();
          },
        };
        editorService.open(iconPicker);
      };

      $scope.removeIcon = function (item) {
        item.symbolId = '';
        item.svg = '';
        item.svgPath = '';
      };

      $scope.trustAsHtml = $sce.trustAsHtml;

      $scope.$watch(
        function () {
          return $scope.model.value.length;
        },
        function () {
          if (
            $scope.model.config &&
            $scope.model.config.minNumber &&
            parseInt($scope.model.config.minNumber) > $scope.model.value.length
          ) {
            $scope.svgIconForm.minCount.$setValidity('minCount', false);
          } else {
            $scope.svgIconForm.minCount.$setValidity('minCount', true);
          }

          if (
            $scope.model.config &&
            $scope.model.config.maxNumber &&
            parseInt($scope.model.config.maxNumber) < $scope.model.value.length
          ) {
            $scope.svgIconForm.maxCount.$setValidity('maxCount', false);
          } else {
            $scope.svgIconForm.maxCount.$setValidity('maxCount', true);
          }
          vm.sortableOptions.disabled = $scope.model.value.length === 1;
        }
      );
    }
  );

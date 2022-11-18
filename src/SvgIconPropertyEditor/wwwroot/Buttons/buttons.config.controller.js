angular
  .module('umbraco')
  .controller(
    'SvgIconPropertyEditor.Buttons.Config.Controller',
    function ($scope, editorService, $sce, notificationsService) {
      const vm = this;

      var svgPathInput = document
        .querySelector('label[for="svgPath"]')
        .parentElement.parentElement.parentElement.querySelector(
          'input[name="requiredfield"]'
        );

      vm.sortableOptions = {
        distance: 10,
        tolerance: 'pointer',
        opacity: 0.7,
        scroll: true,
        cursor: 'move',
        handle: '.list-view-layout__sort-handle',
      };

      vm.add = function () {
        const item = {
          label: '',
          value: '',
          svg: '',
        };
        $scope.model.value.push(item);
      };

      vm.showPrompt = function (item) {
        item.deletePrompt = true;
      };

      vm.hidePrompt = function (item) {
        item.deletePrompt = false;
      };

      vm.remove = function ($index) {
        $scope.model.value.splice($index, 1);
      };

      vm.removeIcon = function (item) {
        item.svg = '';
      };

      if (!$scope.model.value) {
        $scope.model.value = [];
      }

      $scope.addIcon = function (item) {
        if (svgPathInput.value === '') {
          notificationsService.error(
            'Missing SVG path',
            'The SVG path cannot be empty.'
          );
          return;
        }

        const iconPicker = {
          title: 'Select icon',
          view: '/App_Plugins/SvgIconPropertyEditor/IconPicker/iconPicker.html',
          size: 'medium',
          svgPath: svgPathInput.value + '?v=' + new Date().getTime(),
          submit: function (model) {
            item.svg = model.svg;
            editorService.close();
          },
          close: function () {
            editorService.close();
          },
        };
        editorService.open(iconPicker);
      };

      $scope.trustAsHtml = $sce.trustAsHtml;
    }
  );

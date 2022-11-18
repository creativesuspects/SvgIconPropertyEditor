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

angular
  .module('umbraco')
  .controller(
    'SvgIconPropertyEditor.Buttons.Controller',
    function ($scope, $sce) {
      var vm = this;
      vm.showLabel = false;
      vm.allowMultiple = false;
      vm.buttons = [];

      vm.setClasses = function (item) {
        const index = $scope.model.value.indexOf(item.value);

        const classes = {
          'btn-selection': index !== -1,
          'btn-info': index === -1,
          'btn-wide': vm.showLabel && item.svg.length > 0,
        };
        return classes;
      };

      vm.add = function (value) {
        const index = $scope.model.value.indexOf(value);

        if (vm.allowMultiple) {
          if (index !== -1) {
            $scope.model.value.splice(index, 1);
          } else {
            $scope.model.value.push(value);
          }
        } else {
          $scope.model.value = [];

          if (index === -1) {
            $scope.model.value.push(value);
          }
        }
      };

      $scope.trustAsHtml = $sce.trustAsHtml;

      vm.init = function () {
        if ($scope.model.config && $scope.model.config.iconButtons) {
          vm.buttons = $scope.model.config.iconButtons;
        }
        if ($scope.model.config && $scope.model.config.showLabel) {
          vm.showLabel = $scope.model.config.showLabel !== '0';
        }
        if ($scope.model.config && $scope.model.config.allowMultiple) {
          vm.allowMultiple = $scope.model.config.allowMultiple !== '0';
        }
      };

      if (!$scope.model.value) {
        $scope.model.value = [];
        if ($scope.model.config && $scope.model.config.defaultValue) {
          $scope.model.value.push($scope.model.config.defaultValue);
        }
      }

      vm.init();
    }
  );

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

angular
  .module('umbraco')
  .controller(
    'SvgIconPropertyEditor.CssClasses.Config.Controller',
    function ($scope) {
      const vm = this;

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
          name: '',
          value: '',
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

      if (!$scope.model.value) {
        $scope.model.value = [];
      }
    }
  );

angular
  .module('umbraco')
  .controller(
    'SvgIconPropertyEditor.Links.Controller',
    function (
      $scope,
      angularHelper,
      iconHelper,
      editorService,
      entityResource,
      localizationService,
      $sce
    ) {
      var vm = this;

      vm.add = add;
      vm.showPrompt = showPrompt;
      vm.hidePrompt = hidePrompt;
      vm.remove = remove;
      vm.hideIcon = false;
      vm.getIconHtml = getIconHtml;

      vm.svgPath = $scope.model.config.svgPath;
      vm.svgPathVersioned =
        vm.svgPath +
        '?d=' +
        Umbraco.Sys.ServerVariables.application.cacheBuster;

      function add() {
        const item = {
          primaryClass: '',
          secondaryClass: '',
          symbolId: '',
          svg: '',
          svgPath: '',
          link: [],
        };
        $scope.model.value.push(item);
      }

      function showPrompt(item) {
        item.deletePrompt = true;
      }

      function hidePrompt(item) {
        item.deletePrompt = false;
      }

      function remove($index, item) {
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

      var currentForm = angularHelper.getCurrentForm($scope);

      $scope.model.value.forEach(function (item) {
        item.link.icon = iconHelper.convertFromLegacyIcon(item.link.icon);
      });

      $scope.openLinkPicker = function (item, link) {
        const target = link
          ? {
              name: link.name,
              anchor: link.queryString,
              udi: link.isMedia ? null : link.udi,
              url: link.url,
              target: link.target,
            }
          : null;

        const linkPicker = {
          currentTarget: target,
          submit: function (model) {
            if (model.target.url || model.target.anchor) {
              if (
                model.target.anchor &&
                model.target.anchor[0] !== '?' &&
                model.target.anchor[0] !== '#'
              ) {
                model.target.anchor =
                  (model.target.anchor.indexOf('=') === -1 ? '#' : '?') +
                  model.target.anchor;
              }
              if (link) {
                if (link.isMedia && link.url === model.target.url) {
                } else {
                  link.udi = model.target.udi;
                  link.isMedia = model.target.isMedia;
                }

                link.name =
                  model.target.name || model.target.url || model.target.anchor;
                link.queryString = model.target.anchor;
                link.target = model.target.target;
                link.url = model.target.url;
              } else {
                link = {
                  isMedia: model.target.isMedia,
                  name:
                    model.target.name ||
                    model.target.url ||
                    model.target.anchor,
                  queryString: model.target.anchor,
                  target: model.target.target,
                  udi: model.target.udi,
                  url: model.target.url,
                };
                item.link = [];
                item.link.push(link);
              }

              if (link.udi) {
                var entityType = link.isMedia ? 'media' : 'document';

                entityResource
                  .getById(link.udi, entityType)
                  .then(function (data) {
                    link.icon = iconHelper.convertFromLegacyIcon(data.icon);
                    link.published =
                      data.metaData &&
                      data.metaData.IsPublished === false &&
                      entityType === 'Document'
                        ? false
                        : true;
                    link.trashed = data.trashed;
                    if (link.trashed) {
                      item.url =
                        localizationService.dictionary.general_recycleBin;
                    }
                  });
              } else {
                link.icon = 'icon-link';
                link.published = true;
              }

              currentForm.$setDirty();
            }
            editorService.close();
          },
          close: function () {
            editorService.close();
          },
        };
        editorService.linkPicker(linkPicker);
      };

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

      $scope.removeLink = function (item) {
        item.link = [];
      };

      vm.init = function () {
        if ($scope.model.config && $scope.model.config.hideIconPicker) {
          vm.hideIcon = $scope.model.config.hideIconPicker == true;
        }
      };
      vm.init();
    }
  );

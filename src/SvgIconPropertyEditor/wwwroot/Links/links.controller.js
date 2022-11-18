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

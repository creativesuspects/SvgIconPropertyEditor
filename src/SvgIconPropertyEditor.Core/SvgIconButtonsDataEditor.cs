using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace SvgIconPropertyEditor
{
    [DataEditor(
        Constants.SvgIconButtonsEditorAlias,
        EditorType.PropertyValue,
        Constants.SvgIconButtonsEditorName,
        Constants.SvgIconButtonsEditorView,
        Group = Constants.EditorGroup,
        Icon = Constants.SvgIconButtonsEditorIcon,
        ValueType = ValueTypes.Json
    )]
    public class SvgIconButtonsDataEditor : DataEditor
    {
        private readonly IIOHelper _ioHelper;
        private readonly IEditorConfigurationParser _editorConfigurationParser;

        public SvgIconButtonsDataEditor(
            IDataValueEditorFactory dataValueEditorFactory,
            IIOHelper ioHelper,
            IEditorConfigurationParser editorConfigurationParser,
            EditorType type = EditorType.PropertyValue) : base(dataValueEditorFactory, type)
        {
            _ioHelper = ioHelper;
            _editorConfigurationParser = editorConfigurationParser;
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new SvgIconButtonsConfigurationEditor(_ioHelper, _editorConfigurationParser);
    }
}

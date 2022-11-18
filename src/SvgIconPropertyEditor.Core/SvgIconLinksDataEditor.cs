using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace SvgIconPropertyEditor
{
    [DataEditor(
        Constants.SvgIconLinksEditorAlias,
        EditorType.PropertyValue,
        Constants.SvgIconLinksEditorName,
        Constants.SvgIconLinksEditorView,
        Group = Constants.EditorGroup,
        Icon = Constants.SvgIconLinksEditorIcon,
        ValueType = ValueTypes.Json
    )]
    public class SvgIconLinksDataEditor : DataEditor
    {
        private readonly IIOHelper _ioHelper;
        private readonly IEditorConfigurationParser _editorConfigurationParser;

        public SvgIconLinksDataEditor(
            IDataValueEditorFactory dataValueEditorFactory,
            IIOHelper ioHelper,
            IEditorConfigurationParser editorConfigurationParser,
            EditorType type = EditorType.PropertyValue) : base(dataValueEditorFactory, type)
        {
            _ioHelper = ioHelper;
            _editorConfigurationParser = editorConfigurationParser;
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new SvgIconLinksConfigurationEditor(_ioHelper, _editorConfigurationParser);
    }
}

using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace SvgIconPropertyEditor
{
    [DataEditor(
        Constants.SvgIconEditorAlias,
        EditorType.PropertyValue,
        Constants.SvgIconEditorName,
        Constants.SvgIconEditorView,
        Group = Constants.EditorGroup,
        Icon = Constants.SvgIconEditorIcon,
        ValueType = ValueTypes.Json
    )]
    public class SvgIconDataEditor : DataEditor
    {
        private readonly IIOHelper _ioHelper;
        private readonly IEditorConfigurationParser _editorConfigurationParser;

        public SvgIconDataEditor(
            IDataValueEditorFactory dataValueEditorFactory,
            IIOHelper ioHelper,
            IEditorConfigurationParser editorConfigurationParser,
            EditorType type = EditorType.PropertyValue) : base(dataValueEditorFactory, type)
        {
            _ioHelper = ioHelper;
            _editorConfigurationParser = editorConfigurationParser;
        }

        protected override IConfigurationEditor CreateConfigurationEditor() => new SvgIconConfigurationEditor(_ioHelper, _editorConfigurationParser);
    }
}

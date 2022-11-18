using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace SvgIconPropertyEditor
{

    public class SvgIconConfigurationEditor : ConfigurationEditor<SvgIconConfiguration>
    {
        public SvgIconConfigurationEditor(
            IIOHelper ioHelper,
            IEditorConfigurationParser editorConfigurationParser) : base(ioHelper, editorConfigurationParser)
        {
        }
    }
}

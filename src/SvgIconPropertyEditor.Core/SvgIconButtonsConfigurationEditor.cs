using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace SvgIconPropertyEditor
{

    public class SvgIconButtonsConfigurationEditor : ConfigurationEditor<SvgIconButtonsConfiguration>
    {
        public SvgIconButtonsConfigurationEditor(
            IIOHelper ioHelper,
            IEditorConfigurationParser editorConfigurationParser) : base(ioHelper, editorConfigurationParser)
        {
        }
    }
}

using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;

namespace SvgIconPropertyEditor
{

    public class SvgIconLinksConfigurationEditor : ConfigurationEditor<SvgIconLinksConfiguration>
    {
        public SvgIconLinksConfigurationEditor(
            IIOHelper ioHelper,
            IEditorConfigurationParser editorConfigurationParser) : base(ioHelper, editorConfigurationParser)
        {
        }
    }
}

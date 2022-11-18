using System.Collections.Generic;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Manifest;

namespace SvgIconPropertyEditor
{
    public class ManifestLoader : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.ManifestFilters().Append<PackageManifestFilter>();
        }
    }

    internal class PackageManifestFilter : IManifestFilter
    {
        public void Filter(List<PackageManifest> manifests)
        {
            var manifest = new PackageManifest()
            {
                PackageName = Constants.SvgIconEditorName,
                Scripts = new string[] { "/App_Plugins/SvgIconPropertyEditor/svgiconpropertyeditor.js" },
                Stylesheets = new string[] { "/App_Plugins/SvgIconPropertyEditor/svgiconpropertyeditor.css" },
            };

            manifests.Add(manifest);
        }
    }
}

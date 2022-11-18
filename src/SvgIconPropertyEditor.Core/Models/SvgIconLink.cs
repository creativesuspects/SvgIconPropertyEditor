using System.Text;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Strings;

namespace SvgIconPropertyEditor.Models
{
    public partial class SvgIconLink
    {
        public string PrimaryClass { get; set; } = "";

        public string SecondaryClass { get; set; } = "";

        public string SymbolId { get; set; } = "";

        public string Svg { get; set; } = "";

        public string SvgPath { get; set; } = "";

        public Link? Link { get; set; }

        public SvgIconLink(SvgIconLinkDto iconLinkDto, Link? link)
        {
            PrimaryClass = iconLinkDto.PrimaryClass;
            SecondaryClass = iconLinkDto.SecondaryClass;
            SymbolId = iconLinkDto.SymbolId;
            Svg = iconLinkDto.Svg;
            SvgPath = iconLinkDto.SvgPath;
            Link = link;
        }

        public bool HasIcon => string.IsNullOrWhiteSpace(SymbolId) == false;

        public bool HasLink => Link != null;

        public IHtmlEncodedString IconToHtml(string? cssClasses = null, string? cacheBuster = null)
        {
            var html = new StringBuilder();
            var svgPath = SvgPath;

            if (string.IsNullOrWhiteSpace(cacheBuster) == false)
                svgPath += svgPath.Contains("?") ? "&v=" + cacheBuster : "?v=" + cacheBuster;

            html.Append($"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"{cssClasses}\">");
            html.Append($"<use xlink:href=\"{svgPath}#{SymbolId}\"></use>");
            html.Append($"</svg>");

            return new HtmlEncodedString(html.ToString());
        }
    }
}

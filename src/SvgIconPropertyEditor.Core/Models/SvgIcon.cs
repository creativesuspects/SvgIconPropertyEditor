using Newtonsoft.Json;
using System.Text;
using Umbraco.Cms.Core.Strings;

namespace SvgIconPropertyEditor.Models
{
    public partial class SvgIcon
    {
        [JsonProperty("symbolId")]
        public string SymbolId { get; set; } = "";

        [JsonProperty("svg")]
        public string Svg { get; set; } = "";

        [JsonProperty("svgPath")]
        public string SvgPath { get; set; } = "";

        [JsonIgnore]
        public bool HasIcon => string.IsNullOrWhiteSpace(SymbolId) == false;

        public IHtmlEncodedString ToHtml(string? cssClasses = null, string? cacheBuster = null)
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

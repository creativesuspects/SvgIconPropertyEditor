using Newtonsoft.Json;

namespace SvgIconPropertyEditor.Models
{
    public partial class SvgIconLinkDto
    {
        [JsonProperty("primaryClass")]
        public string PrimaryClass { get; set; } = "";

        [JsonProperty("secondaryClass")]
        public string SecondaryClass { get; set; } = "";

        [JsonProperty("symbolId")]
        public string SymbolId { get; set; } = "";

        [JsonProperty("svg")]
        public string Svg { get; set; } = "";

        [JsonProperty("svgPath")]
        public string SvgPath { get; set; } = "";

        [JsonProperty("link")]
        public SvgLinkDto[]? Link { get; set; }
    }
}

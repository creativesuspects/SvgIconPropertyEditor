using Newtonsoft.Json;
using Umbraco.Cms.Core;

namespace SvgIconPropertyEditor.Models
{
    public partial class SvgLinkDto
    {
        [JsonProperty("name")]
        public string Name { get; set; } = "";

        [JsonProperty("udi")]
        public GuidUdi? Udi { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; } = "";

        [JsonProperty("queryString")]
        public string QueryString { get; set; } = "";

        [JsonProperty("target")]
        public string Target { get; set; } = "";
    }
}

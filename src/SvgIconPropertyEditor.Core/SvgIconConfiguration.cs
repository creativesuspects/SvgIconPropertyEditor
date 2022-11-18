using System.Runtime.Serialization;
using Umbraco.Cms.Core.PropertyEditors;

namespace SvgIconPropertyEditor
{
    [DataContract]
    public class SvgIconConfiguration
    {
        [DataMember(Name = "svgPath")]
        [ConfigurationField("svgPath", "SVG path", Constants.RequiredFieldView,
            Description = "Path or URL to your SVG sprite")]
        public string SvgPath { get; set; } = Constants.DefaultSvgPath;

        [DataMember(Name = "minNumber")]
        [ConfigurationField("minNumber", "Minimum number of items", Constants.NumberView,
            Description = "")]
        public int MinNumber { get; set; } = 0;

        [DataMember(Name = "maxNumber")]
        [ConfigurationField("maxNumber", "Maximum number of items", Constants.NumberView,
            Description = "")]
        public int MaxNumber { get; set; } = 0;
    }
}

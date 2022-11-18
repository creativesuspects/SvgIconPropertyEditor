using System.Runtime.Serialization;
using Umbraco.Cms.Core.PropertyEditors;

namespace SvgIconPropertyEditor
{
    [DataContract]
    public class SvgIconLinksConfiguration
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

        [DataMember(Name = "primaryClassItems")]
        [ConfigurationField("primaryClassItems", "Primary Class Dropdown", Constants.ClassDropdownView,
            Description = "Add key/value pairs for primary class dropdown")]
        public object? PrimaryClassItems { get; set; }

        [DataMember(Name = "secondaryClassItems")]
        [ConfigurationField("secondaryClassItems", "Secondary Class Dropdown", Constants.ClassDropdownView,
            Description = "Add key/value pairs for secondary class dropdown")]
        public object? SecondaryClassItems { get; set; }

        [DataMember(Name = "hideIconPicker")]
        [ConfigurationField("hideIconPicker", "Hide Icon Picker", Constants.BooleanView,
            Description = "Hide the icon picker")]
        public bool HideIconPicker { get; set; } = false;
    }
}

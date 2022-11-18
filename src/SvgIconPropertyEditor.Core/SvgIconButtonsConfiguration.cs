using System.Runtime.Serialization;
using Umbraco.Cms.Core.PropertyEditors;

namespace SvgIconPropertyEditor
{
    [DataContract]
    public class SvgIconButtonsConfiguration
    {
        [DataMember(Name = "svgPath")]
        [ConfigurationField("svgPath", "SVG path", Constants.RequiredFieldView,
            Description = "Path or URL to your SVG sprite")]
        public string SvgPath { get; set; } = Constants.DefaultSvgPath;

        [DataMember(Name = "iconButtons")]
        [ConfigurationField("iconButtons", "SVG Icon Buttons", Constants.IconButtonsView,
            Description = "Configure your icon buttons")]
        public object? IconButtons { get; set; }

        [DataMember(Name = "showLabel")]
        [ConfigurationField("showLabel", "Show label", Constants.BooleanView,
            Description = "Show the label as well as the icon")]
        public bool ShowLabel { get; set; } = false;

        [DataMember(Name = "allowMultiple")]
        [ConfigurationField("allowMultiple", "Allow multiple", Constants.BooleanView,
            Description = "Allow multiple buttons to be selected")]
        public bool AllowMultiple { get; set; } = false;

        [DataMember(Name = "defaultValue")]
        [ConfigurationField("defaultValue", "Default value", Constants.TextStringView,
            Description = "Set the default selected value")]
        public string? DefaultValue { get; set; }
    }
}

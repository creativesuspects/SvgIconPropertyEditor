using SvgIconPropertyEditor.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace SvgIconPropertyEditor.PropertyValueConverters
{
    class SvgIconPropertyValueConverter : PropertyValueConverterBase
    {
        /// <summary>
        /// Gets a value indicating whether the converter supports a property type.
        /// </summary>
        /// <param name="propertyType">The property type.</param>
        /// <returns>A value indicating whether the converter supports a property type.</returns>
        public override bool IsConverter(IPublishedPropertyType propertyType) =>
            (propertyType.EditorAlias).Equals("SvgIconPropertyEditor");

        /// <summary>
        /// Gets the type of values returned by the converter.
        /// </summary>
        /// <param name="propertyType">The property type.</param>
        /// <returns>The CLR type of values returned by the converter.</returns>
        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
        =>
            GetMaxNumber(propertyType.DataType.Configuration) == 1
                ? typeof(SvgIcon)
                : typeof(IEnumerable<SvgIcon>);
        

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) =>
            PropertyCacheLevel.Snapshot;

        public override bool? IsValue(object? value, PropertyValueLevel level) => value?.ToString() != "[]";

        public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType,
            object? source, bool preview) => source?.ToString();

        public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType,
            PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            var maxNumber = GetMaxNumber(propertyType.DataType.Configuration);
            if (inter == null)
            {
                return maxNumber == 1 ? null : Enumerable.Empty<SvgIcon>();
            }
            var icons = JsonConvert.DeserializeObject<IEnumerable<SvgIcon>>(inter?.ToString() ?? "")?.ToList();
   
            if (maxNumber == 1) return icons?.FirstOrDefault();
            if (maxNumber > 0) return icons?.Take(maxNumber);
            return icons;
        }

        private int GetMaxNumber(object? configuration)
        {
            var json = JsonConvert.SerializeObject(configuration);
            var maxNumber = 0;
            var config = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            if (config != null && config.ContainsKey("maxNumber"))
            {
                int.TryParse(config["maxNumber"].ToString(), out maxNumber);
            }

            return maxNumber;
        }
    }
}

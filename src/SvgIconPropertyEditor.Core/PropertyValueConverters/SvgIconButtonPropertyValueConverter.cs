﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace SvgIconPropertyEditor.PropertyValueConverters
{
    class SvgIconButtonPropertyValueConverter : PropertyValueConverterBase
    {
        /// <summary>
        /// Gets a value indicating whether the converter supports a property type.
        /// </summary>
        /// <param name="propertyType">The property type.</param>
        /// <returns>A value indicating whether the converter supports a property type.</returns>
        public override bool IsConverter(IPublishedPropertyType propertyType) =>
            (propertyType.EditorAlias).Equals("SvgIconButtonsPropertyEditor");

        /// <summary>
        /// Gets the type of values returned by the converter.
        /// </summary>
        /// <param name="propertyType">The property type.</param>
        /// <returns>The CLR type of values returned by the converter.</returns>
        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
        =>
            GetAllowMultiple(propertyType.DataType.Configuration)
                ? typeof(string[])
                : typeof(string);
        

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) =>
            PropertyCacheLevel.Snapshot;

        public override bool? IsValue(object? value, PropertyValueLevel level) => value?.ToString() != "[]";

        public override object ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType,
            object? source, bool preview) => source?.ToString() ?? "";

        public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType,
            PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            var allowMultiple = GetAllowMultiple(propertyType.DataType.Configuration);
            if (inter == null)
            {
                return allowMultiple ? new string[] { } : null;
            }

            var values = JsonConvert.DeserializeObject<string[]>(inter?.ToString() ?? "");

            if (allowMultiple == false)
            {
                return values?.FirstOrDefault();
            }

            return values;
        }

        private bool GetAllowMultiple(object? configuration)
        {
            var json = JsonConvert.SerializeObject(configuration);
            var allowMultiple = false;
            var config = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            if (config != null && config.ContainsKey("allowMultiple"))
            {
                allowMultiple = (bool)config["allowMultiple"];
            }

            return allowMultiple;
        }
    }
}

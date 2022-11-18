using SvgIconPropertyEditor.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Extensions;

namespace SvgIconPropertyEditor.PropertyValueConverters
{
    class SvgLinksPropertyValueConverter : PropertyValueConverterBase
    {

        private readonly IPublishedSnapshotAccessor _publishedSnapshotAccessor;

        public SvgLinksPropertyValueConverter(IPublishedSnapshotAccessor publishedSnapshotAccessor)
        {
            _publishedSnapshotAccessor = publishedSnapshotAccessor;
        }
        
        /// <summary>
        /// Gets a value indicating whether the converter supports a property type.
        /// </summary>
        /// <param name="propertyType">The property type.</param>
        /// <returns>A value indicating whether the converter supports a property type.</returns>
        public override bool IsConverter(IPublishedPropertyType propertyType) =>
            (propertyType.EditorAlias).Equals("SvgIconLinksPropertyEditor");


        /// <summary>
        /// Gets the type of values returned by the converter.
        /// </summary>
        /// <param name="propertyType">The property type.</param>
        /// <returns>The CLR type of values returned by the converter.</returns>
        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
            => GetMaxNumber(propertyType.DataType.Configuration) == 1 ?
                typeof(SvgIconLink) :
                typeof(IEnumerable<SvgIconLink>);

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
                return maxNumber == 1 ? null : Enumerable.Empty<SvgIconLink>();
            }

            var links = new List<SvgIconLink>();
            var linkDtos = JsonConvert.DeserializeObject<IEnumerable<SvgIconLinkDto>>(inter?.ToString() ?? "")?.ToList();

            if (linkDtos != null)
            {
                foreach (var linkDto in linkDtos)
                {
                    if (linkDto.Link?.FirstOrDefault() == null)
                        continue;

                    var dto = linkDto.Link.First();
                    var type = LinkType.External;
                    var url = dto.Url;

                    if (dto.Udi != null)
                    {
                        type = (dto.Udi.EntityType == Umbraco.Cms.Core.Constants.UdiEntityType.Media)
                            ? LinkType.Media
                            : LinkType.Content;

                        IPublishedContent? content = null;
                        if (_publishedSnapshotAccessor.TryGetPublishedSnapshot(out IPublishedSnapshot? publishedSnapshot))
                        {
                            content = (type == LinkType.Media)
                                ? publishedSnapshot?.Media?.GetById(preview, dto.Udi.Guid)
                                : publishedSnapshot?.Content?.GetById(preview, dto.Udi.Guid);
                        }

                        if (content == null || content.ItemType == PublishedItemType.Element)
                        {
                            continue;
                        }

                        url = content.Url();
                    }

                    links.Add(new SvgIconLink(linkDto, new Link
                    {
                        Name = dto.Name,
                        Target = dto.Target,
                        Type = type,
                        Udi = dto.Udi,
                        Url = url + dto.QueryString,
                    }));
                }
            }

            if (maxNumber == 1) return links?.FirstOrDefault();
            if (maxNumber > 0) return links?.Take(maxNumber);
            return links;
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

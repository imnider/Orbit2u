using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public class TagMapper
    {
        public static TagDto ToDto(Tag tag)
        {
            return new TagDto
            {
                TagId = tag.TagId,
                DisplayName = tag.DisplayName
            };
        }
    }
}

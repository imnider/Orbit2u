using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public static class ChannelMapper
    {
        public static ChannelDto ToDto(Channel channel, int subscriberCount = 0)
        {
            return new ChannelDto
            {
                ChannelId = channel.ChannelId,
                UserId = channel.ChannelId,
                Handle = channel.Handle,
                DisplayName = channel.DisplayName,
                Verification = channel.Verification,
                Description = channel.Description,
                AvatarURL = channel.AvatarUrl,
                BannerURL = channel.BannerUrl,
                CreatedAt = channel.CreatedAt,
                UpdatedAt = channel.UpdatedAt,
                DeletedAt = channel.DeletedAt,
                SubscriberCount = subscriberCount
            };
        }
    }
}

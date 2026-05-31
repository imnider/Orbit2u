using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public static class VideoMapper
    {
        public static VideoDto ToDto(Video video)
        {
            return new VideoDto
            {
                VideoId = video.VideoId,
                ChannelId = video.ChannelId,
                CommunityId = video.CommunityId,
                VideoAccessibilityId = video.VideoAccessibilityId,
                Title = video.Title,
                Description = video.Description,
                DurationSeconds = video.DurationSeconds,
                ThumbnailUrl = video.ThumbnailUrl,
                VideoUrl = video.VideoUrl,
                AgeRestriction = video.AgeRestriction,
                IsPinned = video.IsPinned,
                PublishedAt = video.PublishedAt,
                CreatedAt = video.CreatedAt,
                UpdatedAt = video.UpdatedAt,
                DeletedAt = video.DeletedAt,
            };
        }
    }
}

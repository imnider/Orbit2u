using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public static class CommunityMapper
    {
        public static CommunityDto ToDto(Community community, int memberCount = 0)
        {
            return new CommunityDto
            {
                CommunityId = community.CommunityId,
                OwnerUserId = community.OwnerUserId,
                Name = community.Name,
                Description = community.Description,
                AvatarUrl = community.AvatarUrl,
                BannerUrl = community.BannerUrl,
                IsPrivate = community.IsPrivate,
                CreatedAt = community.CreatedAt,
                UpdatedAt = community.UpdatedAt,
                DeletedAt = community.DeletedAt,
                MembersCount = memberCount
            };
        }
    }
}

namespace YoutubeClone.Application.Models.DTOs
{
    public class CommunityDto
    {
        public Guid CommunityId { get; set; }
        public Guid OwnerUserId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? AvatarUrl { get; set; }
        public string? BannerUrl { get; set; }
        public bool IsPrivate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public int MembersCount { get; set; }
    }
}

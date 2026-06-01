namespace YoutubeClone.Application.Models.DTOs
{
    public class VideoDto
    {
        public Guid VideoId { get; set; }
        public Guid ChannelId { get; set; }
        public Guid? CommunityId { get; set; }
        public int VideoAccessibilityId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int DurationSeconds { get; set; }
        public string ThumbnailUrl { get; set; } = null!;
        public string VideoUrl { get; set; } = null!;
        public bool AgeRestriction { get; set; }
        public bool IsPinned { get; set; }
        public DateTime PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public List<TagDto> Tags { get; set; } = [];

    }
}

namespace YoutubeClone.Application.Models.Requests.Videos
{
    public class CreateVideoRequest
    {
        public Guid? CommunityId { get; set; }
        public int VideoAccessibilityId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int DurationSeconds { get; set; }
        public string ThumbnailUrl { get; set; } = null!;
        public string VideoUrl { get; set; } = null!;
        public bool AgeRestriction { get; set; }
    }
}

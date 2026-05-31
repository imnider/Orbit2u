namespace YoutubeClone.Application.Models.Requests.Videos
{
    public class UpdateVideoRequest
    {
        public Guid? CommunityId { get; set; }
        public int? VideoAccessibilityId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public bool? AgeRestriction { get; set; }
    }
}

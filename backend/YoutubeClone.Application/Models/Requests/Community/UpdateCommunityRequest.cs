namespace YoutubeClone.Application.Models.Requests.Community
{
    public class UpdateCommunityRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? AvatarUrl { get; set; }
        public string? BannerUrl { get; set; }
        public bool? IsPrivate { get; set; }
    }
}

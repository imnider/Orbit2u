namespace YoutubeClone.Application.Models.Requests.Channels
{
    public class UpdateChannerlRequest
    {
        public string? Handle { get; set; }
        public string? DisplayName { get; set; }
        public string? Description { get; set; }
        public string? AvatarUrl { get; set; }
        public string? BannerUrl { get; set; }
    }
}

namespace YoutubeClone.Application.Models.Requests.Videos
{
    public class FilterVideoRequest : BaseRequest
    {
        public string? Title { get; set; }
        public List<string>? Tag { get; set; }
    }
}

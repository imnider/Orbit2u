namespace YoutubeClone.Application.Models.Responses
{
    public class FileUploadResponse
    {
        public string Url { get; set; } = null!;
        public string PublicId { get; set; } = null!;
        public string FileName { get; set; } = null!;
    }
}

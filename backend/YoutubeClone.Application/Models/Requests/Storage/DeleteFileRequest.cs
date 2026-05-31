using System.ComponentModel.DataAnnotations;

namespace YoutubeClone.Application.Models.Requests.Storage
{
    public class DeleteFileRequest
    {
        [Required]
        public string FileUrl { get; set; } = null!;
    }
}

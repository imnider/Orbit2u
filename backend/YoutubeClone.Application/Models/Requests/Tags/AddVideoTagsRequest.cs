using System.ComponentModel.DataAnnotations;

namespace YoutubeClone.Application.Models.Requests.Tags
{
    public class AddVideoTagsRequest
    {
        [Required]
        public List<Guid> TagIds { get; set; } = [];
    }
}

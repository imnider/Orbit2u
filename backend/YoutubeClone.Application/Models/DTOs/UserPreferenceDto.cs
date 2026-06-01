namespace YoutubeClone.Application.Models.DTOs
{
    public class UserPreferenceDto
    {
        public Guid UserPreferenceId { get; set; }
        public string ThemeName { get; set; } = null!;
        public List<TagDto> Tags { get; set; } = [];
    }
}

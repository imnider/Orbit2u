namespace YoutubeClone.Application.Models.DTOs
{
    public class UserPreferenceDto
    {
        public Guid UserPreferenceId { get; set; }
        public Guid UserId { get; set; }
        public string ThemeName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

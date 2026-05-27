namespace YoutubeClone.Application.Models.DTOs
{
    public class UserWalletDto
    {
        public Guid UserWalletId { get; set; }
        public Guid UserId { get; set; }
        public int Balance { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

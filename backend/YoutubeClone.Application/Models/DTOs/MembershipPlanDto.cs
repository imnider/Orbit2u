namespace YoutubeClone.Application.Models.DTOs
{
    public class MembershipPlanDto
    {
        public int MembershipPlanId { get; set; }
        public string DisplayName { get; set; } = null!;
        public string? Description { get; set; }
        public decimal MonthlyPrice { get; set; }
        public int CoinsReward { get; set; }
        public int MaxCommunities { get; set; }
        public int MaxVideosPerCommunity { get; set; }
    }
}

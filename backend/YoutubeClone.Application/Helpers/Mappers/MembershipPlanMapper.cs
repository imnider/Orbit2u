using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public static class MembershipPlanMapper
    {
        public static MembershipPlanDto ToDto(MembershipPlan membershipPlan)
        {
            return new MembershipPlanDto
            {
                MembershipPlanId = membershipPlan.MembershipPlanId,
                DisplayName = membershipPlan.DisplayName,
                Description = membershipPlan.Description,
                MonthlyPrice = membershipPlan.MonthlyPrice,
                CoinsReward = membershipPlan.CoinsReward,
                MaxCommunities = membershipPlan.MaxCommunities,
                MaxVideosPerCommunity = membershipPlan.MaxVideosPerCommunity,
            };
        }
    }
}

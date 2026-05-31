using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public static class UserMapper
    {
        public static UserDto ToDto(UserAccount user)
        {
            var role = user.UserAccountRoles.FirstOrDefault()?.Role;
            var membershipPlan = user.UserMemberships.FirstOrDefault()?.MembershipPlan;
            var channel = user.Channels.FirstOrDefault();

            return new UserDto
            {
                UserId = user.UserId,
                UserName = user.UserName,
                DisplayName = user.DisplayName,
                Email = user.Email,
                Birthday = user.Birthday,
                Location = user.Location,
                Password = user.Password,
                CreatedAt = user.CreatedAt,
                Role = role != null ? new RoleDto
                {
                    Id = role.RoleId,
                    Name = role.Name,
                    Description = role.Description
                } : null,
                MembershipPlan = membershipPlan != null ? new MembershipPlanDto
                {
                    MembershipPlanId = membershipPlan.MembershipPlanId,
                    DisplayName = membershipPlan.DisplayName,
                    Description = membershipPlan.Description,
                    MonthlyPrice = membershipPlan.MonthlyPrice,
                    CoinsReward = membershipPlan.CoinsReward,
                    MaxCommunities = membershipPlan.MaxCommunities,
                    MaxVideosPerCommunity = membershipPlan.MaxVideosPerCommunity
                } : null
            };
        }
    }
}

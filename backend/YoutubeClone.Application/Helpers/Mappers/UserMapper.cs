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
                Role = RoleMapper.ToDto(role),
                MembershipPlan = MembershipPlanMapper.ToDto(membershipPlan),
                Coins = user.UserWallet?.Balance ?? 0
            };
        }
    }
}

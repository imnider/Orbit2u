using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class UserRepository(Orbit2uContext context) : GenericRepository<UserAccount>(context), IUserRepository

    {
        public async Task<bool> ClearRoles(List<UserAccountRole> roles)
        {
            context.UserAccountRoles.RemoveRange(roles);
            return true;
        }

        public async Task<UserAccount?> Get(Guid userId)
        {
            try
            {
                return await context.UserAccounts
                    .Include(user => user.UserAccountRoles)
                        .ThenInclude(userRoles => userRoles.Role)
                    .Include(user => user.UserMemberships)
                        .ThenInclude(membership => membership.MembershipPlan)
                    .Include(user => user.UserWallet)
                    .FirstOrDefaultAsync(x => x.UserId == userId && x.DeletedAt == null);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<UserAccount?> Get(string email)
        {
            try
            {
                return await context.UserAccounts
                    .Include(user => user.UserAccountRoles)
                        .ThenInclude(userRoles => userRoles.Role)
                    .Include(user => user.UserMemberships)
                        .ThenInclude(membership => membership.MembershipPlan)
                    .Include(user => user.UserWallet)
                    .FirstOrDefaultAsync(x => x.Email == email && x.DeletedAt == null);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public new IQueryable<UserAccount> Queryable()
        {
            try
            {
                return context.UserAccounts
                    .Include(u => u.UserAccountRoles)
                        .ThenInclude(r => r.Role)
                    .Include(u => u.UserMemberships)
                        .ThenInclude(m => m.MembershipPlan)
                    .Include(u => u.UserWallet);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<bool> HasCreated()
        {
            try
            {
                return await context.UserAccounts.AnyAsync();
            }
            catch
            {
                throw;
            }
        }
    }
}

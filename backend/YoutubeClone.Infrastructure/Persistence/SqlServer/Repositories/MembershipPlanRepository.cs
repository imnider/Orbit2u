using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class MembershipPlanRepository(Orbit2uContext context) : GenericRepository<MembershipPlan>(context), IMembershipPlanRepository
    {
        public async Task<MembershipPlan?> Get(int id)
        {
            return await context.MembershipPlans.FirstOrDefaultAsync(m => m.MembershipPlanId == id);
        }
    }
}

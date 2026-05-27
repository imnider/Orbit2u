using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface IMembershipPlanRepository : IGenericRepository<MembershipPlan>
    {
        Task<MembershipPlan?> Get(int id);
    }
}

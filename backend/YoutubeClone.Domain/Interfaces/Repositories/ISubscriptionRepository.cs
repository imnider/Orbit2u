using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface ISubscriptionRepository : IGenericRepository<Subscription>
    {
        Task<Subscription?> Get(Guid id);
    }
}

using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class SubscriptionRepository(Orbit2uContext context) : GenericRepository<Subscription>(context), ISubscriptionRepository
    {
        public async Task<Subscription?> Get(Guid subscriptionId)
        {
            try
            {
                return await context.Subscriptions
                    .FirstOrDefaultAsync(x => x.SubscriptionId == subscriptionId && x.DeletedAt == null);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

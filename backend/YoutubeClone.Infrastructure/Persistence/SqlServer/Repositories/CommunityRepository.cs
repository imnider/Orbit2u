using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class CommunityRepository(Orbit2uContext context) : GenericRepository<Community>(context), ICommunityRepository
    {
        public async Task<Community?> Get(Guid communityId)
        {
            try
            {
                return await context.Communities
                    .FirstOrDefaultAsync(x => x.CommunityId == communityId && x.DeletedAt == null);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class UserPreferenceTagRepository(Orbit2uContext context) : GenericRepository<UserPreferenceTag>(context), IUserPreferenceTagRepository
    {
        public async Task<UserPreferenceTag?> Get(Guid id)
        {
            try
            {
                return await context.UserPreferenceTags
                    .FirstOrDefaultAsync(x => x.UserPreferenceTagId == id);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

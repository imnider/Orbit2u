using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class TagRepository(Orbit2uContext context) : GenericRepository<Tag>(context), ITagRepository
    {
        public async Task<Tag?> Get(Guid tagId)
        {
            try
            {
                return await context.Tags
                    .FirstOrDefaultAsync(x => x.TagId == tagId);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

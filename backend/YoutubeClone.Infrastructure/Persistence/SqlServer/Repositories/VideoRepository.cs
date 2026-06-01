using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class VideoRepository(Orbit2uContext context) : GenericRepository<Video>(context), IVideoRepository
    {
        public async Task<Video?> Get(Guid videoId)
        {
            try
            {
                return await context.Videos
                    .Include(x => x.Tags)
                    .FirstOrDefaultAsync(x => x.VideoId == videoId && x.DeletedAt == null);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public new IQueryable<Video> Queryable()
        {
            try
            {
                return context.Videos.Include(x => x.Tags);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

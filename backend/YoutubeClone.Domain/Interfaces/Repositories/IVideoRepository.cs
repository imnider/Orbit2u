using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface IVideoRepository : IGenericRepository<Video>
    {
        public Task<Video?> Get(Guid videoId);
        public new IQueryable<Video> Queryable();
    }
}

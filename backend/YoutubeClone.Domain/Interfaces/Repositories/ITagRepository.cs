using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface ITagRepository : IGenericRepository<Tag>
    {
        public Task<Tag?> Get(Guid tagId);
    }
}

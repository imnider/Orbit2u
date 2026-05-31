using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface ICommunityRepository : IGenericRepository<Community>
    {
        public Task<Community?> Get(Guid communityId);
    }
}

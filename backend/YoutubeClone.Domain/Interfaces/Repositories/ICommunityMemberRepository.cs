using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface ICommunityMemberRepository : IGenericRepository<CommunityMember>
    {
        public Task<CommunityMember?> Get(Guid id);
    }
}

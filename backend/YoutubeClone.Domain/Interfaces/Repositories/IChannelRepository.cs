using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface IChannelRepository : IGenericRepository<Channel>
    {
        public Task<Channel?> Get(Guid channelId);
        public Task<Channel?> Get(UserAccount user);
    }
}

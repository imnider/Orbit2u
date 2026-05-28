using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class ChannelRepository(Orbit2uContext context) : GenericRepository<Channel>(context), IChannelRepository
    {
        public async Task<Channel?> Get(Guid channelId)
        {
            try
            {
                return await context.Channels
                    .FirstOrDefaultAsync(x => x.ChannelId == channelId && x.DeletedAt == null);
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Channel?> Get(UserAccount user)
        {
            try
            {
                return await context.Channels
                    .FirstOrDefaultAsync(x => x.UserId == user.UserId && x.DeletedAt == null);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

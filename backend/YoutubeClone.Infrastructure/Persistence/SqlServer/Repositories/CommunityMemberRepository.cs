using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class CommunityMemberRepository(Orbit2uContext context) : GenericRepository<CommunityMember>(context), ICommunityMemberRepository
    {
        public async Task<CommunityMember?> Get(Guid id)
        {
            try
            {
                return await context.CommunityMembers
                    .FirstOrDefaultAsync(x => x.CommunityMemberId == id);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}

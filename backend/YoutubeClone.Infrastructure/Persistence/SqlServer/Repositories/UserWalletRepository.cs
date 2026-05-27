using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class UserWalletRepository(Orbit2uContext context) : GenericRepository<UserWallet>(context), IUserWalletRepository
    {

    }
}

using Microsoft.EntityFrameworkCore;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer.Repositories
{
    public class CoinPackageRepository(Orbit2uContext context) : GenericRepository<CoinPackage>(context), ICoinPackageRepository
    {
        public async Task<CoinPackage?> Get(int id)
        {
            return await context.CoinPackages.FirstOrDefaultAsync(m => m.CoinPackageId == id);
        }
    }
}

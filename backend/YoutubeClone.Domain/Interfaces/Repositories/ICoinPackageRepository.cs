using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface ICoinPackageRepository : IGenericRepository<CoinPackage>
    {
        Task<CoinPackage?> Get(int id);
    }
}

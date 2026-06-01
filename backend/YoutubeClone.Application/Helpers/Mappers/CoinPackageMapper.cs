using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public static class CoinPackageMapper
    {
        public static CoinPackageDto ToDto(CoinPackage coinPackage)
        {
            return new CoinPackageDto
            {
                CoinPackageId = coinPackage.CoinPackageId,
                DisplayName = coinPackage.DisplayName,
                CoinAmount = coinPackage.CoinAmount,
                Price = coinPackage.Price,
            };
        }
    }
}

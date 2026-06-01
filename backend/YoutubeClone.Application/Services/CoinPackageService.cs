using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Helpers.Mappers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;

namespace YoutubeClone.Application.Services
{
    public class CoinPackageService(IUnitOfWork uow) : ICoinPackageService
    {
        public async Task<GenericResponse<List<CoinPackageDto>>> GetAll()
        {
            var coinPackages = uow.coinPackageRepository
                .Queryable()
                .OrderBy(x => x.Price)
                .Select(CoinPackageMapper.ToDto)
                .ToList();

            return ResponseHelper.Create(coinPackages);
        }

        public async Task<GenericResponse<CoinPackageDto>> GetById(int id)
        {
            var coinPackage = await GetCoinPackage(id);

            return ResponseHelper.Create(CoinPackageMapper.ToDto(coinPackage));
        }

        // Privados
        private async Task<CoinPackage> GetCoinPackage(int id)
        {
            return await uow.coinPackageRepository.Get(id)
                ?? throw new NotFoundException(ResponseConstants.PackageCoinNotFount(id));
        }
    }
}

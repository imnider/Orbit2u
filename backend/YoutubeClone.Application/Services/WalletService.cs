using Microsoft.EntityFrameworkCore;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.Requests.CoinPackage;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Helpers;

namespace YoutubeClone.Application.Services
{
    public class WalletService(IUnitOfWork uow) : IWalletService
    {
        public async Task<GenericResponse<bool>> AddCoins(Guid userId, AddCoinsRequest model)
        {
            var package = await uow.coinPackageRepository.Get(model.CoinPackageId)
                ?? throw new NotFoundException("Paquete de coins no encontrado");

            if (package.CoinAmount <= 0)
            {
                throw new BadRequestException("El paquete de coins no es válido");
            }

            var wallet = await uow.userWalletRepository
                .Queryable()
                .FirstOrDefaultAsync(x => x.UserId == userId)
                ?? throw new NotFoundException("Wallet no encontrada");

            wallet.Balance += package.CoinAmount;
            wallet.UpdatedAt = DateTimeHelper.UtcNow();

            await uow.userWalletRepository.Update(wallet);
            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }
    }
}

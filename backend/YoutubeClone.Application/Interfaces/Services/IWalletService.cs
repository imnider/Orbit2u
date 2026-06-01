using YoutubeClone.Application.Models.Requests.CoinPackage;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface IWalletService
    {
        public Task<GenericResponse<bool>> AddCoins(Guid userId, AddCoinsRequest model);
    }
}

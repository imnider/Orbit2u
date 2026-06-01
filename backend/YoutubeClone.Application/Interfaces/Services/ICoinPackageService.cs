using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface ICoinPackageService
    {
        public Task<GenericResponse<List<CoinPackageDto>>> GetAll();
        public Task<GenericResponse<CoinPackageDto>> GetById(int id);
    }
}

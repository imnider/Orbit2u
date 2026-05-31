using System.Security.Claims;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Videos;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface IVideoService
    {
        public Task<GenericResponse<VideoDto>> Create(CreateVideoRequest model, Claim claim);
        public Task<GenericResponse<List<VideoDto>>> GetAll(FilterVideoRequest model);
        public Task<GenericResponse<List<VideoDto>>> GetOfCurrentUser(Claim claim);
        public Task<GenericResponse<VideoDto>> GetById(Guid id);
        public Task<GenericResponse<VideoDto>> Update(Guid id, UpdateVideoRequest model, Claim claim);
        public Task<GenericResponse<bool>> Delete(Guid id, Claim claim);
    }
}

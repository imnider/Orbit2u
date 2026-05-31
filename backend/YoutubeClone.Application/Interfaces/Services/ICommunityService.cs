using System.Security.Claims;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Community;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface ICommunityService
    {
        public Task<GenericResponse<CommunityDto>> Create(CreateCommunityRequest model, Claim claim);
        public Task<GenericResponse<List<CommunityDto>>> GetAll(FilterCommunityRequest model);
        public Task<GenericResponse<CommunityDto>> GetById(Guid id);
        public Task<GenericResponse<List<CommunityDto>>> GetMyCommunities(Claim claim);
        public Task<GenericResponse<CommunityDto>> Update(Guid id, UpdateCommunityRequest model, Claim claim);
        public Task<GenericResponse<List<VideoDto>>> GetVideos(Guid communityId);
        public Task<GenericResponse<bool>> Delete(Guid id, Claim claim);
    }
}

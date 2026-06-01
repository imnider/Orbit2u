using System.Security.Claims;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface IUserPreferenceService
    {
        public Task<GenericResponse<bool>> AddTag(Guid tagId, Claim claim);
        public Task<GenericResponse<bool>> RemoveTag(Guid tagId, Claim claim);
        public Task<GenericResponse<UserPreferenceDto>> GetMyPreferences(Claim claim);
    }
}

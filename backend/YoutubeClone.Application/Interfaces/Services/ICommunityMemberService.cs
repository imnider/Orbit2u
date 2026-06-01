using System.Security.Claims;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface ICommunityMemberService
    {
        public Task<GenericResponse<bool>> Join(Guid communityId, Claim claim);
        public Task<GenericResponse<bool>> Leave(Guid communityId, Claim claim);
        public Task<GenericResponse<List<CommunityDto>>> GetMyMemberships(Claim claim);

    }
}

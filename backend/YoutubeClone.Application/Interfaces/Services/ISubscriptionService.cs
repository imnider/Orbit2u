using System.Security.Claims;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface ISubscriptionService
    {
        public Task<GenericResponse<bool>> Subscribe(Guid channelId, Claim claim);
        public Task<GenericResponse<bool>> Unsubscribe(Guid channelId, Claim claim);
        public Task<GenericResponse<List<ChannelDto>>> GetMySubscriptions(Claim claim);
    }
}

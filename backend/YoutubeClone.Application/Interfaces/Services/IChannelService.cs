using System.Security.Claims;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Channels;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface IChannelService
    {
        public Task<GenericResponse<ChannelDto>> Create(CreateChannelRequest model, Claim claim);
        public Task<GenericResponse<List<ChannelDto>>> GetAll(FilterChannelRequest model);
        public Task<GenericResponse<ChannelDto>> GetById(Guid id);
        public Task<GenericResponse<ChannelDto>> Update(UpdateChannerlRequest model, Claim claim);
        public Task<GenericResponse<bool>> Delete(Guid id);
    }
}

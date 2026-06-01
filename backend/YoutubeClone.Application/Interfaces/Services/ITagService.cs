using System.Security.Claims;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface ITagService
    {
        public Task<GenericResponse<bool>> AddTag(Guid videoId, Guid tagId, Claim claim);
        public Task<GenericResponse<bool>> RemoveTag(Guid videoId, Guid tagId, Claim claim);
        public Task<GenericResponse<List<TagDto>>> GetAll();

    }
}

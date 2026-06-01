using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;

namespace YoutubeClone.Application.Interfaces.Services
{
    public interface IMembershipPlanService
    {
        public Task<GenericResponse<List<MembershipPlanDto>>> GetAll();
        public Task<GenericResponse<MembershipPlanDto>> GetById(int id);
    }
}

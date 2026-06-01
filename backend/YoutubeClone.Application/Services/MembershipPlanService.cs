using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Helpers.Mappers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;

namespace YoutubeClone.Application.Services
{
    public class MembershipPlanService(IUnitOfWork uow) : IMembershipPlanService
    {
        public async Task<GenericResponse<List<MembershipPlanDto>>> GetAll()
        {
            var memberships = uow.membershipPlanRepository
                .Queryable()
                .Where(x => x.DeletedAt == null)
                .OrderBy(x => x.MonthlyPrice)
                .Select(MembershipPlanMapper.ToDto)
                .ToList();

            return ResponseHelper.Create(memberships);
        }

        public async Task<GenericResponse<MembershipPlanDto>> GetById(int id)
        {
            var membership = await GetMembership(id);

            return ResponseHelper.Create(MembershipPlanMapper.ToDto(membership));
        }

        // Privados
        private async Task<MembershipPlan> GetMembership(int id)
        {
            return await uow.membershipPlanRepository.Get(id)
                ?? throw new NotFoundException(ResponseConstants.MembershipNotFound(id));
        }
    }
}

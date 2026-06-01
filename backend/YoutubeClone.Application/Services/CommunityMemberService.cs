using System.Security.Claims;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Helpers.Mappers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;
using YoutubeClone.Shared.Helpers;

namespace YoutubeClone.Application.Services
{
    public class CommunityMemberService(IUnitOfWork uow, IUserService userService) : ICommunityMemberService
    {
        public async Task<GenericResponse<List<CommunityDto>>> GetMyMemberships(Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var communities = uow.communityMemberRepository
                .Queryable()
                .Where(x => x.UserId == executor.UserId)
                .Select(x => CommunityMapper.ToDto(x.Community, x.Community.CommunityMembers.Count()))
                .ToList();

            return ResponseHelper.Create(communities);
        }

        public async Task<GenericResponse<bool>> Join(Guid communityId, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var community = await uow.communityRepository.Get(communityId)
                ?? throw new NotFoundException(ResponseConstants.COMMUNITY_NOT_EXIST);

            if (community.OwnerUserId == executor.UserId)
            {
                throw new BadRequestException(
                    "El propietario ya pertenece a la comunidad.");
            }

            var exists = await uow.communityMemberRepository.IfExists(
                x => x.CommunityId == communityId &&
                     x.UserId == executor.UserId);

            if (exists)
            {
                throw new BadRequestException("Ya perteneces a esta comunidad.");
            }

            await uow.communityMemberRepository.Create(new CommunityMember
            {
                CommunityMemberId = Guid.NewGuid(),
                CommunityId = communityId,
                UserId = executor.UserId,
                JoinedAt = DateTimeHelper.UtcNow()
            });

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        public async Task<GenericResponse<bool>> Leave(Guid communityId, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var member = await uow.communityMemberRepository.Get(
                x => x.CommunityId == communityId &&
                     x.UserId == executor.UserId);

            if (member is null)
            {
                throw new BadRequestException("No perteneces a esta comunidad.");
            }

            await uow.communityMemberRepository.Delete(member);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        // PRIVADOS
        private async Task<Community> GetCommunity(Guid id)
        {
            return await uow.communityRepository.Get(id)
                ?? throw new NotFoundException(ResponseConstants.COMMUNITY_NOT_EXIST);
        }
    }
}

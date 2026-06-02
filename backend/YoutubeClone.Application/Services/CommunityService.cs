using System.Security.Claims;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Helpers.Mappers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Community;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;
using YoutubeClone.Shared.Helpers;

namespace YoutubeClone.Application.Services
{
    public class CommunityService(IUnitOfWork uow, IUserService userService) : ICommunityService
    {
        public async Task<GenericResponse<CommunityDto>> Create(CreateCommunityRequest model, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var user = await userService.GetById(executor.UserId);

            var communitiesCount = uow.communityRepository.Queryable()
                .Count(x => x.OwnerUserId == executor.UserId && x.DeletedAt == null);

            if (communitiesCount >= user.Data.MembershipPlan.MaxCommunities)
            {
                throw new BadRequestException("Has alcanzado el límite de comunidades de tu plan.");
            }

            var create = await uow.communityRepository.Create(new Community
            {
                CommunityId = Guid.NewGuid(),
                OwnerUserId = executor.UserId,
                Name = model.Name,
                Description = model.Description,
                AvatarUrl = model.AvatarUrl,
                BannerUrl = model.BannerUrl,
                IsPrivate = model.IsPrivate,
                CreatedAt = DateTimeHelper.UtcNow()
            });

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(CommunityMapper.ToDto(create), [], "Comunidad creada exitosamente.");
        }

        public async Task<GenericResponse<bool>> Delete(Guid id, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var community = await GetCommunity(id);

            var isAdmin = executor.UserAccountRoles
                .Any(x => x.Role.Name == RoleConstants.Administrador);

            var isOwner = community.OwnerUserId == executor.UserId;

            if (!isAdmin && !isOwner)
            {
                throw new ForbiddenException(ResponseConstants.COMMUNITY_WITHOUT_PERMISSIONS);
            }

            community.DeletedAt = DateTimeHelper.UtcNow();

            await uow.communityRepository.Update(community);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        public async Task<GenericResponse<List<CommunityDto>>> GetAll(FilterCommunityRequest model)
        {
            var queryable = uow.communityRepository.Queryable();

            queryable = queryable.Where(x => x.DeletedAt == null);

            if (!string.IsNullOrWhiteSpace(model.Name))
            {
                queryable = queryable.Where(x => x.Name.Contains(model.Name ?? ""));
            }

            var communities = queryable
                .AsQueryable()
                .Skip(model.Offset)
                .Take(model.Limit)
                .Select(community => CommunityMapper.ToDto(community, community.CommunityMembers.Count()))
                .ToList();

            return ResponseHelper.Create(communities);
        }

        public async Task<GenericResponse<CommunityDto>> GetById(Guid id)
        {
            var community = await GetCommunity(id);

            var memberCount = uow.communityMemberRepository
                .Queryable()
                .Count(x => x.CommunityId == id);

            return ResponseHelper.Create(CommunityMapper.ToDto(community, memberCount));
        }

        public async Task<GenericResponse<List<CommunityDto>>> GetMyCommunities(Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var communities = uow.communityRepository.Queryable()
                .Where(x => x.OwnerUserId == executor.UserId && x.DeletedAt == null)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => CommunityMapper.ToDto(x, x.CommunityMembers.Count()))
                .ToList();

            return ResponseHelper.Create(communities);
        }

        public async Task<GenericResponse<List<VideoDto>>> GetVideos(Guid communityId)
        {
            var community = await GetCommunity(communityId);

            var videos = uow.videoRepository.Queryable()
                .Where(x =>
                    x.CommunityId == communityId &&
                    x.DeletedAt == null)
                .OrderByDescending(x => x.PublishedAt)
                .Select(x => VideoMapper.ToDto(x))
                .ToList();

            return ResponseHelper.Create(videos);
        }

        public async Task<GenericResponse<CommunityDto>> Update(Guid id, UpdateCommunityRequest model, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var community = await GetCommunity(id);

            if (community.OwnerUserId != executor.UserId)
            {
                throw new ForbiddenException(ResponseConstants.COMMUNITY_WITHOUT_PERMISSIONS);
            }

            community.Name = model.Name ?? community.Name;
            community.Description = model.Description ?? community.Description;
            community.AvatarUrl = model.AvatarUrl ?? community.AvatarUrl;
            community.BannerUrl = model.BannerUrl ?? community.BannerUrl;

            if (model.IsPrivate.HasValue)
            {
                community.IsPrivate = model.IsPrivate.Value;
            }

            community.UpdatedAt = DateTimeHelper.UtcNow();

            await uow.communityRepository.Update(community);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(CommunityMapper.ToDto(community));
        }

        // PRIVADOS
        private async Task<Community> GetCommunity(Guid id)
        {
            return await uow.communityRepository.Get(id)
                ?? throw new NotFoundException(ResponseConstants.COMMUNITY_NOT_EXIST);
        }
    }
}

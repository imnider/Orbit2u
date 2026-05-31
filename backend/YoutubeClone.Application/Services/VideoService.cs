using System.Security.Claims;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Videos;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;
using YoutubeClone.Shared.Helpers;

namespace YoutubeClone.Application.Services
{
    public class VideoService(IUnitOfWork uow, IUserService userService) : IVideoService
    {
        public async Task<GenericResponse<VideoDto>> Create(CreateVideoRequest model, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);
            var channel = await uow.channelRepository.Get(executor)
                ?? throw new BadRequestException(ResponseConstants.VIDEO_NEED_CHANNEL);

            var create = await uow.videoRepository.Create(new Video
            {
                VideoId = Guid.NewGuid(),
                ChannelId = channel.ChannelId,
                CommunityId = model.CommunityId,
                VideoAccessibilityId = model.VideoAccessibilityId,
                Title = model.Title,
                Description = model.Description,
                DurationSeconds = model.DurationSeconds,
                ThumbnailUrl = model.ThumbnailUrl,
                VideoUrl = model.VideoUrl,
                AgeRestriction = model.AgeRestriction,
                PublishedAt = DateTimeHelper.UtcNow(),
                CreatedAt = DateTimeHelper.UtcNow(),
                UpdatedAt = null,
                DeletedAt = null
            });

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(Map(create), [], "Video creado exitosamente.");
        }

        public async Task<GenericResponse<bool>> Delete(Guid id, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var video = await GetVideo(id);

            var isAdmin = executor.UserAccountRoles
                .Any(x => x.Role.Name == RoleConstants.Administrador);

            var channel = await uow.channelRepository.Get(video.ChannelId)
                ?? throw new NotFoundException(ResponseConstants.CHANNEL_NOT_EXIST);

            var isOwner = channel.UserId == executor.UserId;

            if (!isAdmin && !isOwner)
            {
                throw new ForbiddenException(ResponseConstants.VIDEO_WITHOUT_PERMISSIONS);
            }

            video.DeletedAt = DateTimeHelper.UtcNow();

            await uow.videoRepository.Update(video);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        public async Task<GenericResponse<List<VideoDto>>> GetAll(FilterVideoRequest model)
        {
            var queryable = uow.videoRepository.Queryable();

            queryable = queryable.Where(x => x.DeletedAt == null);

            if (!string.IsNullOrWhiteSpace(model.Title))
            {
                queryable = queryable.Where(x => x.Title.Contains(model.Title ?? ""));
            }

            // Paginación y consulta
            var videos = queryable
                // includes de ser necesario
                .AsQueryable()
                .Skip(model.Offset)
                .Take(model.Limit)
                .Select(video => Map(video))
                .ToList();

            return ResponseHelper.Create(videos);
        }

        public async Task<GenericResponse<VideoDto>> GetById(Guid id)
        {
            var video = await GetVideo(id);
            return ResponseHelper.Create(Map(video));
        }

        public async Task<GenericResponse<List<VideoDto>>> GetOfChannel(Guid channelId)
        {
            var channel = await uow.channelRepository.Get(channelId)
                ?? throw new NotFoundException(ResponseConstants.CHANNEL_NOT_EXIST);

            var videos = uow.videoRepository.Queryable()
                .Where(x => x.ChannelId == channelId && x.DeletedAt == null)
                .Select(x => Map(x))
                .ToList();

            return ResponseHelper.Create(videos);
        }

        public async Task<GenericResponse<List<VideoDto>>> GetOfCurrentUser(Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var channel = await uow.channelRepository.Get(executor)
                ?? throw new BadRequestException(ResponseConstants.VIDEO_NEED_CHANNEL);

            var videos = uow.videoRepository.Queryable()
                .Where(x => x.ChannelId == channel.ChannelId && x.DeletedAt == null)
                .OrderByDescending(x => x.PublishedAt)
                .Select(x => Map(x))
                .ToList();

            return ResponseHelper.Create(videos);
        }

        public async Task<GenericResponse<VideoDto>> Update(Guid id, UpdateVideoRequest model, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var video = await uow.videoRepository.Get(id)
                ?? throw new NotFoundException(ResponseConstants.VIDEO_NOT_EXIST);

            var channel = await uow.channelRepository.Get(video.ChannelId)
            ?? throw new NotFoundException(ResponseConstants.CHANNEL_NOT_EXIST);

            if (channel.UserId != executor.UserId)
            {
                throw new ForbiddenException(ResponseConstants.VIDEO_WITHOUT_PERMISSIONS);
            }

            video.CommunityId = model.CommunityId ?? video.CommunityId;
            video.VideoAccessibilityId = model.VideoAccessibilityId ?? video.VideoAccessibilityId;
            video.Title = model.Title ?? video.Title;
            video.Description = model.Description ?? video.Description;
            video.ThumbnailUrl = model.ThumbnailUrl ?? video.ThumbnailUrl;
            video.AgeRestriction = model.AgeRestriction ?? video.AgeRestriction;

            video.UpdatedAt = DateTimeHelper.UtcNow();

            var update = await uow.videoRepository.Update(video);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(Map(video));
        }

        // PRIVADOS
        private static VideoDto Map(Video video)
        {
            return new VideoDto
            {
                VideoId = video.VideoId,
                ChannelId = video.ChannelId,
                CommunityId = video.CommunityId,
                VideoAccessibilityId = video.VideoAccessibilityId,
                Title = video.Title,
                Description = video.Description,
                DurationSeconds = video.DurationSeconds,
                ThumbnailUrl = video.ThumbnailUrl,
                VideoUrl = video.VideoUrl,
                AgeRestriction = video.AgeRestriction,
                IsPinned = video.IsPinned,
                PublishedAt = video.PublishedAt,
                CreatedAt = video.CreatedAt,
                UpdatedAt = video.UpdatedAt,
                DeletedAt = video.DeletedAt,
            };
        }

        private async Task<Video> GetVideo(Guid id)
        {
            return await uow.videoRepository.Get(id)
                ?? throw new NotFoundException(ResponseConstants.VIDEO_NOT_EXIST);
        }
    }
}

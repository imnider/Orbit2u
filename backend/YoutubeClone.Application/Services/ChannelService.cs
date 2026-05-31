using System.Security.Claims;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Helpers.Mappers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Channels;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Entities;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;
using YoutubeClone.Shared.Helpers;

namespace YoutubeClone.Application.Services
{
    public class ChannelService(IUnitOfWork uow, IUserService userService) : IChannelService
    {
        public async Task<GenericResponse<ChannelDto>> Create(CreateChannelRequest model, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);
            var create = await uow.channelRepository.Create(new Channel
            {
                ChannelId = Guid.NewGuid(),
                UserId = executor.UserId,
                Handle = model.Handle,
                DisplayName = model.DisplayName,
                Verification = false,
                Description = model.Description,
                AvatarUrl = model.AvatarUrl,
                BannerUrl = model.BannerUrl,
                CreatedAt = DateTimeHelper.UtcNow(),
                UpdatedAt = null,
                DeletedAt = null
            });

            var creatorRole = await uow.roleRepository.Get(x => x.Name == RoleConstants.CreadorContenido)
                ?? throw new NotFoundException("No existe el rol de creador de contenido.");

            var currentRole = executor.UserAccountRoles.FirstOrDefault()?.Role;

            if (currentRole?.Name == RoleConstants.Usuario)
            {
                await uow.userRepository.ClearRoles([.. executor.UserAccountRoles]);

                executor.UserAccountRoles.Add(new UserAccountRole
                {
                    RoleId = creatorRole.RoleId,
                    AssignedBy = executor.UserId,
                    AssignedAt = DateTimeHelper.UtcNow()
                });
            }

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(ChannelMapper.ToDto(create), [], "Canal creado exitosamente.");
        }

        public async Task<GenericResponse<bool>> Delete(Guid id)
        {
            var channel = await GetChannel(id);

            channel.DeletedAt = DateTimeHelper.UtcNow();

            await uow.channelRepository.Update(channel);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        public async Task<GenericResponse<List<ChannelDto>>> GetAll(FilterChannelRequest model)
        {
            var queryable = uow.channelRepository.Queryable();

            queryable = queryable.Where(x => x.DeletedAt == null);

            if (!string.IsNullOrWhiteSpace(model.DisplayName))
            {
                queryable = queryable.Where(x => x.DisplayName.Contains(model.DisplayName ?? ""));
            }

            // Paginación y consulta
            var channels = queryable
                // includes de ser necesario
                .AsQueryable()
                .Skip(model.Offset)
                .Take(model.Limit)
                .Select(channel => ChannelMapper.ToDto(channel, channel.Subscriptions.Count(s => s.DeletedAt == null)))
                .ToList();

            return ResponseHelper.Create(channels);
        }

        public async Task<GenericResponse<ChannelDto>> GetById(Guid id)
        {
            var channel = await GetChannel(id);

            var subscriberCount = uow.subscriptionRepository.Queryable()
                .Count(x => x.ChannelId == id && x.DeletedAt == null);

            return ResponseHelper.Create(ChannelMapper.ToDto(channel, subscriberCount));
        }

        public async Task<GenericResponse<ChannelDto>> Update(UpdateChannerlRequest model, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);
            var channel = await uow.channelRepository.Get(executor);

            channel.Handle = model.Handle ?? channel.Handle;
            channel.DisplayName = model.DisplayName ?? channel.DisplayName;
            channel.Description = model.Description ?? channel.Description;
            channel.AvatarUrl = model.AvatarUrl ?? channel.AvatarUrl;
            channel.BannerUrl = model.BannerUrl ?? channel.BannerUrl;

            channel.UpdatedAt = DateTimeHelper.UtcNow();

            var update = await uow.channelRepository.Update(channel);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(ChannelMapper.ToDto(channel));
        }

        public async Task<GenericResponse<ChannelDto>> GetMyChannel(Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var channel = await uow.channelRepository.Get(executor)
                ?? throw new NotFoundException(ResponseConstants.CHANNEL_NOT_EXIST);

            var subscriberCount = uow.subscriptionRepository.Queryable()
                .Count(x => x.ChannelId == channel.ChannelId && x.DeletedAt == null);

            return ResponseHelper.Create(ChannelMapper.ToDto(channel, subscriberCount));
        }

        public async Task<GenericResponse<List<VideoDto>>> GetVideos(Guid channelId)
        {
            var channel = await GetChannel(channelId);

            var videos = uow.videoRepository.Queryable()
                .Where(x =>
                    x.ChannelId == channelId &&
                    x.DeletedAt == null)
                .OrderByDescending(x => x.PublishedAt)
                .Select(VideoMapper.ToDto)
                .ToList();

            return ResponseHelper.Create(videos);
        }

        // PRIVADOS
        private async Task<Channel> GetChannel(Guid id)
        {
            return await uow.channelRepository.Get(id)
                ?? throw new NotFoundException(ResponseConstants.CHANNEL_NOT_EXIST);
        }
    }
}

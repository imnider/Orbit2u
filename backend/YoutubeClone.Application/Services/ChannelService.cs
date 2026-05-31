using System.Security.Claims;
using YoutubeClone.Application.Helpers;
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

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(Map(create), [], "Canal creado exitosamente.");
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
                .Select(channel => Map(channel))
                .ToList();

            return ResponseHelper.Create(channels);
        }

        public async Task<GenericResponse<ChannelDto>> GetById(Guid id)
        {
            var channel = await GetChannel(id);
            return ResponseHelper.Create(Map(channel));
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

            return ResponseHelper.Create(Map(channel));
        }

        public async Task<GenericResponse<ChannelDto>> GetMyChannel(Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var channel = await uow.channelRepository.Get(executor)
                ?? throw new NotFoundException(ResponseConstants.CHANNEL_NOT_EXIST);

            return ResponseHelper.Create(Map(channel));
        }

        // PRIVADOS
        private static ChannelDto Map(Channel channel)
        {
            return new ChannelDto
            {
                ChannelId = channel.ChannelId,
                UserId = channel.ChannelId,
                Handle = channel.Handle,
                DisplayName = channel.DisplayName,
                Verification = channel.Verification,
                Description = channel.Description,
                AvatarURL = channel.AvatarUrl,
                BannerURL = channel.BannerUrl,
                CreatedAt = channel.CreatedAt,
                UpdatedAt = channel.UpdatedAt,
                DeletedAt = channel.DeletedAt,
            };
        }

        private async Task<Channel> GetChannel(Guid id)
        {
            return await uow.channelRepository.Get(id)
                ?? throw new NotFoundException(ResponseConstants.CHANNEL_NOT_EXIST);
        }
    }
}

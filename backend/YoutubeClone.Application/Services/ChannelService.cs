using System.Security.Claims;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Requests.Channels;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Entities;
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

        public Task<GenericResponse<bool>> Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<GenericResponse<List<ChannelDto>>> GetAll(FilterChannelRequest model)
        {
            throw new NotImplementedException();
        }

        public Task<GenericResponse<ChannelDto>> GetById(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<GenericResponse<ChannelDto>> Update(Guid id, UpdateChannerlRequest model)
        {
            throw new NotImplementedException();
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
    }
}

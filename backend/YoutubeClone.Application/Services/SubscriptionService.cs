using Microsoft.EntityFrameworkCore;
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
    public class SubscriptionService(IUnitOfWork uow, IUserService userService) : ISubscriptionService
    {
        public async Task<GenericResponse<List<ChannelDto>>> GetMySubscriptions(Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var channels = uow.subscriptionRepository.Queryable()
                .Where(x => x.UserId == executor.UserId && x.DeletedAt == null)
                .Select(x => x.Channel)
                .ToList()
                .Select(ChannelMapper.ToDto)
                .ToList();

            return ResponseHelper.Create(channels);
        }

        public async Task<GenericResponse<bool>> Subscribe(Guid channelId, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var channel = await uow.channelRepository.Get(channelId)
                ?? throw new NotFoundException(ResponseConstants.CHANNEL_NOT_EXIST);

            if (channel.UserId == executor.UserId)
            {
                throw new BadRequestException("No puedes suscribirte a tu propio canal.");
            }

            var subscription = await uow.subscriptionRepository.Queryable()
                 .FirstOrDefaultAsync(x =>
                     x.UserId == executor.UserId &&
                     x.ChannelId == channelId);

            if (subscription is null)
            {
                await uow.subscriptionRepository.Create(new Subscription
                {
                    SubscriptionId = Guid.NewGuid(),
                    UserId = executor.UserId,
                    ChannelId = channelId,
                    CreatedAt = DateTimeHelper.UtcNow(),
                    DeletedAt = null
                });
            }
            else
            {
                if (subscription.DeletedAt != null)
                {
                    subscription.DeletedAt = null; // reactivar
                    await uow.subscriptionRepository.Update(subscription);
                }
                else
                {
                    throw new BadRequestException("Ya estás suscrito a este canal.");
                }
            }

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true, [], "Suscripción creada");
        }

        public async Task<GenericResponse<bool>> Unsubscribe(Guid channelId, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var subscription = await uow.subscriptionRepository.Queryable()
                .FirstOrDefaultAsync(x =>
                    x.UserId == executor.UserId &&
                    x.ChannelId == channelId &&
                    x.DeletedAt == null)
                ?? throw new NotFoundException("No estás suscrito a este canal.");

            subscription.DeletedAt = DateTimeHelper.UtcNow();

            await uow.subscriptionRepository.Update(subscription);
            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true, message: "Suscripción eliminada");
        }
    }
}

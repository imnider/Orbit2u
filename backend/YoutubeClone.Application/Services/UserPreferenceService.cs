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

namespace YoutubeClone.Application.Services
{
    public class UserPreferenceService(IUnitOfWork uow, IUserService userService) : IUserPreferenceService
    {
        public async Task<GenericResponse<bool>> AddTag(Guid tagId, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var preference = await uow.userPreferenceRepository.Get(x => x.UserId == executor.UserId)
                ?? throw new NotFoundException("Preferencias no encontradas.");

            var tag = await uow.tagRepository.Get(tagId)
                ?? throw new NotFoundException("Tag no encontrado.");

            var exists = await uow.userPreferenceTagRepository
                .Queryable()
                .AnyAsync(x => x.UserPreferenceId == preference.UserPreferenceId && x.TagId == tagId);

            if (exists)
            {
                throw new BadRequestException("El tag ya fue agregado.");
            }

            await uow.userPreferenceTagRepository.Create(
                new UserPreferenceTag
                {
                    UserPreferenceTagId = Guid.NewGuid(),
                    UserPreferenceId = preference.UserPreferenceId,
                    TagId = tagId
                });

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        public async Task<GenericResponse<bool>> RemoveTag(Guid tagId, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var preference = await uow.userPreferenceRepository.Get(x => x.UserId == executor.UserId)
                ?? throw new NotFoundException("Preferencias no encontradas.");

            var relation = await uow.userPreferenceTagRepository
                .Queryable()
                .FirstOrDefaultAsync(x =>
                    x.UserPreferenceId == preference.UserPreferenceId &&
                    x.TagId == tagId);

            if (relation is null)
            {
                throw new NotFoundException("El tag no está agregado.");
            }

            await uow.userPreferenceTagRepository.Delete(relation);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        public async Task<GenericResponse<UserPreferenceDto>> GetMyPreferences(Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var preference = await uow.userPreferenceRepository
                .Queryable()
                .Include(x => x.UserPreferenceTags)
                    .ThenInclude(x => x.Tag)
                .FirstOrDefaultAsync(x => x.UserId == executor.UserId)
                ?? throw new NotFoundException("Preferencias no encontradas.");

            return ResponseHelper.Create(UserPreferenceMapper.ToDto(preference));
        }
    }
}

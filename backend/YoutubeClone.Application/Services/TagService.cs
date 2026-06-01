using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Helpers.Mappers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Exceptions;
using YoutubeClone.Shared.Constants;

namespace YoutubeClone.Application.Services
{
    public class TagService(IUnitOfWork uow, IUserService userService) : ITagService
    {
        public async Task<GenericResponse<bool>> AddTag(Guid videoId, Guid tagId, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var video = await uow.videoRepository
                .Queryable()
                .Include(x => x.Tags)
                .Include(x => x.Channel)
                .FirstOrDefaultAsync(x => x.VideoId == videoId)
                ?? throw new NotFoundException(ResponseConstants.VIDEO_NOT_EXIST);

            if (video.Channel.UserId != executor.UserId)
            {
                throw new ForbiddenException("No puedes modificar este video.");
            }

            var tag = await uow.tagRepository.Get(tagId)
                ?? throw new NotFoundException("El tag no existe.");

            if (video.Tags.Any(x => x.TagId == tagId))
            {
                throw new BadRequestException("El tag ya fue agregado al video.");
            }

            video.Tags.Add(tag);

            await uow.videoRepository.Update(video);
            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        public async Task<GenericResponse<bool>> RemoveTag(Guid videoId, Guid tagId, Claim claim)
        {
            var executor = await userService.GetExecutor(claim.Value);

            var video = await uow.videoRepository
                .Queryable()
                .Include(x => x.Tags)
                .Include(x => x.Channel)
                .FirstOrDefaultAsync(x => x.VideoId == videoId)
                ?? throw new NotFoundException(ResponseConstants.VIDEO_NOT_EXIST);

            if (video.Channel.UserId != executor.UserId)
            {
                throw new ForbiddenException("No puedes modificar este video.");
            }

            var tag = video.Tags
                .FirstOrDefault(x => x.TagId == tagId)
                ?? throw new NotFoundException("El video no tiene este tag.");

            video.Tags.Remove(tag);

            await uow.videoRepository.Update(video);
            await uow.SaveChangesAsync();

            return ResponseHelper.Create(true);
        }

        public async Task<GenericResponse<List<TagDto>>> GetAll()
        {
            var tags = uow.tagRepository
                .Queryable()
                .OrderBy(x => x.DisplayName)
                .Select(TagMapper.ToDto)
                .ToList();

            return ResponseHelper.Create(tags);
        }
    }
}

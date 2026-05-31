using Microsoft.Extensions.Configuration;
using YoutubeClone.Application.Helpers;
using YoutubeClone.Application.Helpers.Mappers;
using YoutubeClone.Application.Interfaces.Services;
using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Application.Models.Responses;
using YoutubeClone.Domain.Database;
using YoutubeClone.Shared.Constants;

namespace YoutubeClone.Application.Services
{
    public class AppService(IConfiguration configuration, IUnitOfWork uow) : IAppService
    {
        public async Task<GenericResponse<AppInfoDto>> Info()
        {
            return ResponseHelper.Create(new AppInfoDto
            {
                Version = configuration[ConfigurationConstants.VERSION] ?? "0.0.0",
                Roles = [.. uow.roleRepository.Queryable().Where(x => x.IsActive).ToList().Select(r => RoleMapper.ToDto(r))]
            });
        }
    }
}

using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public static class RoleMapper
    {
        public static RoleDto ToDto(Role role)
        {
            return new RoleDto
            {
                Id = role.RoleId,
                Name = role.Name,
                Description = role.Description,
            };
        }
    }
}

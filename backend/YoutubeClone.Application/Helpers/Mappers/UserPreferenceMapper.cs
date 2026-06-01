using YoutubeClone.Application.Models.DTOs;
using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Application.Helpers.Mappers
{
    public static class UserPreferenceMapper
    {
        public static UserPreferenceDto ToDto(UserPreference preference)
        {
            return new UserPreferenceDto
            {
                UserPreferenceId = preference.UserPreferenceId,
                ThemeName = preference.ThemeName,

                Tags = preference.UserPreferenceTags
                    .Select(x => TagMapper.ToDto(x.Tag))
                    .ToList()
            };
        }
    }
}

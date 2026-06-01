using YoutubeClone.Domain.Database.SqlServer.Entities;

namespace YoutubeClone.Domain.Interfaces.Repositories
{
    public interface IUserPreferenceTagRepository : IGenericRepository<UserPreferenceTag>
    {
        public Task<UserPreferenceTag?> Get(Guid id);
    }
}

using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Domain.Database
{
    public interface IUnitOfWork
    {
        IUserRepository userRepository { get; set; }
        IEmailTemplateRepository emailTemplateRepository { get; set; }
        IRoleRepository roleRepository { get; set; }
        IUserWalletRepository userWalletRepository { get; set; }
        IMembershipPlanRepository membershipPlanRepository { get; set; }
        IUserPreferenceRepository userPreferenceRepository { get; set; }
        Task SaveChangesAsync();
    }
}

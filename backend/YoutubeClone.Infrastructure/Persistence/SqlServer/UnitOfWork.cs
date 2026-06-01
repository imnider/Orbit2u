using YoutubeClone.Domain.Database;
using YoutubeClone.Domain.Database.SqlServer.Context;
using YoutubeClone.Domain.Interfaces.Repositories;

namespace YoutubeClone.Infrastructure.Persistence.SqlServer
{
    public class UnitOfWork(Orbit2uContext _context,
        IUserRepository _userRepository,
        IEmailTemplateRepository _emailTemplateRepository,
        IRoleRepository _roleRepository,
        IUserWalletRepository _userWalletRepository,
        IMembershipPlanRepository _membershipPlanRepository,
        IUserPreferenceRepository _userPreferenceRepository,
        IChannelRepository _channelRepository,
        IVideoRepository _videoRepository,
        ICommunityRepository _communityRepository,
        ISubscriptionRepository _subscriptionRepository,
        ICommunityMemberRepository _communityMemberRepository)
        : IUnitOfWork
    {
        private readonly Orbit2uContext context = _context;
        public IUserRepository userRepository { get; set; } = _userRepository;
        public IEmailTemplateRepository emailTemplateRepository { get; set; } = _emailTemplateRepository;
        public IRoleRepository roleRepository { get; set; } = _roleRepository;
        public IUserWalletRepository userWalletRepository { get; set; } = _userWalletRepository;
        public IMembershipPlanRepository membershipPlanRepository { get; set; } = _membershipPlanRepository;
        public IUserPreferenceRepository userPreferenceRepository { get; set; } = _userPreferenceRepository;
        public IChannelRepository channelRepository { get; set; } = _channelRepository;
        public IVideoRepository videoRepository { get; set; } = _videoRepository;
        public ICommunityRepository communityRepository { get; set; } = _communityRepository;
        public ISubscriptionRepository subscriptionRepository { get; set; } = _subscriptionRepository;
        public ICommunityMemberRepository communityMemberRepository { get; set; } = _communityMemberRepository;

        public async Task SaveChangesAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}
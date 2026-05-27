using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class UserAccount
{
    public Guid UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string DisplayName { get; set; } = null!;

    public DateTime Birthday { get; set; }

    public string Location { get; set; } = null!;

    public string Password { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<Channel> Channels { get; set; } = new List<Channel>();

    public virtual ICollection<CoinPurchaseRequest> CoinPurchaseRequests { get; set; } = new List<CoinPurchaseRequest>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Community> Communities { get; set; } = new List<Community>();

    public virtual ICollection<CommunityMember> CommunityMembers { get; set; } = new List<CommunityMember>();

    public virtual ICollection<PlaylistContributor> PlaylistContributors { get; set; } = new List<PlaylistContributor>();

    public virtual ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    public virtual ICollection<UserAccountRole> UserAccountRoles { get; set; } = new List<UserAccountRole>();

    public virtual ICollection<UserMembership> UserMemberships { get; set; } = new List<UserMembership>();

    public virtual UserPreference? UserPreference { get; set; }

    public virtual UserWallet? UserWallet { get; set; }

    public virtual ICollection<VideoReaction> VideoReactions { get; set; } = new List<VideoReaction>();

    public virtual ICollection<ViewHistory> ViewHistories { get; set; } = new List<ViewHistory>();
}

using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class Community
{
    public Guid CommunityId { get; set; }

    public Guid OwnerUserId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? AvatarUrl { get; set; }

    public string? BannerUrl { get; set; }

    public bool IsPrivate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<CommunityMember> CommunityMembers { get; set; } = new List<CommunityMember>();

    public virtual UserAccount OwnerUser { get; set; } = null!;

    public virtual ICollection<Video> Videos { get; set; } = new List<Video>();
}

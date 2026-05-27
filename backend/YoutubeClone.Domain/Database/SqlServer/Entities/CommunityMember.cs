using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class CommunityMember
{
    public Guid CommunityMemberId { get; set; }

    public Guid CommunityId { get; set; }

    public Guid UserId { get; set; }

    public bool IsModerator { get; set; }

    public DateTime JoinedAt { get; set; }

    public virtual Community Community { get; set; } = null!;

    public virtual UserAccount User { get; set; } = null!;
}

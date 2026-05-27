using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class MembershipPlan
{
    public int MembershipPlanId { get; set; }

    public string DisplayName { get; set; } = null!;

    public string? Description { get; set; }

    public decimal MonthlyPrice { get; set; }

    public int CoinsReward { get; set; }

    public int MaxCommunities { get; set; }

    public int MaxVideosPerCommunity { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<UserMembership> UserMemberships { get; set; } = new List<UserMembership>();
}

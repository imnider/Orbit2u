using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class UserMembership
{
    public Guid UserMembershipId { get; set; }

    public Guid UserId { get; set; }

    public int MembershipPlanId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual MembershipPlan MembershipPlan { get; set; } = null!;

    public virtual UserAccount User { get; set; } = null!;
}

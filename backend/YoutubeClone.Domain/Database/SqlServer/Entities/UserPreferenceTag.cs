using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class UserPreferenceTag
{
    public Guid UserPreferenceTagId { get; set; }

    public Guid UserPreferenceId { get; set; }

    public Guid TagId { get; set; }

    public virtual Tag Tag { get; set; } = null!;

    public virtual UserPreference UserPreference { get; set; } = null!;
}

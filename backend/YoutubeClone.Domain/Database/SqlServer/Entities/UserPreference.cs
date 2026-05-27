using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class UserPreference
{
    public Guid UserPreferenceId { get; set; }

    public Guid UserId { get; set; }

    public string ThemeName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual UserAccount User { get; set; } = null!;

    public virtual ICollection<UserPreferenceTag> UserPreferenceTags { get; set; } = new List<UserPreferenceTag>();
}

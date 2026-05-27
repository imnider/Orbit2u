using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class Tag
{
    public Guid TagId { get; set; }

    public string DisplayName { get; set; } = null!;

    public virtual ICollection<UserPreferenceTag> UserPreferenceTags { get; set; } = new List<UserPreferenceTag>();

    public virtual ICollection<Video> Videos { get; set; } = new List<Video>();
}

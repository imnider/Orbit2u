using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class PlaylistContributor
{
    public Guid PlaylistId { get; set; }

    public Guid UserId { get; set; }

    public DateTime AddedAt { get; set; }

    public virtual Playlist Playlist { get; set; } = null!;

    public virtual UserAccount User { get; set; } = null!;
}

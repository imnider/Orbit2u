using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class UserWallet
{
    public Guid UserWalletId { get; set; }

    public Guid UserId { get; set; }

    public int Balance { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual UserAccount User { get; set; } = null!;

    public virtual ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();
}

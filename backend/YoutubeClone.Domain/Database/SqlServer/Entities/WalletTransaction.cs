using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class WalletTransaction
{
    public Guid WalletTransactionId { get; set; }

    public Guid UserWalletId { get; set; }

    public int Amount { get; set; }

    public string TransactionType { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual UserWallet UserWallet { get; set; } = null!;
}

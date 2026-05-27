using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class CoinPurchaseRequest
{
    public Guid CoinPurchaseRequestId { get; set; }

    public Guid UserId { get; set; }

    public int CoinPackageId { get; set; }

    public string BankReference { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime RequestedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public virtual CoinPackage CoinPackage { get; set; } = null!;

    public virtual UserAccount User { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace YoutubeClone.Domain.Database.SqlServer.Entities;

public partial class CoinPackage
{
    public int CoinPackageId { get; set; }

    public string DisplayName { get; set; } = null!;

    public int CoinAmount { get; set; }

    public decimal Price { get; set; }

    public virtual ICollection<CoinPurchaseRequest> CoinPurchaseRequests { get; set; } = new List<CoinPurchaseRequest>();
}

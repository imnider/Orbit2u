namespace YoutubeClone.Application.Models.DTOs
{
    public class CoinPackageDto
    {
        public int CoinPackageId { get; set; }
        public string DisplayName { get; set; } = null!;
        public int CoinAmount { get; set; }
        public decimal Price { get; set; }
    }
}

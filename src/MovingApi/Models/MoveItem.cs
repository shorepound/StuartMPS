namespace MovingApi.Models;

public class MoveItem
{
    public int MoveItemId { get; set; }
    public int MoveId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public decimal? Volume { get; set; }
    public decimal? WeightKg { get; set; }
    public string? Notes { get; set; }
}

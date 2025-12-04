namespace MovingApi.Models;

public class PackedItem
{
    public int PackedItemId { get; set; }
    public int BoxId { get; set; }
    public int? MoveItemId { get; set; }
    public string? Description { get; set; }
    public int Quantity { get; set; } = 1;
}

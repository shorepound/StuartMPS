namespace MovingApi.Models;

public class StoredItem
{
    public int StoredItemId { get; set; }
    public int? MoveItemId { get; set; }
    public int StorageLocationId { get; set; }
    public DateTime? StoredFrom { get; set; }
    public DateTime? StoredUntil { get; set; }
    public string? Notes { get; set; }
}

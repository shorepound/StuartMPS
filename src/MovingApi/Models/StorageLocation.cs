namespace MovingApi.Models;

public class StorageLocation
{
    public int StorageLocationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? AddressId { get; set; }
    public string? CapacityNotes { get; set; }
}

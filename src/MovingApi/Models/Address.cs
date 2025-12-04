namespace MovingApi.Models;

public class Address
{
    public int AddressId { get; set; }
    public int CustomerId { get; set; }
    public string Line1 { get; set; } = string.Empty;
    public string? Line2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
}

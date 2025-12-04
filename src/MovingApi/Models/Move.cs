using System.ComponentModel.DataAnnotations.Schema;

namespace MovingApi.Models;

public class Move
{
    public int MoveId { get; set; }
    public int CustomerId { get; set; }
    public int OriginAddressId { get; set; }
    public int DestinationAddressId { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public string? Status { get; set; }
}


using System.ComponentModel.DataAnnotations;

namespace MovingApi.Models;

public class PackingBox
{
    [Key]
    public int BoxId { get; set; }
    public int MoveId { get; set; }
    public string? Label { get; set; }
    public decimal? LengthCm { get; set; }
    public decimal? WidthCm { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? MaxWeightKg { get; set; }
}

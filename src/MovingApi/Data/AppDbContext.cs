using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MovingApi.Models;

namespace MovingApi.Data;

public class AppDbContext : IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Move> Moves => Set<Move>();
    public DbSet<MoveItem> MoveItems => Set<MoveItem>();
    public DbSet<PackingBox> PackingBoxes => Set<PackingBox>();
    public DbSet<PackedItem> PackedItems => Set<PackedItem>();
    public DbSet<StorageLocation> StorageLocations => Set<StorageLocation>();
    public DbSet<StoredItem> StoredItems => Set<StoredItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Customer>().ToTable("Customers");
        modelBuilder.Entity<Address>().ToTable("Addresses");
        modelBuilder.Entity<Move>().ToTable("Moves");
        modelBuilder.Entity<MoveItem>().ToTable("MoveItems");
        modelBuilder.Entity<PackingBox>().ToTable("PackingBoxes");
        modelBuilder.Entity<PackedItem>().ToTable("PackedItems");
        modelBuilder.Entity<StorageLocation>().ToTable("StorageLocations");
        modelBuilder.Entity<StoredItem>().ToTable("StoredItems");

        // Decimal precision mappings to avoid silent truncation on SQL Server
        modelBuilder.Entity<MoveItem>(b =>
        {
            b.Property(p => p.Volume).HasPrecision(18, 3);
            b.Property(p => p.WeightKg).HasPrecision(10, 2);
        });

        modelBuilder.Entity<PackingBox>(b =>
        {
            b.Property(p => p.LengthCm).HasPrecision(10, 2);
            b.Property(p => p.WidthCm).HasPrecision(10, 2);
            b.Property(p => p.HeightCm).HasPrecision(10, 2);
            b.Property(p => p.MaxWeightKg).HasPrecision(10, 2);
        });
    }
}

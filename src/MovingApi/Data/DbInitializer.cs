using System.Linq;
using MovingApi.Models;

namespace MovingApi.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // Do NOT call EnsureCreated here — migrations will handle schema creation.
        // Seed data only if the Customers table exists and is empty.
        try
        {
            if (!context.Database.CanConnect())
                return;
        }
        catch
        {
            return;
        }

        if (context.Customers.Any())
            return; // DB has been seeded

        var customers = new[]
        {
            new Customer { FirstName = "Alice", LastName = "Smith", Email = "alice@example.com", Phone = "555-0100" },
            new Customer { FirstName = "Bob", LastName = "Jones", Email = "bob@example.com", Phone = "555-0111" },
            new Customer { FirstName = "Charlie", LastName = "Brown", Email = "charlie@example.com", Phone = "555-0122" }
        };

        context.Customers.AddRange(customers);
        context.SaveChanges();
    }
}

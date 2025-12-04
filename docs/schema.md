# Moving, Packing & Storage - Schema Overview

This document describes the main entities for the sample Moving app and their relationships.

Entities
- `Customers` — individuals or companies requesting moves.
- `Addresses` — street addresses related to customers (origin/destination/storage).
- `Moves` — a planned move, referencing a customer and origin/destination addresses.
- `MoveItems` — inventory items associated with a `Move`.
- `PackingBoxes` — physical boxes created for a `Move`.
- `PackedItems` — items placed into `PackingBoxes`.
- `StorageLocations` — places where items can be stored (warehouses, units).
- `StoredItems` — association of an item stored at a `StorageLocation`.

Relationships
- `Customers` 1..* `Moves` (customer can have many moves)
- `Moves` 1..* `MoveItems`
- `MoveItems` 0..* `PackedItems` (items may or may not be packed)
- `PackingBoxes` 1..* `PackedItems`
- `StorageLocations` 1..* `StoredItems`

Notes / Extensibility
- Add `Users` and `Roles` tables if you want authentication and authorization.
- Consider `MoveSegments` or `Shipments` for multi-leg moves.
- Add `InventoryCategories` to classify items (fragile, furniture, electronics).
- Add `Audit` tables or `CreatedBy/UpdatedBy` columns to track changes.

See `db/schema.sql` for the full DDL.

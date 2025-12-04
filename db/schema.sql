-- Schema for Moving, Packing, and Storage sample application
-- Database: MovingDb

CREATE TABLE Customers (
    CustomerId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255),
    Phone NVARCHAR(50),
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE Addresses (
    AddressId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId INT NOT NULL FOREIGN KEY REFERENCES Customers(CustomerId),
    Line1 NVARCHAR(255) NOT NULL,
    Line2 NVARCHAR(255),
    City NVARCHAR(100) NOT NULL,
    State NVARCHAR(100),
    PostalCode NVARCHAR(50),
    Country NVARCHAR(100) DEFAULT 'USA'
);

CREATE TABLE Moves (
    MoveId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId INT NOT NULL FOREIGN KEY REFERENCES Customers(CustomerId),
    OriginAddressId INT NOT NULL FOREIGN KEY REFERENCES Addresses(AddressId),
    DestinationAddressId INT NOT NULL FOREIGN KEY REFERENCES Addresses(AddressId),
    ScheduledDate DATE,
    Status NVARCHAR(50) DEFAULT 'Planned',
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE MoveItems (
    MoveItemId INT IDENTITY(1,1) PRIMARY KEY,
    MoveId INT NOT NULL FOREIGN KEY REFERENCES Moves(MoveId) ON DELETE CASCADE,
    Name NVARCHAR(255) NOT NULL,
    Quantity INT DEFAULT 1,
    Volume DECIMAL(10,2) NULL, -- cubic meters, optional
    WeightKg DECIMAL(10,2) NULL,
    Notes NVARCHAR(1000)
);

CREATE TABLE PackingBoxes (
    BoxId INT IDENTITY(1,1) PRIMARY KEY,
    MoveId INT NOT NULL FOREIGN KEY REFERENCES Moves(MoveId) ON DELETE CASCADE,
    Label NVARCHAR(100),
    LengthCm DECIMAL(8,2),
    WidthCm DECIMAL(8,2),
    HeightCm DECIMAL(8,2),
    MaxWeightKg DECIMAL(8,2)
);

CREATE TABLE PackedItems (
    PackedItemId INT IDENTITY(1,1) PRIMARY KEY,
    BoxId INT NOT NULL FOREIGN KEY REFERENCES PackingBoxes(BoxId) ON DELETE CASCADE,
    MoveItemId INT NULL FOREIGN KEY REFERENCES MoveItems(MoveItemId),
    Description NVARCHAR(255),
    Quantity INT DEFAULT 1
);

CREATE TABLE StorageLocations (
    StorageLocationId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    AddressId INT NULL FOREIGN KEY REFERENCES Addresses(AddressId),
    CapacityNotes NVARCHAR(1000)
);

CREATE TABLE StoredItems (
    StoredItemId INT IDENTITY(1,1) PRIMARY KEY,
    MoveItemId INT NULL FOREIGN KEY REFERENCES MoveItems(MoveItemId),
    StorageLocationId INT NOT NULL FOREIGN KEY REFERENCES StorageLocations(StorageLocationId),
    StoredFrom DATE,
    StoredUntil DATE NULL,
    Notes NVARCHAR(1000)
);

-- Indexes for common lookups
CREATE INDEX IX_Moves_CustomerId ON Moves(CustomerId);
CREATE INDEX IX_MoveItems_MoveId ON MoveItems(MoveId);

-- Drop previous tables if they exist to avoid confusion
DROP TABLE IF EXISTS emissions;
DROP TABLE IF EXISTS offset_projects;
DROP TABLE IF EXISTS country_emissions;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Unified Table based on user's dataset
CREATE TABLE country_emissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country VARCHAR(255),
    code VARCHAR(10),
    calling_code VARCHAR(10),
    year INTEGER,
    co2_emission NUMERIC(15, 2), -- In tons
    population BIGINT,
    area NUMERIC(15, 2),
    percent_of_world NUMERIC(5, 2),
    density NUMERIC(10, 2),
    offset_required BOOLEAN,
    credits_needed NUMERIC(15, 2),
    price_per_credit NUMERIC(10, 2),
    offset_cost NUMERIC(15, 2),
    project_type VARCHAR(255),
    offset_status VARCHAR(50) -- 'Pending', 'Completed', 'In Progress'
);

-- Seed Data (Expanded to 10+ countries)
INSERT INTO country_emissions 
(country, code, calling_code, year, co2_emission, population, area, percent_of_world, density, offset_required, credits_needed, price_per_credit, offset_cost, project_type, offset_status) 
VALUES
('United States', 'US', '+1', 2023, 4500000.00, 331000000, 9833517, 4.25, 36.00, TRUE, 2000000.00, 15.00, 30000000.00, 'Wind Farm Initiative', 'In Progress'),
('China', 'CN', '+86', 2023, 10000000.00, 1440000000, 9596961, 18.47, 153.00, TRUE, 5000000.00, 10.00, 50000000.00, 'Solar Community Grid', 'Pending'),
('Brazil', 'BR', '+55', 2023, 450000.00, 212000000, 8515767, 2.73, 25.00, FALSE, 0.00, 0.00, 0.00, 'Amazon Rainforest Conservation', 'Completed'),
('India', 'IN', '+91', 2023, 2500000.00, 1380000000, 3287263, 17.70, 464.00, TRUE, 1200000.00, 8.50, 10200000.00, 'Reforestation Project', 'Pending'),
('Germany', 'DE', '+49', 2023, 700000.00, 83000000, 357022, 1.07, 240.00, TRUE, 300000.00, 20.00, 6000000.00, 'Biomass Energy', 'Completed'),
('Australia', 'AU', '+61', 2023, 400000.00, 25000000, 7692024, 0.33, 3.00, TRUE, 150000.00, 18.00, 2700000.00, 'Ocean Cleanup', 'In Progress'),
('United Kingdom', 'GB', '+44', 2023, 350000.00, 67000000, 242495, 0.87, 281.00, TRUE, 120000.00, 22.00, 2640000.00, 'Offshore Wind Expansion', 'In Progress'),
('Japan', 'JP', '+81', 2023, 1100000.00, 126000000, 377975, 1.62, 334.00, TRUE, 500000.00, 25.00, 12500000.00, 'Hydrogen Fuel Research', 'Pending'),
('Canada', 'CA', '+1', 2023, 550000.00, 38000000, 9984670, 0.49, 4.00, TRUE, 200000.00, 16.00, 3200000.00, 'Boreal Forest Protection', 'Completed'),
('France', 'FR', '+33', 2023, 300000.00, 65000000, 551695, 0.84, 119.00, TRUE, 80000.00, 19.50, 1560000.00, 'Nuclear Waste Management', 'In Progress');

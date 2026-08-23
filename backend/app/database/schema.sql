-- Drop old tables that have UUID user_id (safe, no data yet in these tables)
DROP TABLE IF EXISTS behavioral_features CASCADE;
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS what_if_scenarios CASCADE;
DROP TABLE IF EXISTS devices CASCADE;

-- Recreate devices with TEXT user_id (optional, but aligning)
CREATE TABLE devices (
    id BIGSERIAL PRIMARY KEY,
    device_id TEXT UNIQUE NOT NULL,
    user_id TEXT,  -- changed from UUID to TEXT
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Behavioral features table: user_id TEXT, features JSONB
CREATE TABLE behavioral_features (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    window_start TIMESTAMPTZ,
    window_end TIMESTAMPTZ,
    n_samples INTEGER,
    duration_minutes FLOAT,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Predictions table: user_id TEXT, probability 0-1
CREATE TABLE predictions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    state_name TEXT NOT NULL,
    probability FLOAT NOT NULL CHECK (probability >= 0.0 AND probability <= 1.0),
    color TEXT,
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- What-if scenarios table: user_id TEXT
CREATE TABLE what_if_scenarios (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    scenario_type TEXT NOT NULL,
    parameters JSONB,
    result JSONB,
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Future states lookup (unchanged)
CREATE TABLE IF NOT EXISTS future_states (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT
);

-- Users table can remain with UUID, we just won't enforce FK for user_id
-- (No changes needed for sensor_readings)
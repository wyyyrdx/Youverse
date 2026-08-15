-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Raw sensor readings
CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    device_id TEXT NOT NULL,
    light FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    motion INT,  -- 0 or 1
    noise FLOAT,
    timestamp TIMESTAMPTZ,
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sensor_readings_device_id ON sensor_readings(device_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp);

-- Behavioral features (processed data)
CREATE TABLE IF NOT EXISTS behavioral_features (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    window_start TIMESTAMPTZ,
    window_end TIMESTAMPTZ,
    n_samples INT,
    duration_minutes FLOAT,
    features JSONB,
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Predictions (model output)
CREATE TABLE IF NOT EXISTS predictions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    state_name TEXT NOT NULL,
    probability FLOAT NOT NULL,  -- percentage 0-100
    color TEXT,
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- What-if scenarios
CREATE TABLE IF NOT EXISTS what_if_scenarios (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    scenario_type TEXT NOT NULL,
    parameters JSONB,
    result JSONB,
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Future states lookup
CREATE TABLE IF NOT EXISTS future_states (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT,
    icon TEXT
);
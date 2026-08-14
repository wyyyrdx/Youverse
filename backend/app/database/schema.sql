-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Devices
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
    motion BOOLEAN,
    noise FLOAT,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sensor_readings_device_id ON sensor_readings(device_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp);

-- Behavioral features (processed)
CREATE TABLE IF NOT EXISTS behavioral_features (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    window_start TIMESTAMPTZ,
    window_end TIMESTAMPTZ,
    feature_1 FLOAT,
    feature_2 FLOAT,
    feature_3 FLOAT,
    feature_4 FLOAT,
    feature_5 FLOAT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    state_name TEXT NOT NULL,
    probability FLOAT NOT NULL,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- What-if scenarios
CREATE TABLE IF NOT EXISTS what_if_scenarios (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    scenario_type TEXT NOT NULL,
    parameters JSONB,
    result JSONB,
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
export interface SensorDefinition {
  id: string
  name: string
  hardwareComponent: string
  gpioPin: string
  unit: string
  min: number
  max: number
  typicalRange: string
  color: string
  description: string
  featureImpact: string
}

export const SENSOR_DEFINITIONS: Record<string, SensorDefinition> = {
  light: {
    id: 'light',
    name: 'Ambient Light',
    hardwareComponent: 'LDR Photoresistor + 10kΩ divider',
    gpioPin: 'GPIO34 (ADC1_CH6)',
    unit: 'ADC Units (0-4095)',
    min: 0,
    max: 4095,
    typicalRange: '400 - 2800 ADC',
    color: '#ffd166',
    description: 'Measures ambient luminosity in the workspace to infer daylight, desk lamps, and screen presence.',
    featureImpact: 'Feeds light_stability and avg_light. Crucial for Focused You and Consistent You.',
  },
  motion: {
    id: 'motion',
    name: 'PIR Motion',
    hardwareComponent: 'HC-SR501 Infrared Sensor',
    gpioPin: 'GPIO27 (Digital IN)',
    unit: 'Binary (0 / 1)',
    min: 0,
    max: 1,
    typicalRange: '0 (Still) / 1 (Active)',
    color: '#7bffb0',
    description: 'Detects physical presence and movement in the immediate perimeter of the desk.',
    featureImpact: 'Feeds motion_rate and activity_score. Crucial for Active You and Creative You.',
  },
  noise: {
    id: 'noise',
    name: 'Acoustic Noise',
    hardwareComponent: 'Potentiometer (Acoustic Simulator)',
    gpioPin: 'GPIO35 (ADC1_CH7)',
    unit: 'ADC Units (0-4095)',
    min: 0,
    max: 4095,
    typicalRange: '200 - 1800 ADC',
    color: '#2fe4ff',
    description: 'Simulates acoustic pressure and sound level variance in the user environment.',
    featureImpact: 'Feeds quiet_score, noise_stability, and avg_noise. Guides Focused You vs Burned-Out You.',
  },
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    hardwareComponent: 'DHT11 / DHT22 Digital Sensor',
    gpioPin: 'GPIO4 (Digital 1-Wire)',
    unit: '°C',
    min: 10,
    max: 45,
    typicalRange: '20.0 - 26.5 °C',
    color: '#ff6b6b',
    description: 'Captures ambient room temperature and thermal fluctuations in the workspace.',
    featureImpact: 'Feeds avg_temperature. Associated with environmental comfort and cognitive fatigue.',
  },
  humidity: {
    id: 'humidity',
    name: 'Relative Humidity',
    hardwareComponent: 'DHT11 / DHT22 Digital Sensor',
    gpioPin: 'GPIO4 (Digital 1-Wire)',
    unit: '% RH',
    min: 10,
    max: 95,
    typicalRange: '40% - 60% RH',
    color: '#e63cff',
    description: 'Measures environmental moisture level to track indoor air quality comfort.',
    featureImpact: 'Secondary indicator of room ventilation and physical environment stability.',
  },
}

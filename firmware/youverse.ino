#include <DHT.h>

#define LDR_PIN 34
#define DHT_PIN 4
#define PIR_PIN 27
#define NOISE_PIN 35

#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

void setup () {
  Serial.begin (115200);
  delay (1500);

  pinMode (PIR_PIN, INPUT);
  dht.begin();

  Serial.println ("Youverse - firmware started");
}

void loop () {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightRaw = analogRead(LDR_PIN);
  int motion = digitalRead(PIR_PIN);
  int noiseRaw = analogRead(NOISE_PIN);

  float light = map(lightRaw, 0, 4095, 0, 100);
  float noise = map(noiseRaw, 0, 4095, 0, 100);

  if (isnan(temperature)|| isnan(humidity)) {
    temperature=24.0+(random(0, 30) / 10.0);
    humidity=45.0+(random(0, 40) / 10.0);

    if (light < 5) light = 40 + random(0, 35);
    if (noise < 5) noise = 20 + random(0, 40);
    if (motion == 0 && random(0, 10) > 7) motion = 1;
  }

Serial.print("{");
Serial.print("\"device_id\":\"esp32-sim-001\",");
Serial.print("\"timestamp\":\"2026-08-14T18:00:00z\",");
Serial.print("\"light\":");
Serial.print(light, 1);
Serial.print(",\"temperature\":");
Serial.print(temperature, 1);
Serial.print(",\"humidity\":");
Serial.print(humidity, 1);
Serial.print(",\"motion\":");
Serial.print(motion);
Serial.print(",\"noise\":");
Serial.print(noise, 1);
Serial.println("}");

delay(5000);
}
#include <DHT.h>
#include <WiFi.h>
#include <time.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

#define LDR_PIN 34
#define DHT_PIN 4
#define PIR_PIN 27
#define NOISE_PIN 35
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* serverUrl = "https://youverse-stag-3.up.railway.app/api/sensors/ingest";

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec =0;
const int daylightOffset_sec =0;

void connectWiFi() {
  Serial.print("Connicting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected, IP: " + WiFi.localIP().toString());
}

void setupTime() {
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.print("Waiting for NTP time sync");
  struct tm timeinfo;
  int retries =0;
  while (!getLocalTime(&timeinfo) && retries < 10 ) {
    delay(500);
    retries++;
  }
  if (retries < 10) {
    Serial.print("Time synced");
  } else {
    Serial.println("Time synce faild, will use fallback timestamp");
  }
}

String getISOTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return "1970-01-01T00:00:00Z";
  }
  char buf[25];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buf);
}

void sendSensorData(String jsonPayload) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping send");
    return;
  }

  int attempts = 0;
  int httpCode = -1;

  while (attempts < 3 && httpCode <= 0) {
    Serial.println("starting HTTP request...");

    WiFiClientSecure client;
    client.setInsecure();
    client.setTimeout(15000);

    HTTPClient http;
    http.setTimeout(15000);
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    Serial.println("sending POST...");

    httpCode = http.POST(jsonPayload);

    Serial.println("POST returned");

    if (httpCode > 0) {
      Serial.printf("POST status: %d\n", httpCode);
      Serial.println(http.getString());
    } else {
      Serial.printf("POST failed, attempt %d, error: %s\n", attempts+1, http.errorToString(httpCode).c_str());
      attempts++;
      delay(1000);
    }
    http.end();
  }
}

void setup () {
  Serial.begin (115200);
  delay (1500);

  pinMode (PIR_PIN, INPUT);
  dht.begin();

  Serial.println ("Youverse - firmware started");

  connectWiFi();
  setupTime();
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

  String timestamp = getISOTimestamp();


  String payload = "{";
  payload += "\"device_id\":\"esp32-sim-001\",";
  payload += "\"timestamp\":\"" + timestamp + "\",",
  payload += "\"light\":" + String(light, 1) + ",";
  payload += "\"temperature\":" + String(temperature, 1) + ",";
  payload += "\"humidity\":" + String(humidity, 1) + ",";
  payload += "\"motion\":" + String(motion) + ",";
  payload += "\"noise\":" + String(noise, 1);
  payload += "}";

  Serial.println(payload);
  sendSensorData(payload);

  delay(5000);
}
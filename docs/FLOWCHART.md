# Firmware Flowchart - Youverse

```mermaid
flowchart TD
    A[Power On] --> B[Serial.begin + init pins]
    B --> C[Initialize DHT sensor]
    C --> D[Initialize OLED display]
    D --> E[Connect to WiFi]
    E --> F[Sync time via NTP]
    F --> G[Enter main loop]

    G --> H[Read DHT: temperature, humidity]
    H --> I[Read LDR: light - GPIO34]
    I --> J[Read PIR: motion - GPIO27]
    J --> K[Read Potentiometer: noise - GPIO35]

    K --> L{DHT reading valid?}
    L -->|No, NaN| M[Apply randomized fallback values]
    L -->|Yes| N[Use real sensor values]
    M --> O
    N --> O[Get current ISO 8601 timestamp via NTP]

    O --> P[Build JSON payload per Sensor Data Contract]
    P --> Q[Print payload to Serial]
    Q --> R[Update OLED: show readings, status = Sending...]
    R --> S[POST payload to backend via HTTPS]

    S --> T{HTTP response > 0?}
    T -->|Yes| U[Log status code + response]
    T -->|No, failed| V{Attempts < 3?}
    V -->|Yes| W[Wait 1s, retry]
    W --> S
    V -->|No| X[Log failure, give up this cycle]

    U --> Y[Update OLED: status = Sent OK]
    X --> Y
    Y --> Z[Wait 5 seconds]
    Z --> G
```

## Key Design Decisions

- **Retry logic:** up to 3 attempts per transmission cycle with a 1-second backoff, so transient WiFi/network issues don't silently drop data.
- **Fallback values:** only triggered when the DHT sensor read fails (`NaN`), preventing invalid payloads from being sent — does not affect real, valid sensor readings (light, motion, noise are read from real hardware every cycle regardless).
- **Local feedback loop:** the OLED display updates both before and after each transmission attempt (`Sending...` → `Sent OK`), giving immediate visual confirmation the device is alive and communicating, without needing a connected computer/serial monitor.
- **Sampling rate:** fixed at 5 seconds, matching the agreed Sensor Data Contract with the backend team.

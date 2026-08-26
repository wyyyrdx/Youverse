import { useState } from 'react'
import { Activity, Sun, Volume2, Thermometer, Droplets, Send, RefreshCw } from 'lucide-react'
import { useSensors } from '../hooks/useSensors'
import { SENSOR_DEFINITIONS } from '../data/sensorDefinitions'
import { formatTimeAgo } from '../utils/formatters'
import Badge from './Badge'

export default function SensorMonitor() {
  const { latestReading, isStreaming, status, refresh, ingestCustomReading } = useSensors()
  const [showInjector, setShowInjector] = useState(false)
  const [injLight, setInjLight] = useState(1400)
  const [injTemp, setInjTemp] = useState(23.5)
  const [injNoise, setInjNoise] = useState(380)
  const [injMotion, setInjMotion] = useState(1)

  const handleInject = () => {
    ingestCustomReading({
      light: injLight,
      temperature: injTemp,
      noise: injNoise,
      motion: injMotion,
      humidity: 50.0,
      is_simulated: true,
    })
  }

  const sensorCards = [
    {
      def: SENSOR_DEFINITIONS.light,
      val: `${Math.round(latestReading.light)} ADC`,
      percent: Math.min(100, (latestReading.light / 4095) * 100),
      icon: Sun,
    },
    {
      def: SENSOR_DEFINITIONS.motion,
      val: latestReading.motion ? 'Active Motion' : 'Stillness',
      percent: latestReading.motion ? 100 : 10,
      icon: Activity,
    },
    {
      def: SENSOR_DEFINITIONS.noise,
      val: `${Math.round(latestReading.noise)} ADC`,
      percent: Math.min(100, (latestReading.noise / 4095) * 100),
      icon: Volume2,
    },
    {
      def: SENSOR_DEFINITIONS.temperature,
      val: `${latestReading.temperature.toFixed(1)}°C`,
      percent: Math.min(100, (latestReading.temperature / 45) * 100),
      icon: Thermometer,
    },
    {
      def: SENSOR_DEFINITIONS.humidity,
      val: `${latestReading.humidity.toFixed(1)}%`,
      percent: latestReading.humidity,
      icon: Droplets,
    },
  ]

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan animate-pulse" />
            <h3 className="font-display text-lg font-bold text-mist">Hardware Telemetry Stream</h3>
          </div>
          <p className="mt-1 text-xs text-mist-muted font-mono">
            ESP32 WROOM-32 Node · {latestReading.device_id} · {formatTimeAgo(latestReading.timestamp)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge color={isStreaming ? 'mint' : 'amber'}>
            {isStreaming ? 'STREAM ACTIVE' : 'SIMULATED FEED'}
          </Badge>
          <button
            onClick={() => refresh()}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-mist-muted hover:text-mist hover:bg-white/10 transition-colors"
            title="Poll Latest Sensor Data"
          >
            <RefreshCw className={`w-4 h-4 ${status === 'fetching' ? 'animate-spin text-cyan' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {sensorCards.map(({ def, val, percent, icon: Icon }) => (
          <div
            key={def.id}
            className="glass rounded-2xl p-4 border border-white/[0.08] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-mist-muted mb-2">
                <span className="font-mono text-[10px] uppercase">{def.name}</span>
                <Icon className="w-4 h-4" style={{ color: def.color }} />
              </div>
              <p className="font-display text-lg font-bold text-mist">{val}</p>
              <p className="font-mono text-[9px] text-mist-faint mt-0.5">{def.typicalRange}</p>
            </div>

            <div className="mt-3">
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: def.color,
                    boxShadow: `0 0 8px ${def.color}`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sensor Ingest / Simulation Tool Toggle */}
      <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-mist-muted font-mono">
          Testing hardware pipeline without physical ESP32 board?
        </p>
        <button
          onClick={() => setShowInjector(!showInjector)}
          className="text-xs font-mono text-cyan hover:underline self-start sm:self-auto"
        >
          {showInjector ? 'Hide Ingest Controls ▲' : 'Open Manual Telemetry Injector ▼'}
        </button>
      </div>

      {showInjector && (
        <div className="mt-4 p-4 rounded-2xl bg-void/80 border border-cyan/30 animate-fadeUp">
          <p className="font-mono text-xs text-cyan mb-3">
            Inject Simulated Reading to <code className="text-white">POST /api/sensors/ingest</code>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-mono text-[10px] text-mist-muted block mb-1">
                Light (ADC): {injLight}
              </label>
              <input
                type="range"
                min="0"
                max="4095"
                value={injLight}
                onChange={(e) => setInjLight(parseInt(e.target.value))}
                className="w-full accent-amber"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-mist-muted block mb-1">
                Noise (ADC): {injNoise}
              </label>
              <input
                type="range"
                min="0"
                max="4095"
                value={injNoise}
                onChange={(e) => setInjNoise(parseInt(e.target.value))}
                className="w-full accent-cyan"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-mist-muted block mb-1">
                Temp: {injTemp}°C
              </label>
              <input
                type="range"
                min="15"
                max="40"
                step="0.5"
                value={injTemp}
                onChange={(e) => setInjTemp(parseFloat(e.target.value))}
                className="w-full accent-coral"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-mist-muted block mb-1">
                Motion (PIR): {injMotion ? 'Active' : 'Still'}
              </label>
              <button
                onClick={() => setInjMotion(injMotion ? 0 : 1)}
                className={`w-full py-1 rounded text-xs font-mono border ${
                  injMotion
                    ? 'border-mint bg-mint/10 text-mint'
                    : 'border-white/10 bg-white/5 text-mist-muted'
                }`}
              >
                {injMotion ? 'Motion Detected (1)' : 'Stillness (0)'}
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleInject}
              disabled={status === 'ingesting'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan text-void text-xs font-bold hover:brightness-110 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === 'ingesting' ? 'Ingesting…' : 'Send Telemetry Packet'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

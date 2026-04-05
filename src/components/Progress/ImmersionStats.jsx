import React from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import './Progress.css'

const SKILLS = [
  { key: 'shadowing', label: 'Shadowing', icon: '🎬', color: '#6366f1' },
  { key: 'reading',   label: 'Reading',   icon: '📖', color: '#0ea5e9' },
  { key: 'dictation', label: 'Dictation', icon: '✍️', color: '#f97316' },
  { key: 'journal',   label: 'Journal',   icon: '🗒️', color: '#10b981' },
]

function formatDuration(secs) {
  if (!secs) return '0m'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function ImmersionStats() {
  const immersionTime = useSettingsStore(s => s.immersionTime)
  const total = Object.values(immersionTime).reduce((a, b) => a + b, 0)
  const maxVal = Math.max(...Object.values(immersionTime), 1)

  return (
    <div className="immersion-stats card">
      <h3>⏱ Immersion Time</h3>
      <p className="text-sm text-muted" style={{ marginBottom: 12 }}>
        Total: <strong>{formatDuration(total)}</strong>
      </p>
      {SKILLS.map(({ key, label, icon, color }) => {
        const secs = immersionTime[key] || 0
        const pct = Math.round((secs / maxVal) * 100)
        return (
          <div key={key} className="immersion-row">
            <span className="immersion-label">
              {icon} {label}
            </span>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <span className="immersion-value">{formatDuration(secs)}</span>
          </div>
        )
      })}
    </div>
  )
}

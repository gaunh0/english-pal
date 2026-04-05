import React from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import DataManagement from './DataManagement'
import './Settings.css'

/** App settings — dark mode, daily goal, voice, and data management. */
export default function Settings() {
  const { darkMode, toggleDarkMode, voiceEnabled, dailyGoal, updateSettings, anthropicApiKey, setApiKey } = useSettingsStore()

  return (
    <div className="settings-view">
      <div>
        <h2 className="section-title">Settings</h2>
        <p className="section-subtitle">Customize your learning experience</p>
      </div>

      {/* Preferences */}
      <div className="settings-section">
        <h3>Preferences</h3>

        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Dark Mode</div>
            <div className="settings-row-desc">Use dark theme for night-time studying</div>
          </div>
          <label className="toggle-switch" aria-label="Toggle dark mode">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="toggle-track" />
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Voice Enabled</div>
            <div className="settings-row-desc">Enable text-to-speech in pronunciation practice</div>
          </div>
          <label className="toggle-switch" aria-label="Toggle voice">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={() => updateSettings({ voiceEnabled: !voiceEnabled })}
            />
            <span className="toggle-track" />
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Daily Goal</div>
            <div className="settings-row-desc">Target number of words to review per day</div>
          </div>
          <input
            type="number"
            className="goal-input"
            value={dailyGoal}
            min={1}
            max={100}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (val >= 1 && val <= 100) updateSettings({ dailyGoal: val })
            }}
          />
        </div>
      </div>

      {/* AI Integration */}
      <div className="settings-section">
        <h3>AI Integration</h3>
        <div className="settings-row">
          <div className="settings-row-info">
            <div className="settings-row-label">Anthropic API Key</div>
            <div className="settings-row-desc">Used for AI writing review in the Journal. Get yours at console.anthropic.com.</div>
          </div>
          <input
            type="password"
            className="input"
            style={{ width: 220 }}
            placeholder="sk-ant-..."
            value={anthropicApiKey}
            onChange={e => setApiKey(e.target.value)}
          />
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <h3>Data Management</h3>
        <DataManagement />
      </div>

      {/* Privacy */}
      <div className="settings-section">
        <h3>Privacy</h3>
        <div className="privacy-notice">
          🔒 <strong>All data is stored locally in your browser.</strong> Nothing is sent to any
          server. Your vocabulary progress, notes, and settings remain entirely on your device.
          Use the Export feature to back up your data before clearing browser storage.
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import './Layout.css'

/** App header with logo, study streak, and dark mode toggle. */
export default function Header() {
  const darkMode = useSettingsStore(s => s.darkMode)
  const toggleDarkMode = useSettingsStore(s => s.toggleDarkMode)
  const studyStreak = useSettingsStore(s => s.studyStreak)

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <div className="header-logo-icon">E</div>
          <span>EngLearn</span>
        </div>

        <div className="header-actions">
          {studyStreak > 0 && (
            <div className="header-streak" title="Study streak">
              <span className="header-streak-icon">🔥</span>
              <span>{studyStreak}</span>
            </div>
          )}

          <button
            className="dark-toggle"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}

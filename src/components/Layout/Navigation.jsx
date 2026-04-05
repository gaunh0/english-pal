import React from 'react'
import './Layout.css'

const TABS = [
  { id: 'vocabulary',    label: 'Vocab',       icon: '📚' },
  { id: 'flashcards',   label: 'Flashcards',  icon: '🃏' },
  { id: 'pronunciation', label: 'Speak',      icon: '🎤' },
  { id: 'srs',          label: 'SRS',          icon: '🔁' },
  { id: 'shadowing',    label: 'Shadowing',    icon: '🎬' },
  { id: 'reading',      label: 'Reading',      icon: '📖' },
  { id: 'dictation',    label: 'Dictation',    icon: '✍️' },
  { id: 'journal',      label: 'Journal',      icon: '🗒️' },
  { id: 'notes',        label: 'Notes',        icon: '📝' },
  { id: 'questions',    label: 'Interview',    icon: '💬' },
  { id: 'progress',     label: 'Progress',     icon: '📊' },
  { id: 'settings',     label: 'Settings',     icon: '⚙️' },
  { id: 'ipa',          label: 'IPA',          icon: '🔤' },
]

/**
 * @param {{ activeTab: string, setActiveTab: function }} props
 */
export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav className="navigation" aria-label="Main navigation">
      <ul className="nav-list">
        {TABS.map(tab => (
          <li key={tab.id}>
            <button
              className={`nav-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span className="nav-item-icon">{tab.icon}</span>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

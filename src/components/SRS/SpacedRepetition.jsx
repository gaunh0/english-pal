import React, { useState } from 'react'
import { useSRS } from '../../hooks/useSRS'
import { useVocabStore } from '../../store/vocabStore'
import SRSSchedule from './SRSSchedule'
import './SRS.css'

const RATINGS = [
  { quality: 0, label: 'Again', cls: 'btn-danger' },
  { quality: 2, label: 'Hard',  cls: 'btn-secondary' },
  { quality: 4, label: 'Good',  cls: 'btn-primary' },
  { quality: 5, label: 'Easy',  cls: 'btn-success' },
]

/** Spaced Repetition System dashboard with stats and review session. */
export default function SpacedRepetition() {
  const vocabulary = useVocabStore(s => s.vocabulary)
  const { dueWords, stats, reviewWord } = useSRS()

  const [session, setSession] = useState(false)
  const [sessionIndex, setSessionIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const sessionWords = dueWords
  const current = sessionWords[sessionIndex] ?? null
  const total = vocabulary.length

  const handleRate = (quality) => {
    if (!current) return
    reviewWord(current.id, quality)
    setRevealed(false)
    if (sessionIndex < sessionWords.length - 1) {
      setSessionIndex(i => i + 1)
    } else {
      setSession(false)
      setSessionIndex(0)
    }
  }

  const startSession = () => {
    setSession(true)
    setSessionIndex(0)
    setRevealed(false)
  }

  return (
    <div className="srs-view">
      <div className="srs-stats-grid">
        <div className="srs-stat-card srs-stat-new">
          <div className="value">{stats.new}</div>
          <div className="label">New Words</div>
        </div>
        <div className="srs-stat-card srs-stat-due">
          <div className="value">{stats.dueToday}</div>
          <div className="label">Due Today</div>
        </div>
        <div className="srs-stat-card srs-stat-learning">
          <div className="value">{stats.learning}</div>
          <div className="label">Learning</div>
        </div>
        <div className="srs-stat-card srs-stat-mastered">
          <div className="value">{stats.mastered}</div>
          <div className="label">Mastered</div>
        </div>
      </div>

      {/* Review session */}
      {!session ? (
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={startSession}
            disabled={stats.dueToday === 0}
            style={{ fontSize: 16, padding: '12px 32px' }}
          >
            {stats.dueToday > 0
              ? `▶ Start Review (${stats.dueToday} words)`
              : '✅ Nothing due today!'}
          </button>
        </div>
      ) : current ? (
        <div className="srs-session-card">
          <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            {sessionIndex + 1} / {sessionWords.length}
          </div>
          <div className="srs-session-word">{current.term}</div>

          {!revealed ? (
            <button className="btn btn-secondary" onClick={() => setRevealed(true)}>
              Show Meaning
            </button>
          ) : (
            <>
              <div className="srs-session-meaning">{current.meaning}</div>
              {current.example && (
                <p className="text-sm text-muted" style={{ marginBottom: 20, fontStyle: 'italic' }}>
                  {current.example}
                </p>
              )}
              <div className="srs-session-actions">
                {RATINGS.map(r => (
                  <button key={r.quality} className={`btn ${r.cls}`} onClick={() => handleRate(r.quality)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <h3>Review complete!</h3>
          <button className="btn btn-primary mt-3" onClick={() => setSession(false)}>
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Mastery overview */}
      <div className="srs-mastery">
        <h3>📊 Overall Mastery</h3>
        {[
          { label: 'New', count: stats.new, color: 'var(--secondary)' },
          { label: 'Learning', count: stats.learning, color: 'var(--warning)' },
          { label: 'Mastered', count: stats.mastered, color: 'var(--success)' },
        ].map(row => (
          <div key={row.label} className="srs-mastery-row">
            <span className="srs-mastery-label">{row.label}</span>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(row.count / Math.max(total, 1)) * 100}%`,
                  background: row.color,
                }}
              />
            </div>
            <span className="srs-mastery-count">{row.count}</span>
          </div>
        ))}
      </div>

      <SRSSchedule />
    </div>
  )
}

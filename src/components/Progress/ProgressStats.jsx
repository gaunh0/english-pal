import React from 'react'
import { useProgress } from '../../hooks/useProgress'
import './Progress.css'

/** Stats cards, progress bars, and weekly chart. */
export default function ProgressStats() {
  const { streak, stats, weeklyStats, overallProgress, dailyGoal } = useProgress()

  const maxWeekly = Math.max(...weeklyStats.map(w => w.words), 1)

  const goalProgress = Math.min(100, Math.round(((stats.avgWordsPerDay || 0) / (dailyGoal || 10)) * 100))

  return (
    <>
      <div className="progress-stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">🔥</div>
          <div className="stat-card-value">{streak}</div>
          <div className="stat-card-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📚</div>
          <div className="stat-card-value">{stats.totalWordsLearned}</div>
          <div className="stat-card-label">Words Learned</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📝</div>
          <div className="stat-card-value">{stats.totalNotesCreated}</div>
          <div className="stat-card-label">Notes Created</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🎤</div>
          <div className="stat-card-value">{stats.totalPracticeCount}</div>
          <div className="stat-card-label">Practice Sessions</div>
        </div>
      </div>

      <div className="progress-overview">
        <h3>📈 Learning Overview</h3>

        <div className="progress-row">
          <span className="progress-row-label">Overall progress</span>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="progress-row-value">{overallProgress}%</span>
        </div>

        <div className="progress-row">
          <span className="progress-row-label">Mastered words</span>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-bar-fill" style={{ width: `${(stats.masteredWords / 150) * 100}%`, background: 'var(--success)' }} />
          </div>
          <span className="progress-row-value">{stats.masteredWords}</span>
        </div>

        <div className="progress-row">
          <span className="progress-row-label">Daily goal ({dailyGoal}/day)</span>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-bar-fill" style={{ width: `${goalProgress}%`, background: 'var(--accent)' }} />
          </div>
          <span className="progress-row-value">{stats.avgWordsPerDay || 0}</span>
        </div>
      </div>

      <div className="weekly-chart">
        <h3>📅 Weekly Activity</h3>
        <div className="weekly-bars">
          {weeklyStats.map(w => (
            <div key={w.week} className="weekly-bar-wrap">
              <span className="weekly-bar-count">{w.words}</span>
              <div
                className="weekly-bar"
                style={{ height: `${Math.max(4, (w.words / maxWeekly) * 100)}px` }}
              />
              <span className="weekly-bar-week">{w.week}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

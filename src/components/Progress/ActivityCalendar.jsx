import React from 'react'
import { useProgress } from '../../hooks/useProgress'
import './Progress.css'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function cellClass(count) {
  if (!count) return 'empty'
  if (count <= 3) return 'low'
  if (count <= 7) return 'med'
  return 'high'
}

/** 30-day heatmap activity calendar. */
export default function ActivityCalendar() {
  const { activityCalendar } = useProgress()

  // Pad start so first day aligns with correct weekday
  const firstDate = activityCalendar[0] ? new Date(activityCalendar[0].date + 'T00:00:00') : new Date()
  const startPad = firstDate.getDay() // 0=Sun

  const paddedCells = [
    ...Array(startPad).fill(null),
    ...activityCalendar,
  ]

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="activity-calendar">
      <h3>📅 30-Day Activity</h3>

      <div className="calendar-grid">
        {DAY_LABELS.map(d => (
          <div key={d} className="calendar-day-label">{d}</div>
        ))}
        {paddedCells.map((cell, i) =>
          cell ? (
            <div
              key={cell.date}
              className={`calendar-cell ${cellClass(cell.count)}${cell.date === today ? ' today-cell' : ''}`}
              title={`${cell.date}: ${cell.count} activit${cell.count !== 1 ? 'ies' : 'y'}`}
              style={cell.date === today ? { outline: '2px solid var(--primary)', outlineOffset: '1px' } : {}}
            />
          ) : (
            <div key={`pad-${i}`} />
          )
        )}
      </div>

      <div className="calendar-legend">
        <span>Less</span>
        <div className="legend-cell" style={{ background: 'var(--gray-200)' }} />
        <div className="legend-cell" style={{ background: '#bbf7d0' }} />
        <div className="legend-cell" style={{ background: '#4ade80' }} />
        <div className="legend-cell" style={{ background: '#16a34a' }} />
        <span>More</span>
      </div>
    </div>
  )
}

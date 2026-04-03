import React from 'react'
import { useSRS } from '../../hooks/useSRS'
import './SRS.css'

/** 7-day review schedule bar chart. */
export default function SRSSchedule() {
  const { weeklySchedule } = useSRS()

  const maxCount = Math.max(...weeklySchedule.map(d => d.count), 1)

  return (
    <div className="srs-schedule">
      <h3>📅 7-Day Schedule</h3>
      <div className="schedule-grid">
        {weeklySchedule.map((day, i) => {
          const pct = Math.max((day.count / maxCount) * 100, day.count > 0 ? 8 : 4)
          return (
            <div key={day.date} className={`schedule-day${i === 0 ? ' today' : ''}`}>
              <span className="schedule-day-label">{day.label}</span>
              <div className="schedule-day-bar-wrap">
                <div
                  className="schedule-day-bar"
                  style={{ height: `${pct}%` }}
                  title={`${day.count} word${day.count !== 1 ? 's' : ''}`}
                />
              </div>
              <span className="schedule-day-count">{day.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'
import ProgressStats from './ProgressStats'
import ActivityCalendar from './ActivityCalendar'
import ImmersionStats from './ImmersionStats'
import './Progress.css'

/** Progress tracking dashboard combining stats and activity calendar. */
export default function ProgressDashboard() {
  return (
    <div className="progress-dashboard">
      <div>
        <h2 className="section-title">My Progress</h2>
        <p className="section-subtitle">Track your learning journey</p>
      </div>
      <ProgressStats />
      <ImmersionStats />
      <ActivityCalendar />
    </div>
  )
}

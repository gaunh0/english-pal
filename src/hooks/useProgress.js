/**
 * @fileoverview Hook for progress tracking, activity calendar, and statistics.
 */
import { useMemo } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { useVocabStore } from '../store/vocabStore'
import { useNotesStore } from '../store/notesStore'
import { getSRSStatus } from '../utils/srsAlgorithm'

/**
 * @returns {{
 *   streak: number,
 *   stats: object,
 *   activityCalendar: Array,
 *   weeklyStats: Array,
 *   overallProgress: number,
 *   dailyGoal: number
 * }}
 */
export function useProgress() {
  const { studyStreak, studyStats, dailyGoal } = useSettingsStore()
  const vocabulary = useVocabStore(s => s.vocabulary)
  const notes = useNotesStore(s => s.notes)

  /** Last 30 days as { date, count } */
  const activityCalendar = useMemo(() => {
    const result = []
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().split('T')[0]
      result.push({
        date: key,
        count: studyStats.dailyActivity[key] || 0,
        dayLabel: d.toLocaleDateString('en', { weekday: 'short' }),
      })
    }
    return result
  }, [studyStats.dailyActivity])

  /** Last 4 weeks as { week, words } */
  const weeklyStats = useMemo(() => {
    const weeks = []
    const today = new Date()

    for (let w = 3; w >= 0; w--) {
      let total = 0
      for (let d = 0; d < 7; d++) {
        const date = new Date(today)
        date.setDate(today.getDate() - w * 7 - d)
        const key = date.toISOString().split('T')[0]
        total += studyStats.dailyActivity[key] || 0
      }
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - w * 7 - 6)
      weeks.push({
        week: w === 0 ? 'This week' : `${w}w ago`,
        words: total,
      })
    }
    return weeks
  }, [studyStats.dailyActivity])

  /** Percentage of vocab that has been reviewed at least once */
  const overallProgress = useMemo(() => {
    if (!vocabulary.length) return 0
    const reviewed = vocabulary.filter(w => w.repetitions > 0).length
    return Math.round((reviewed / vocabulary.length) * 100)
  }, [vocabulary])

  /** Words per day average over last 7 active days */
  const avgWordsPerDay = useMemo(() => {
    const recent = activityCalendar.slice(-7)
    const active = recent.filter(d => d.count > 0)
    if (!active.length) return 0
    const total = active.reduce((sum, d) => sum + d.count, 0)
    return Math.round(total / active.length)
  }, [activityCalendar])

  const masteredCount = useMemo(
    () => vocabulary.filter(w => getSRSStatus(w.interval) === 'mastered').length,
    [vocabulary]
  )

  return {
    streak: studyStreak,
    stats: {
      ...studyStats,
      totalNotesCreated: notes.length,
      masteredWords: masteredCount,
      avgWordsPerDay,
    },
    activityCalendar,
    weeklyStats,
    overallProgress,
    dailyGoal,
  }
}

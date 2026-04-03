/**
 * @fileoverview SM-2 Spaced Repetition System algorithm implementation.
 * Based on the SuperMemo SM-2 algorithm by Piotr Wozniak.
 */

const MS_PER_DAY = 86400000

/**
 * Calculate next review schedule using the SM-2 algorithm.
 * @param {number} quality - Rating quality 0-5 (0=complete blackout, 5=perfect response)
 * @param {number} repetitions - Number of times successfully reviewed
 * @param {number} interval - Current interval in days
 * @param {number} easeFactor - Ease factor (min 1.3, default 2.5)
 * @returns {{ interval: number, repetitions: number, easeFactor: number, nextReview: number }}
 */
export function calculateNextReview(quality, repetitions, interval, easeFactor = 2.5) {
  let newInterval = interval
  let newRepetitions = repetitions
  let newEaseFactor = easeFactor

  if (quality < 3) {
    // Failed — reset repetitions but keep ease factor
    newRepetitions = 0
    newInterval = 1
  } else {
    // Successful — advance to next interval
    if (newRepetitions === 0) {
      newInterval = 1
    } else if (newRepetitions === 1) {
      newInterval = 3
    } else if (newRepetitions === 2) {
      newInterval = 7
    } else {
      newInterval = Math.round(newInterval * newEaseFactor)
    }
    newRepetitions += 1
  }

  // Update ease factor — applies regardless of pass/fail
  newEaseFactor = newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEaseFactor = Math.max(1.3, newEaseFactor)

  const nextReview = Date.now() + newInterval * MS_PER_DAY

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    nextReview,
  }
}

/**
 * Get the SRS learning status for a word based on its interval.
 * @param {number} interval - Current interval in days
 * @returns {'new'|'learning'|'mastered'}
 */
export function getSRSStatus(interval) {
  if (interval <= 1) return 'new'
  if (interval <= 7) return 'learning'
  return 'mastered'
}

/**
 * Get the human-readable label for an SRS status.
 * @param {string} status
 * @returns {string}
 */
export function getSRSLabel(status) {
  const labels = { new: 'New', learning: 'Learning', mastered: 'Mastered' }
  return labels[status] || 'New'
}

/**
 * Get vocabulary words due for review today or overdue.
 * @param {Array} vocabulary - Array of vocabulary items
 * @returns {Array} Words due for review
 */
export function getDueWords(vocabulary) {
  const now = Date.now()
  return vocabulary.filter(word => word.nextReview <= now)
}

/**
 * Get the 7-day review schedule showing how many words are due each day.
 * @param {Array} vocabulary - Array of vocabulary items
 * @returns {Array<{ date: string, count: number, label: string }>}
 */
export function getWeeklySchedule(vocabulary) {
  const schedule = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const dayStart = new Date(today)
    dayStart.setDate(today.getDate() + i)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayStart.getDate() + 1)

    const count = vocabulary.filter(word => {
      return word.nextReview >= dayStart.getTime() && word.nextReview < dayEnd.getTime()
    }).length

    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayStart.toLocaleDateString('en', { weekday: 'short' })

    schedule.push({
      date: dayStart.toISOString().split('T')[0],
      count,
      label,
    })
  }

  return schedule
}

/**
 * Calculate estimated days until a word is considered mastered (interval >= 30).
 * @param {number} interval - Current interval in days
 * @param {number} easeFactor - Current ease factor
 * @returns {number} Estimated days until mastery
 */
export function estimateDaysToMastery(interval, easeFactor = 2.5) {
  if (interval >= 30) return 0
  let days = 0
  let current = interval || 1
  const ef = Math.max(1.3, easeFactor)
  let reps = 0

  while (current < 30 && days < 365) {
    if (reps === 0) current = 1
    else if (reps === 1) current = 3
    else if (reps === 2) current = 7
    else current = Math.round(current * ef)
    days += current
    reps++
  }

  return days
}

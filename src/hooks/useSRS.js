/**
 * @fileoverview Hook encapsulating all SRS (Spaced Repetition System) logic.
 */
import { useMemo, useCallback } from 'react'
import { useVocabStore } from '../store/vocabStore'
import { useSettingsStore } from '../store/settingsStore'
import { calculateNextReview, getSRSStatus, getDueWords, getWeeklySchedule } from '../utils/srsAlgorithm'

/**
 * @returns {{
 *   dueWords: Array,
 *   weeklySchedule: Array,
 *   reviewWord: (id: number, quality: number) => void,
 *   getWordStatus: (word: object) => object,
 *   stats: { new: number, learning: number, mastered: number, dueToday: number }
 * }}
 */
export function useSRS() {
  const vocabulary = useVocabStore(s => s.vocabulary)
  const updateSRS = useVocabStore(s => s.updateSRS)
  const recordActivity = useSettingsStore(s => s.recordActivity)

  const dueWords = useMemo(() => getDueWords(vocabulary), [vocabulary])

  const weeklySchedule = useMemo(() => getWeeklySchedule(vocabulary), [vocabulary])

  const stats = useMemo(() => {
    let newCount = 0
    let learning = 0
    let mastered = 0

    vocabulary.forEach(w => {
      const status = getSRSStatus(w.interval)
      if (status === 'new') newCount++
      else if (status === 'learning') learning++
      else mastered++
    })

    return {
      new: newCount,
      learning,
      mastered,
      dueToday: dueWords.length,
    }
  }, [vocabulary, dueWords])

  /**
   * Record a review for a word with the given quality rating.
   * @param {number} id - Vocabulary item id
   * @param {number} quality - 0-5 quality rating
   */
  const reviewWord = useCallback((id, quality) => {
    const word = vocabulary.find(w => w.id === id)
    if (!word) return

    const result = calculateNextReview(
      quality,
      word.repetitions,
      word.interval,
      word.easeFactor || 2.5
    )

    updateSRS(id, result)

    if (quality >= 3) {
      recordActivity('words', 1)
    }
  }, [vocabulary, updateSRS, recordActivity])

  /**
   * Get the display status info for a vocabulary word.
   * @param {object} word
   * @returns {{ status: string, label: string, daysUntilReview: number, color: string }}
   */
  const getWordStatus = useCallback((word) => {
    const status = getSRSStatus(word.interval)
    const now = Date.now()
    const daysUntilReview = Math.max(0, Math.ceil((word.nextReview - now) / 86400000))

    const colorMap = { new: 'var(--secondary)', learning: 'var(--accent)', mastered: 'var(--success)' }
    const labelMap = { new: 'New', learning: 'Learning', mastered: 'Mastered' }

    return {
      status,
      label: labelMap[status],
      daysUntilReview,
      color: colorMap[status],
      isDue: word.nextReview <= now,
    }
  }, [])

  return { dueWords, weeklySchedule, reviewWord, getWordStatus, stats }
}

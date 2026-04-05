/**
 * @fileoverview Zustand store for app settings, study streak, and activity stats.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabaseStorage } from '../lib/supabaseStorage'

/** Format a Date as YYYY-MM-DD */
function toDateKey(date = new Date()) {
  return date.toISOString().split('T')[0]
}

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // ── Settings state ─────────────────────────────────────────────────────
      darkMode: false,
      voiceEnabled: true,
      dailyGoal: 10,
      anthropicApiKey: '',

      // ── Immersion time tracking (seconds per skill) ─────────────────────────
      immersionTime: { shadowing: 0, reading: 0, dictation: 0, journal: 0 },

      // ── Streak tracking ────────────────────────────────────────────────────
      studyStreak: 0,
      lastStudyDate: null,

      // ── Study stats ────────────────────────────────────────────────────────
      studyStats: {
        totalWordsLearned: 0,
        totalNotesCreated: 0,
        totalPracticeCount: 0,
        /** @type {Object<string, number>} date key → activity count */
        dailyActivity: {},
      },

      // ── Actions ────────────────────────────────────────────────────────────

      /** Toggle dark/light mode. */
      toggleDarkMode() {
        set(state => ({ darkMode: !state.darkMode }))
      },

      /**
       * Update arbitrary settings fields.
       * @param {object} updates
       */
      updateSettings(updates) {
        set(state => ({ ...state, ...updates }))
      },

      /**
       * Record a study activity and update counters.
       * @param {'words'|'notes'|'practice'} type
       * @param {number} count
       */
      recordActivity(type, count = 1) {
        const today = toDateKey()
        set(state => {
          const stats = { ...state.studyStats }
          const daily = { ...stats.dailyActivity }
          daily[today] = (daily[today] || 0) + count

          if (type === 'words') stats.totalWordsLearned += count
          else if (type === 'notes') stats.totalNotesCreated += count
          else if (type === 'practice') stats.totalPracticeCount += count

          stats.dailyActivity = daily
          return { studyStats: stats }
        })
        get().updateStreak()
      },

      /**
       * Update study streak based on consecutive daily activity.
       */
      updateStreak() {
        const today = toDateKey()
        const { lastStudyDate, studyStreak } = get()

        if (lastStudyDate === today) return // Already recorded today

        const yesterday = toDateKey(new Date(Date.now() - 86400000))
        const newStreak = lastStudyDate === yesterday ? studyStreak + 1 : 1

        set({ studyStreak: newStreak, lastStudyDate: today })
      },

      /**
       * Reset all study stats and streak.
       */
      setApiKey(key) {
        set({ anthropicApiKey: key })
      },

      recordImmersionTime(skill, seconds) {
        set(state => ({
          immersionTime: {
            ...state.immersionTime,
            [skill]: (state.immersionTime[skill] || 0) + seconds,
          },
        }))
      },

      resetStats() {
        set({
          studyStreak: 0,
          lastStudyDate: null,
          studyStats: {
            totalWordsLearned: 0,
            totalNotesCreated: 0,
            totalPracticeCount: 0,
            dailyActivity: {},
          },
        })
      },
    }),
    {
      name: 'eng-settings-store',
      storage: supabaseStorage,
      version: 1,
    }
  )
)

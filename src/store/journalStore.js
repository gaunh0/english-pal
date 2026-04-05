import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabaseStorage } from '../lib/supabaseStorage'

function toDateKey(date = new Date()) {
  return date.toISOString().split('T')[0]
}

function computeStreak(entries) {
  if (!entries.length) return 0
  const dates = new Set(entries.map(e => e.date))
  const today = toDateKey()
  const yesterday = toDateKey(new Date(Date.now() - 86400000))
  const startOffset = dates.has(today) ? 0 : dates.has(yesterday) ? 1 : null
  if (startOffset === null) return 0

  let streak = 0
  for (let i = startOffset; i < 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if (dates.has(toDateKey(d))) streak++
    else break
  }
  return streak
}

export const useJournalStore = create(
  persist(
    (set, get) => ({
      entries: [],

      addEntry(data) {
        const entry = {
          id: `j-${Date.now()}`,
          date: toDateKey(),
          title: data.title || '',
          content: data.content || '',
          aiReview: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set(state => ({ entries: [entry, ...state.entries] }))
        return entry.id
      },

      updateEntry(id, updates) {
        set(state => ({
          entries: state.entries.map(e =>
            e.id === id ? { ...e, ...updates, updatedAt: Date.now() } : e
          ),
        }))
      },

      deleteEntry(id) {
        set(state => ({ entries: state.entries.filter(e => e.id !== id) }))
      },

      getStreak() {
        return computeStreak(get().entries)
      },

      getTodayEntry() {
        const today = toDateKey()
        return get().entries.find(e => e.date === today) ?? null
      },
    }),
    {
      name: 'eng-journal-store',
      storage: supabaseStorage,
      version: 1,
    }
  )
)

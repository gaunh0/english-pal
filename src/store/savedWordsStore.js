import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabaseStorage } from '../lib/supabaseStorage'

export const useSavedWordsStore = create(
  persist(
    (set, get) => ({
      words: [],

      addWord(wordData) {
        const exists = get().words.some(w => w.term.toLowerCase() === wordData.term.toLowerCase())
        if (exists) return false
        set(state => ({
          words: [
            {
              id: `w-${Date.now()}`,
              addedAt: Date.now(),
              srsData: { easeFactor: 2.5, interval: 1, nextReview: Date.now(), repetitions: 0 },
              ...wordData,
            },
            ...state.words,
          ],
        }))
        return true
      },

      removeWord(id) {
        set(state => ({ words: state.words.filter(w => w.id !== id) }))
      },

      updateSRS(id, srsData) {
        set(state => ({
          words: state.words.map(w =>
            w.id === id ? { ...w, srsData: { ...w.srsData, ...srsData } } : w
          ),
        }))
      },

      hasTerm(term) {
        return get().words.some(w => w.term.toLowerCase() === term.toLowerCase())
      },
    }),
    {
      name: 'eng-saved-words-store',
      storage: supabaseStorage,
      version: 1,
    }
  )
)

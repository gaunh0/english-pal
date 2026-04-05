import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { supabaseStorage } from '../lib/supabaseStorage'

export const useVocabStore = create(
  persist(
    (set, get) => ({
      vocabulary: [],
      favorites: [],
      srsProgress: {},
      loading: true,
      error: null,

      async fetchVocabulary() {
        set({ loading: true, error: null })
        const { data, error } = await supabase.from('vocabulary').select('*').order('id')
        if (error || !data?.length) {
          set({ loading: false, error: error?.message ?? 'Failed to load vocabulary' })
          return
        }
        const progress = get().srsProgress
        const merged = data.map(w => ({
          easeFactor: 2.5,
          interval: 1,
          nextReview: Date.now(),
          repetitions: 0,
          practiceCount: 0,
          ...(progress[w.id] ?? {}),
          ...w,
        }))
        set({ vocabulary: merged, loading: false })
      },

      updateSRS(id, srsUpdate) {
        set(state => {
          const newProgress = {
            ...state.srsProgress,
            [id]: { ...(state.srsProgress[id] ?? {}), ...srsUpdate },
          }
          const newVocabulary = state.vocabulary.map(w =>
            w.id === id ? { ...w, ...srsUpdate } : w
          )
          return { srsProgress: newProgress, vocabulary: newVocabulary }
        })
      },

      toggleFavorite(id) {
        set(state => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter(f => f !== id)
            : [...state.favorites, id],
        }))
      },

      incrementPractice(id) {
        set(state => {
          const current = state.srsProgress[id] ?? {}
          const newCount = (current.practiceCount ?? 0) + 1
          const newProgress = {
            ...state.srsProgress,
            [id]: { ...current, practiceCount: newCount },
          }
          const newVocabulary = state.vocabulary.map(w =>
            w.id === id ? { ...w, practiceCount: newCount } : w
          )
          return { srsProgress: newProgress, vocabulary: newVocabulary }
        })
      },

      async addVocabWord({ term, meaning, example }) {
        const { data, error } = await supabase
          .from('vocabulary')
          .insert({ term, meaning: meaning || '', example: example || null, category: 'general' })
          .select()
          .single()
        if (error || !data) return false
        set(state => ({
          vocabulary: [
            ...state.vocabulary,
            {
              easeFactor: 2.5, interval: 1, nextReview: Date.now(),
              repetitions: 0, practiceCount: 0, ...data,
            },
          ],
        }))
        return true
      },

      hasTerm(term) {
        return get().vocabulary.some(w => w.term.toLowerCase() === term.toLowerCase())
      },

      updateVocab(id, updates) {
        set(state => ({
          vocabulary: state.vocabulary.map(w =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }))
      },

      resetProgress() {
        set(state => {
          const merged = state.vocabulary.map(w => ({
            ...w,
            easeFactor: 2.5,
            interval: 1,
            nextReview: Date.now(),
            repetitions: 0,
            practiceCount: 0,
          }))
          return { srsProgress: {}, vocabulary: merged, favorites: [] }
        })
      },

      getWord(id) {
        return get().vocabulary.find(w => w.id === id)
      },

      isFavorite(id) {
        return get().favorites.includes(id)
      },
    }),
    {
      name: 'eng-vocab-store',
      storage: supabaseStorage,
      version: 1,
      partialize: state => ({ favorites: state.favorites, srsProgress: state.srsProgress }),
    }
  )
)

/**
 * @fileoverview Zustand store for vocabulary data with SRS state and favorites.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { VOCABULARY } from '../utils/constants'

export const useVocabStore = create(
  persist(
    (set, get) => ({
      /** @type {Array} Full vocabulary list with SRS fields */
      vocabulary: VOCABULARY.map(w => ({ ...w, easeFactor: 2.5 })),

      /** @type {number[]} Array of favorite vocabulary IDs */
      favorites: [],

      // ── Actions ────────────────────────────────────────────────────────────

      /**
       * Update SRS fields for a single vocabulary item.
       * @param {number} id
       * @param {{ interval, repetitions, easeFactor, nextReview }} srsUpdate
       */
      updateSRS(id, srsUpdate) {
        set(state => ({
          vocabulary: state.vocabulary.map(w =>
            w.id === id ? { ...w, ...srsUpdate } : w
          ),
        }))
      },

      /**
       * Toggle a word in the favorites list.
       * @param {number} id
       */
      toggleFavorite(id) {
        set(state => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter(f => f !== id)
            : [...state.favorites, id],
        }))
      },

      /**
       * Increment the practice count for a word.
       * @param {number} id
       */
      incrementPractice(id) {
        set(state => ({
          vocabulary: state.vocabulary.map(w =>
            w.id === id ? { ...w, practiceCount: (w.practiceCount || 0) + 1 } : w
          ),
        }))
      },

      /**
       * Update arbitrary fields on a vocabulary item.
       * @param {number} id
       * @param {object} updates
       */
      updateVocab(id, updates) {
        set(state => ({
          vocabulary: state.vocabulary.map(w =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }))
      },

      /**
       * Reset all SRS progress for all vocabulary items.
       */
      resetProgress() {
        set({
          vocabulary: VOCABULARY.map(w => ({
            ...w,
            easeFactor: 2.5,
            interval: 1,
            nextReview: Date.now(),
            repetitions: 0,
            practiceCount: 0,
          })),
          favorites: [],
        })
      },

      // ── Selectors ──────────────────────────────────────────────────────────

      /** Get a single word by id. */
      getWord(id) {
        return get().vocabulary.find(w => w.id === id)
      },

      /** Check if a word is in favorites. */
      isFavorite(id) {
        return get().favorites.includes(id)
      },
    }),
    {
      name: 'eng-vocab-store',
      version: 1,
    }
  )
)

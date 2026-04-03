/**
 * @fileoverview Zustand store for user notes with CRUD operations.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export const useNotesStore = create(
  persist(
    (set, get) => ({
      /** @type {Array<{ id, term, definition, example, personal, category, createdAt, updatedAt }>} */
      notes: [],

      // ── Actions ────────────────────────────────────────────────────────────

      /**
       * Add a new note.
       * @param {{ term, definition, example?, personal?, category? }} noteData
       * @returns {string} The new note's id
       */
      addNote(noteData) {
        const now = Date.now()
        const note = {
          id: uuidv4(),
          term: noteData.term || '',
          definition: noteData.definition || '',
          example: noteData.example || '',
          personal: noteData.personal || '',
          category: noteData.category || 'general',
          createdAt: now,
          updatedAt: now,
        }
        set(state => ({ notes: [note, ...state.notes] }))
        return note.id
      },

      /**
       * Update an existing note by id.
       * @param {string} id
       * @param {object} updates
       */
      updateNote(id, updates) {
        set(state => ({
          notes: state.notes.map(n =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          ),
        }))
      },

      /**
       * Delete a note by id.
       * @param {string} id
       */
      deleteNote(id) {
        set(state => ({ notes: state.notes.filter(n => n.id !== id) }))
      },

      /**
       * Check if a note for a given term already exists.
       * @param {string} term
       * @returns {boolean}
       */
      hasNote(term) {
        return get().notes.some(
          n => n.term.toLowerCase() === term.toLowerCase()
        )
      },
    }),
    {
      name: 'eng-notes-store',
      version: 1,
    }
  )
)

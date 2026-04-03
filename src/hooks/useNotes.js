/**
 * @fileoverview Hook for note-taking CRUD operations and search.
 */
import { useState, useMemo, useCallback } from 'react'
import { useNotesStore } from '../store/notesStore'
import { useSettingsStore } from '../store/settingsStore'

/**
 * @returns {{
 *   notes: Array,
 *   filteredNotes: Array,
 *   searchQuery: string,
 *   setSearchQuery: function,
 *   addNote: function,
 *   updateNote: function,
 *   deleteNote: function,
 *   hasNote: function
 * }}
 */
export function useNotes() {
  const notes = useNotesStore(s => s.notes)
  const addNoteToStore = useNotesStore(s => s.addNote)
  const updateNoteInStore = useNotesStore(s => s.updateNote)
  const deleteNoteFromStore = useNotesStore(s => s.deleteNote)
  const hasNote = useNotesStore(s => s.hasNote)
  const recordActivity = useSettingsStore(s => s.recordActivity)

  const [searchQuery, setSearchQuery] = useState('')

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes
    const q = searchQuery.toLowerCase().trim()
    return notes.filter(
      n =>
        n.term.toLowerCase().includes(q) ||
        n.definition.toLowerCase().includes(q) ||
        n.example.toLowerCase().includes(q)
    )
  }, [notes, searchQuery])

  const addNote = useCallback((noteData) => {
    const id = addNoteToStore(noteData)
    recordActivity('notes', 1)
    return id
  }, [addNoteToStore, recordActivity])

  const updateNote = useCallback((id, updates) => {
    updateNoteInStore(id, updates)
  }, [updateNoteInStore])

  const deleteNote = useCallback((id) => {
    deleteNoteFromStore(id)
  }, [deleteNoteFromStore])

  return {
    notes,
    filteredNotes,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    hasNote,
  }
}

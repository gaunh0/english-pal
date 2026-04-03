import React, { useState } from 'react'
import { useNotes } from '../../hooks/useNotes'
import { useToast } from '../Common/Toast'
import Modal from '../Common/Modal'
import NoteForm from './NoteForm'
import NotesList from './NotesList'
import './Notes.css'

/** Notes management view — orchestrates list, form modal, and search. */
export default function NotesManager() {
  const { filteredNotes, searchQuery, setSearchQuery, addNote, updateNote, deleteNote } = useNotes()
  const { showToast, Toasts } = useToast()

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  const openAdd = () => { setEditingNote(null); setModalOpen(true) }
  const openEdit = (note) => { setEditingNote(note); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingNote(null) }

  const handleSubmit = (data) => {
    if (editingNote) {
      updateNote(editingNote.id, data)
      showToast('Note updated', 'success')
    } else {
      addNote(data)
      showToast('Note saved', 'success')
    }
    closeModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) {
      deleteNote(id)
      showToast('Note deleted', 'info')
    }
  }

  return (
    <div className="notes-manager">
      <Toasts />

      <div className="notes-header">
        <div>
          <h2 className="section-title">My Notes</h2>
          <p className="section-subtitle">{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Note
        </button>
      </div>

      <div className="notes-search search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="input"
          placeholder="Search notes…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <NotesList
        notes={filteredNotes}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingNote ? 'Edit Note' : 'Add Note'}
        size="md"
      >
        <NoteForm
          initialData={editingNote ?? {}}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  )
}

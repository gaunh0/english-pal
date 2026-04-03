import React from 'react'
import './Notes.css'

/** Format a timestamp as a readable string */
const fmt = (ts) =>
  new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })

/**
 * @param {{ notes: Array, onEdit: function, onDelete: function }} props
 */
export default function NotesList({ notes, onEdit, onDelete }) {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3>No notes yet</h3>
        <p>Click "Add Note" or use the Vocab browser to create your first note.</p>
      </div>
    )
  }

  return (
    <div className="notes-list">
      {notes.map(note => (
        <div key={note.id} className="note-card animate-fade">
          <div className="note-card-header">
            <span className="note-card-term">{note.term}</span>
            <div className="note-card-actions">
              <span className={`badge badge-${note.category}`}>
                {note.category === 'iot' ? 'IoT' : 'IT'}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onEdit(note)}
                title="Edit note"
                aria-label="Edit"
              >
                ✏️
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onDelete(note.id)}
                title="Delete note"
                aria-label="Delete"
                style={{ color: 'var(--danger)' }}
              >
                🗑
              </button>
            </div>
          </div>

          <p className="note-card-definition">{note.definition}</p>

          {note.example && (
            <p className="note-card-example">"{note.example}"</p>
          )}

          {note.personal && (
            <p className="note-card-personal">💡 {note.personal}</p>
          )}

          <div className="note-card-meta">
            <span>Created {fmt(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && (
              <span>Updated {fmt(note.updatedAt)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

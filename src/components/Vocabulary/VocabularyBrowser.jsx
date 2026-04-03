import React, { useState } from 'react'
import { useVocabulary } from '../../hooks/useVocabulary'
import VocabularyCard from './VocabularyCard'
import Modal from '../Common/Modal'
import NoteForm from '../Notes/NoteForm'
import { useNotes } from '../../hooks/useNotes'
import { useToast } from '../Common/Toast'
import './Vocabulary.css'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General IT' },
  { value: 'iot', label: 'IoT / Embedded' },
]

const SORTS = [
  { value: 'alpha', label: 'A–Z' },
  { value: 'srs', label: 'SRS Level' },
  { value: 'due', label: 'Due Date' },
]

/** Main vocabulary browsing view with search, filters, and card grid. */
export default function VocabularyBrowser() {
  const {
    filtered, search, setSearch, category, setCategory,
    sortBy, setSortBy, showFavorites, setShowFavorites,
  } = useVocabulary()

  const { addNote } = useNotes()
  const { showToast, Toasts } = useToast()
  const [noteWord, setNoteWord] = useState(null)
  const [reviewWord, setReviewWord] = useState(null)

  const handleAddNote = (word) => setNoteWord(word)
  const handleReview = (word) => setReviewWord(word)

  const handleNoteSubmit = (data) => {
    addNote(data)
    showToast(`Note saved for "${data.term}"`, 'success')
    setNoteWord(null)
  }

  return (
    <div className="vocabulary-browser">
      <Toasts />

      <div className="vocab-toolbar">
        <div className="vocab-toolbar-row">
          <div className="search-wrapper" style={{ flex: 1, maxWidth: 360 }}>
            <span className="search-icon">🔍</span>
            <input
              className="input"
              placeholder="Search terms or meanings…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`vocab-fav-btn${showFavorites ? ' active' : ''}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? '❤️ Favorites' : '🤍 All'}
          </button>
          <span className="vocab-count">{filtered.length} words</span>
        </div>

        <div className="vocab-toolbar-row">
          <div className="filter-group">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                className={`filter-btn${category === c.value ? ' active' : ''}`}
                onClick={() => setCategory(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="filter-group" style={{ marginLeft: 'auto' }}>
            {SORTS.map(s => (
              <button
                key={s.value}
                className={`filter-btn${sortBy === s.value ? ' active' : ''}`}
                onClick={() => setSortBy(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No words found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="vocab-grid">
          {filtered.map(word => (
            <VocabularyCard
              key={word.id}
              word={word}
              onAddNote={handleAddNote}
              onReview={handleReview}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!noteWord}
        onClose={() => setNoteWord(null)}
        title={`Add Note — ${noteWord?.term}`}
        size="md"
      >
        {noteWord && (
          <NoteForm
            initialData={{ term: noteWord.term, definition: noteWord.meaning, example: noteWord.example, category: noteWord.category }}
            onSubmit={handleNoteSubmit}
            onCancel={() => setNoteWord(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!reviewWord}
        onClose={() => setReviewWord(null)}
        title={reviewWord?.term}
        size="sm"
      >
        {reviewWord && (
          <div>
            <p style={{ marginBottom: 12 }}>{reviewWord.meaning}</p>
            {reviewWord.example && (
              <p className="vocab-card-example">{reviewWord.example}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

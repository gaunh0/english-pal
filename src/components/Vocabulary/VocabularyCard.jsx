import React from 'react'
import { useSRS } from '../../hooks/useSRS'
import { useVocabStore } from '../../store/vocabStore'
import './Vocabulary.css'

/**
 * @param {{ word: object, onAddNote: function, onReview: function }} props
 */
export default function VocabularyCard({ word, onAddNote, onReview }) {
  const { getWordStatus } = useSRS()
  const favorites = useVocabStore(s => s.favorites)
  const toggleFavorite = useVocabStore(s => s.toggleFavorite)

  const { label: statusLabel, isDue } = getWordStatus(word)
  const isFav = favorites.includes(word.id)
  const statusClass = `badge-${isDue ? 'new' : getWordStatus(word).status}`

  const nextReviewText = (() => {
    const diff = word.nextReview - Date.now()
    if (diff <= 0) return 'Due now'
    const days = Math.ceil(diff / 86400000)
    return `In ${days}d`
  })()

  return (
    <div className="vocab-card">
      <div className="vocab-card-header">
        <span className="vocab-card-term">{word.term}</span>
        <div className="vocab-card-badges">
          <span className={`badge badge-${word.category}`}>
            {word.category === 'iot' ? 'IoT' : 'IT'}
          </span>
          <span className={`badge ${statusClass}`}>{statusLabel}</span>
        </div>
      </div>

      <p className="vocab-card-meaning">{word.meaning}</p>

      {word.example && (
        <p className="vocab-card-example">{word.example}</p>
      )}

      <div className="vocab-card-footer">
        <button
          className={`btn btn-ghost btn-sm btn-icon`}
          onClick={() => toggleFavorite(word.id)}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? '❤️' : '🤍'}
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onAddNote(word)}
          title="Add to notes"
        >
          + Note
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onReview(word)}
          title="Quick review"
        >
          Review
        </button>

        <span className="vocab-card-due">{nextReviewText}</span>
      </div>
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import { useVocabStore } from '../../store/vocabStore'
import { useSRS } from '../../hooks/useSRS'
import { getSRSStatus } from '../../utils/srsAlgorithm'
import Flashcard from './Flashcard'
import './Flashcard.css'

const FILTERS = [
  { value: 'all',      label: 'All' },
  { value: 'new',      label: 'New' },
  { value: 'learning', label: 'Learning' },
  { value: 'mastered', label: 'Mastered' },
  { value: 'due',      label: 'Due' },
]

/** Full flashcard study session with filter, navigation, and SRS rating. */
export default function FlashcardMode() {
  const vocabulary = useVocabStore(s => s.vocabulary)
  const { reviewWord, dueWords } = useSRS()

  const [filter, setFilter] = useState('all')
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const deck = useMemo(() => {
    if (filter === 'due') return dueWords
    if (filter === 'all') return vocabulary
    return vocabulary.filter(w => getSRSStatus(w.interval) === filter)
  }, [vocabulary, dueWords, filter])

  const currentWord = deck[index] ?? null
  const total = deck.length

  const handleRate = (quality) => {
    if (currentWord) {
      reviewWord(currentWord.id, quality)
      if (index < total - 1) setIndex(i => i + 1)
      else setIndex(0)
    }
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setIndex(i => Math.max(0, i - 1))
  }

  const handleNext = () => {
    setIsFlipped(false)
    setIndex(i => Math.min(total - 1, i + 1))
  }

  const handleFilterChange = (val) => {
    setFilter(val)
    setIndex(0)
    setIsFlipped(false)
  }

  return (
    <div className="flashcard-mode">
      <div className="flashcard-controls">
        <div className="filter-group">
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-btn${filter === f.value ? ' active' : ''}`}
              onClick={() => handleFilterChange(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {total > 0 && (
          <span className="flashcard-counter">
            {index + 1} / {total}
          </span>
        )}
      </div>

      {total > 0 && (
        <div className="flashcard-progress">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {currentWord ? (
        <>
          <Flashcard
            word={currentWord}
            onRate={handleRate}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />

          <div className="flashcard-nav">
            <button
              className="btn btn-secondary"
              onClick={handlePrev}
              disabled={index === 0}
            >
              ← Prev
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => { setIsFlipped(false); setIndex(0); }}
            >
              ↺ Restart
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={index === total - 1}
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🃏</div>
          <h3>No cards in this deck</h3>
          <p>Try a different filter or study more words first.</p>
        </div>
      )}
    </div>
  )
}

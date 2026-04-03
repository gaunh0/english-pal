import React from 'react'
import './Flashcard.css'

const RATINGS = [
  { quality: 0, label: 'Again', sub: 'Forgot', cls: 'rating-again' },
  { quality: 2, label: 'Hard',  sub: 'Hard',   cls: 'rating-hard'  },
  { quality: 4, label: 'Good',  sub: 'Good',   cls: 'rating-good'  },
  { quality: 5, label: 'Easy',  sub: 'Easy',   cls: 'rating-easy'  },
]

/**
 * @param {{ word: object, onRate: function, isFlipped: boolean, setIsFlipped: function }} props
 */
export default function Flashcard({ word, onRate, isFlipped, setIsFlipped }) {
  if (!word) return null

  const handleRate = (quality) => {
    onRate(quality)
    setIsFlipped(false)
  }

  return (
    <>
      <div
        className="flashcard-wrap"
        onClick={() => !isFlipped && setIsFlipped(true)}
        role="button"
        aria-label={isFlipped ? 'Flashcard back' : 'Click to flip'}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && !isFlipped && setIsFlipped(true)}
      >
        <div className={`flashcard-inner${isFlipped ? ' flipped' : ''}`}>
          {/* Front */}
          <div className="flashcard-face flashcard-front-face">
            <div className={`badge badge-${word.category}`}>
              {word.category === 'iot' ? 'IoT' : 'General IT'}
            </div>
            <div className="flashcard-term">{word.term}</div>
            <div className="flashcard-hint">Click to reveal meaning</div>
          </div>

          {/* Back */}
          <div className="flashcard-face flashcard-back-face">
            <div className="flashcard-meaning">{word.meaning}</div>
            {word.example && (
              <div className="flashcard-example">{word.example}</div>
            )}
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="flashcard-rating">
          {RATINGS.map(r => (
            <button
              key={r.quality}
              className={`rating-btn ${r.cls}`}
              onClick={() => handleRate(r.quality)}
            >
              {r.label}
              <span className="rating-btn-label">{r.sub}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

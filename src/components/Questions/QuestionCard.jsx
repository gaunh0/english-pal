import React, { useState } from 'react'
import { useNotes } from '../../hooks/useNotes'
import { useToast } from '../Common/Toast'
import './Questions.css'

const CATEGORY_LABELS = {
  behavioral: 'Behavioral',
  technical:  'Technical',
  iot:        'IoT',
}

/**
 * @param {{ question: object, index: number }} props
 */
export default function QuestionCard({ question, index }) {
  const [isOpen, setIsOpen] = useState(false)
  const { addNote } = useNotes()
  const { showToast, Toasts } = useToast()

  const handleSaveNote = () => {
    addNote({
      term: `Q: ${question.question}`,
      definition: question.answer,
      category: question.category === 'iot' ? 'iot' : 'general',
    })
    showToast('Saved to notes!', 'success')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question.answer)
      showToast('Answer copied!', 'success')
    } catch {
      showToast('Copy failed — please select and copy manually.', 'error')
    }
  }

  return (
    <div className="question-card">
      <Toasts />
      <div
        className="question-card-header"
        onClick={() => setIsOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setIsOpen(o => !o)}
        aria-expanded={isOpen}
      >
        <div className="question-number">{index + 1}</div>
        <span className="question-text">{question.question}</span>
        <span className={`badge badge-${question.category}`}>
          {CATEGORY_LABELS[question.category]}
        </span>
        <span className={`question-chevron${isOpen ? ' open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="question-answer">
          <p>{question.answer}</p>
          <div className="question-answer-actions">
            <button className="btn btn-secondary btn-sm" onClick={handleSaveNote}>
              📝 Save to Notes
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              📋 Copy Answer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

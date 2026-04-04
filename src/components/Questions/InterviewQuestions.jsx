import React, { useState, useMemo } from 'react'
import { useInterviewQuestions } from '../../hooks/useInterviewQuestions'
import QuestionCard from './QuestionCard'
import './Questions.css'

const CATEGORY_FILTERS = [
  { value: 'all',        label: 'All' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'technical',  label: 'Technical' },
  { value: 'iot',        label: 'IoT' },
]

export default function InterviewQuestions() {
  const { questions, loading } = useInterviewQuestions()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = questions
    if (category !== 'all') result = result.filter(q => q.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(item =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      )
    }
    return result
  }, [questions, category, search])

  return (
    <div className="interview-questions">
      <div className="section-header">
        <div>
          <h2 className="section-title">Interview Q&amp;A</h2>
          <p className="section-subtitle">
            {loading ? 'Loading…' : `${filtered.length} question${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="questions-toolbar">
        <div className="search-wrapper" style={{ flex: 1, maxWidth: 360 }}>
          <span className="search-icon">🔍</span>
          <input
            className="input"
            placeholder="Search questions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-btn${category === f.value ? ' active' : ''}`}
              onClick={() => setCategory(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <h3>Loading questions…</h3>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💬</div>
          <h3>No questions found</h3>
          <p>Try a different filter or search term.</p>
        </div>
      ) : (
        filtered.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i} />
        ))
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journalStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useImmersionTimer } from '../../hooks/useImmersionTimer'
import './Journal.css'

function toDateKey(date = new Date()) {
  return date.toISOString().split('T')[0]
}

async function reviewWithClaude(text, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are a friendly English writing coach reviewing a journal entry by an English learner. Be encouraging and specific.

Provide your review in this format:
**Overall:** (1-2 sentence assessment)

**Grammar fixes:**
- (list specific corrections, or "No issues found!")

**Style suggestions:**
- (word choice, sentence variety, connectors)

**Vocabulary upgrades:**
- (suggest more advanced alternatives for simple words)

Text to review:
---
${text}
---`,
      }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${res.status}`)
  }
  const data = await res.json()
  return data.content[0].text
}

export default function WritingJournal() {
  useImmersionTimer('journal')
  const { entries, addEntry, updateEntry, deleteEntry, getStreak } = useJournalStore()
  const { anthropicApiKey } = useSettingsStore()

  const [selectedId, setSelectedId] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [dirty, setDirty] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [showReview, setShowReview] = useState(false)
  const [localReview, setLocalReview] = useState('')

  const streak = getStreak()
  const today = toDateKey()

  // Load today's entry by default on mount
  useEffect(() => {
    const todayEntry = entries.find(e => e.date === today)
    if (todayEntry) {
      setSelectedId(todayEntry.id)
      setTitle(todayEntry.title)
      setContent(todayEntry.content)
    }
  }, []) // eslint-disable-line

  function selectEntry(entry) {
    if (dirty && !confirm('You have unsaved changes. Discard?')) return
    setSelectedId(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
    setDirty(false)
    setShowReview(false)
    setReviewError('')
    setLocalReview('')
  }

  function newEntry() {
    if (dirty && !confirm('You have unsaved changes. Discard?')) return
    setSelectedId(null)
    setTitle('')
    setContent('')
    setDirty(false)
    setShowReview(false)
    setReviewError('')
    setLocalReview('')
  }

  function handleSave() {
    if (!content.trim()) return
    if (selectedId) {
      updateEntry(selectedId, { title, content })
    } else {
      const id = addEntry({ title, content })
      setSelectedId(id)
    }
    setDirty(false)
  }

  async function handleAiReview() {
    if (!anthropicApiKey) {
      setReviewError('No API key. Add your Anthropic API key in Settings.')
      return
    }
    if (!content.trim()) return
    setReviewing(true)
    setReviewError('')
    try {
      const review = await reviewWithClaude(content, anthropicApiKey)
      setLocalReview(review)
      if (selectedId) {
        updateEntry(selectedId, { aiReview: review })
      }
      setShowReview(true)
    } catch (e) {
      setReviewError(e.message)
    } finally {
      setReviewing(false)
    }
  }

  const selectedEntry = entries.find(e => e.id === selectedId)
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  // Group entries by month
  const grouped = entries.reduce((acc, e) => {
    const month = e.date.slice(0, 7)
    if (!acc[month]) acc[month] = []
    acc[month].push(e)
    return acc
  }, {})

  return (
    <div className="journal-view">
      {/* Sidebar */}
      <aside className="journal-sidebar">
        <div className="journal-sidebar-header">
          <div>
            <h3>Journal</h3>
            {streak > 0 && (
              <div className="journal-streak">
                <span>🔥</span> {streak}-day streak
              </div>
            )}
          </div>
          <button className="btn btn-primary btn-sm" onClick={newEntry}>+ New</button>
        </div>

        {!entries.length && (
          <p className="text-muted text-sm" style={{ padding: '16px 0' }}>No entries yet. Write your first one!</p>
        )}

        {Object.entries(grouped)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([month, monthEntries]) => (
            <div key={month} className="journal-month-group">
              <div className="journal-month-label">{new Date(month + '-02').toLocaleDateString('en', { month: 'long', year: 'numeric' })}</div>
              {monthEntries.map(e => (
                <button
                  key={e.id}
                  className={`journal-entry-item${selectedId === e.id ? ' active' : ''}`}
                  onClick={() => selectEntry(e)}
                >
                  <div className="journal-entry-date">{e.date}</div>
                  <div className="journal-entry-title">{e.title || '(untitled)'}</div>
                  <div className="journal-entry-preview">{e.content.slice(0, 60)}…</div>
                </button>
              ))}
            </div>
          ))}
      </aside>

      {/* Editor */}
      <main className="journal-editor">
        <div className="journal-editor-meta">
          <span className="text-sm text-muted">{selectedEntry ? selectedEntry.date : today}</span>
          <span className="text-sm text-muted">{wordCount} words</span>
        </div>

        <input
          className="journal-title-input"
          placeholder="Title (optional)"
          value={title}
          onChange={e => { setTitle(e.target.value); setDirty(true) }}
        />

        <textarea
          className="journal-content-input"
          placeholder="Write about your day, what you learned, how you feel… in English."
          value={content}
          onChange={e => { setContent(e.target.value); setDirty(true) }}
        />

        <div className="journal-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={!content.trim() || !dirty}>
            {dirty ? 'Save' : 'Saved ✓'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleAiReview}
            disabled={reviewing || !content.trim()}
          >
            {reviewing ? 'Reviewing…' : '✨ AI Review'}
          </button>
          {selectedId && (
            <button
              className="btn btn-ghost"
              onClick={() => { if (confirm('Delete this entry?')) { deleteEntry(selectedId); newEntry() } }}
            >
              🗑
            </button>
          )}
        </div>

        {reviewError && (
          <div className="journal-review-error">
            {reviewError}
          </div>
        )}

        {/* AI Review panel */}
        {(showReview || selectedEntry?.aiReview) && (
          <div className="journal-review-panel">
            <div className="journal-review-header">
              <span>✨ AI Review</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowReview(false)}>✕</button>
            </div>
            <div className="journal-review-content">
              {(selectedEntry?.aiReview || localReview || '').split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={i} className="journal-review-heading">{line.replace(/\*\*/g, '')}</p>
                }
                if (line.startsWith('- ')) {
                  return <p key={i} className="journal-review-bullet">• {line.slice(2)}</p>
                }
                return line.trim() ? <p key={i}>{line}</p> : null
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

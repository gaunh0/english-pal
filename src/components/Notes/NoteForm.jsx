import React, { useState } from 'react'
import './Notes.css'

/**
 * @param {{ initialData?: object, onSubmit: function, onCancel: function }} props
 */
export default function NoteForm({ initialData = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    term:       initialData.term       || '',
    definition: initialData.definition || '',
    example:    initialData.example    || '',
    personal:   initialData.personal   || '',
    category:   initialData.category   || 'general',
  })
  const [errors, setErrors] = useState({})

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.term.trim())       errs.term       = 'Term is required'
    if (!form.definition.trim()) errs.definition = 'Definition is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({ ...form, term: form.term.trim(), definition: form.definition.trim() })
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Term *</label>
        <input
          className={`input${errors.term ? ' input-error' : ''}`}
          value={form.term}
          onChange={update('term')}
          placeholder="e.g. Algorithm"
          autoFocus
        />
        {errors.term && <span className="text-danger text-xs">{errors.term}</span>}
      </div>

      <div className="form-group">
        <label>Definition *</label>
        <textarea
          className={`input${errors.definition ? ' input-error' : ''}`}
          value={form.definition}
          onChange={update('definition')}
          placeholder="What does it mean?"
          rows={3}
        />
        {errors.definition && <span className="text-danger text-xs">{errors.definition}</span>}
      </div>

      <div className="form-group">
        <label>Example sentence</label>
        <textarea
          className="input"
          value={form.example}
          onChange={update('example')}
          placeholder="Use it in a sentence…"
          rows={2}
        />
      </div>

      <div className="form-group">
        <label>Memory trick / personal note</label>
        <textarea
          className="input"
          value={form.personal}
          onChange={update('personal')}
          placeholder="How will you remember this?"
          rows={2}
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select className="input" value={form.category} onChange={update('category')}>
          <option value="general">General IT</option>
          <option value="iot">IoT / Embedded</option>
        </select>
      </div>

      <div className="note-form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Note
        </button>
      </div>
    </form>
  )
}

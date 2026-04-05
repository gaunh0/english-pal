import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSavedWordsStore } from '../../store/savedWordsStore'
import { useVocabStore } from '../../store/vocabStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useImmersionTimer } from '../../hooks/useImmersionTimer'
import './Reading.css'

async function fetchDefinition(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return null
    const data = await res.json()
    const entry = data[0]
    return {
      phonetic: entry.phonetic || entry.phonetics?.find(p => p.text)?.text || '',
      audioUrl: entry.phonetics?.find(p => p.audio)?.audio || '',
      meanings: (entry.meanings || []).slice(0, 3).map(m => ({
        pos: m.partOfSpeech,
        definition: m.definitions?.[0]?.definition || '',
        example: m.definitions?.[0]?.example || '',
      })),
    }
  } catch {
    return null
  }
}

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function WordToken({ word, clean, onClickWord }) {
  const isWord = /[a-zA-Z]/.test(clean)
  if (!isWord) return <span>{word}</span>
  return (
    <span
      className="reading-word"
      onClick={e => onClickWord(clean, e)}
    >
      {word}
    </span>
  )
}

export default function ReadingPractice() {
  useImmersionTimer('reading')
  const { words: savedWords, addWord, removeWord } = useSavedWordsStore()
  const addVocabWord = useVocabStore(s => s.addVocabWord)
  const vocabHasTerm = useVocabStore(s => s.hasTerm)
  const recordActivity = useSettingsStore(s => s.recordActivity)

  const [tab, setTab] = useState('read') // 'read' | 'saved'
  const [inputMode, setInputMode] = useState('paste') // 'paste' | 'url'
  const [rawInput, setRawInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Timer
  const [timerSecs, setTimerSecs] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const timerRef = useRef(null)

  // Word popup
  const [popup, setPopup] = useState(null) // { word, x, y, def, loading }
  const popupRef = useRef(null)

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive])

  // Close popup on outside click
  useEffect(() => {
    function handler(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopup(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function loadText() {
    const t = rawInput.trim()
    if (!t) return
    setText(t)
    setTimerSecs(0)
    setTimerActive(true)
    recordActivity('practice', 1)
  }

  async function fetchUrl() {
    if (!urlInput.trim()) return
    setLoading(true)
    setError('')
    try {
      const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(urlInput)}`
      const res = await fetch(proxy, { signal: AbortSignal.timeout(10000) })
      const json = await res.json()
      // Strip HTML tags roughly
      const el = document.createElement('div')
      el.innerHTML = json.contents
      // Remove script/style
      el.querySelectorAll('script,style,nav,header,footer,aside').forEach(n => n.remove())
      const extracted = (el.innerText || el.textContent || '').replace(/\s{3,}/g, '\n\n').trim()
      if (!extracted) throw new Error('Could not extract text')
      setText(extracted)
      setTimerSecs(0)
      setTimerActive(true)
      recordActivity('practice', 1)
    } catch (e) {
      setError('Failed to fetch URL. Try pasting the text directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleWordClick = useCallback(async (word, e) => {
    if (!word || word.length < 2) return
    const rect = e.target.getBoundingClientRect()
    const x = Math.min(rect.left + window.scrollX, window.innerWidth - 320)
    const y = rect.bottom + window.scrollY + 6

    setPopup({ word, x, y, def: null, defLoading: true })

    const def = await fetchDefinition(word)
    setPopup(p => p?.word === word ? { ...p, def, defLoading: false } : p)
  }, [])

  async function handleSaveWord() {
    if (!popup?.word) return
    const firstMeaning = popup.def?.meanings?.[0]
    // Insert into main Supabase vocab (shows up in SRS/Flashcards)
    const saved = await addVocabWord({
      term: popup.word,
      meaning: firstMeaning?.definition || '',
      example: firstMeaning?.example || '',
    })
    // Also save full definition locally (for Saved Words tab with phonetic/audio)
    addWord({
      term: popup.word,
      phonetic: popup.def?.phonetic || '',
      audioUrl: popup.def?.audioUrl || '',
      meanings: popup.def?.meanings || [],
    })
    if (!saved) alert(`"${popup.word}" is already in your vocabulary.`)
  }

  function playAudio(url) {
    if (!url) return
    new Audio(url.startsWith('//') ? 'https:' + url : url).play().catch(() => {})
  }

  // Render text as tokens
  const tokens = text
    ? text.split(/(\s+|(?=[^a-zA-Z\s])|(?<=[^a-zA-Z\s]))/).filter(Boolean)
    : []

  const wordCount = text ? text.trim().split(/\s+/).filter(w => /[a-zA-Z]/.test(w)).length : 0
  const wpm = timerSecs > 10 ? Math.round(wordCount / (timerSecs / 60)) : 0

  return (
    <div className="reading-view">
      <div className="reading-tabs">
        <button className={`filter-btn${tab === 'read' ? ' active' : ''}`} onClick={() => setTab('read')}>Read</button>
        <button className={`filter-btn${tab === 'saved' ? ' active' : ''}`} onClick={() => setTab('saved')}>
          Saved Words {savedWords.length > 0 && <span className="badge-count">{savedWords.length}</span>}
        </button>
      </div>

      {tab === 'saved' && (
        <div className="reading-saved">
          <h3 className="section-title">Saved Words</h3>
          {!savedWords.length && <p className="text-muted text-center" style={{ padding: 32 }}>No words saved yet. Click words while reading.</p>}
          <div className="reading-saved-list">
            {savedWords.map(w => (
              <div key={w.id} className="card reading-saved-card">
                <div className="reading-saved-term">
                  {w.term}
                  {w.phonetic && <span className="reading-phonetic">{w.phonetic}</span>}
                  {w.audioUrl && (
                    <button className="btn btn-ghost btn-sm" onClick={() => playAudio(w.audioUrl)}>🔊</button>
                  )}
                </div>
                {w.meanings?.slice(0, 2).map((m, i) => (
                  <div key={i} className="reading-saved-meaning">
                    <span className="reading-pos">{m.pos}</span>
                    <span className="text-sm">{m.definition}</span>
                    {m.example && <span className="text-xs text-muted" style={{ fontStyle: 'italic' }}>"{m.example}"</span>}
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end' }} onClick={() => removeWord(w.id)}>✕ Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'read' && (
        <>
          {/* Input section */}
          {!text && (
            <div className="card reading-input-card">
              <h2 className="section-title">Reading Practice</h2>
              <p className="section-subtitle">Load a text, then click any word for its definition. Save unknown words to your vocabulary.</p>

              <div className="reading-mode-tabs">
                <button className={`filter-btn${inputMode === 'paste' ? ' active' : ''}`} onClick={() => setInputMode('paste')}>Paste text</button>
                <button className={`filter-btn${inputMode === 'url' ? ' active' : ''}`} onClick={() => setInputMode('url')}>Fetch from URL</button>
              </div>

              {inputMode === 'paste' && (
                <>
                  <textarea
                    className="input"
                    rows={10}
                    placeholder="Paste any English text here…"
                    value={rawInput}
                    onChange={e => setRawInput(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={loadText} disabled={!rawInput.trim()}>
                    Start Reading
                  </button>
                </>
              )}

              {inputMode === 'url' && (
                <>
                  <div className="reading-url-row">
                    <input
                      className="input"
                      placeholder="https://..."
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && fetchUrl()}
                    />
                    <button className="btn btn-primary" onClick={fetchUrl} disabled={loading}>
                      {loading ? 'Loading…' : 'Fetch'}
                    </button>
                  </div>
                  {error && <p className="text-danger text-sm">{error}</p>}
                </>
              )}
            </div>
          )}

          {/* Reading area */}
          {text && (
            <>
              <div className="reading-toolbar card">
                <div className="reading-stats">
                  <span className="text-sm"><strong>{wordCount}</strong> words</span>
                  <span className="text-sm">⏱ <strong>{formatTime(timerSecs)}</strong></span>
                  {wpm > 0 && <span className="text-sm">~<strong>{wpm}</strong> wpm</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setTimerActive(a => !a)}>
                    {timerActive ? '⏸ Pause' : '▶ Resume'}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setText(''); setTimerActive(false); setTimerSecs(0) }}>
                    ✕ Clear
                  </button>
                </div>
              </div>

              <div className="card reading-text-area">
                <p className="text-xs text-muted" style={{ marginBottom: 12 }}>Click any word to look it up.</p>
                <div className="reading-text">
                  {tokens.map((tok, i) => {
                    const clean = tok.replace(/[^a-zA-Z'-]/g, '')
                    return <WordToken key={i} word={tok} clean={clean} onClickWord={handleWordClick} />
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Word popup */}
      {popup && (
        <div
          ref={popupRef}
          className="reading-popup"
          style={{ top: popup.y, left: popup.x }}
        >
          <div className="reading-popup-header">
            <strong className="reading-popup-word">{popup.word}</strong>
            {popup.def?.phonetic && <span className="reading-phonetic">{popup.def.phonetic}</span>}
            {popup.def?.audioUrl && (
              <button className="btn btn-ghost btn-sm" onClick={() => playAudio(popup.def.audioUrl)}>🔊</button>
            )}
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setPopup(null)}>✕</button>
          </div>

          {popup.defLoading && <p className="text-muted text-sm">Looking up…</p>}
          {!popup.defLoading && !popup.def && <p className="text-muted text-sm">No definition found.</p>}
          {popup.def?.meanings?.map((m, i) => (
            <div key={i} className="reading-popup-meaning">
              <span className="reading-pos">{m.pos}</span>
              <span className="text-sm">{m.definition}</span>
              {m.example && <span className="text-xs text-muted" style={{ fontStyle: 'italic' }}>"{m.example}"</span>}
            </div>
          ))}

          <button
            className={`btn btn-sm ${vocabHasTerm(popup.word) ? 'btn-secondary' : 'btn-success'}`}
            onClick={handleSaveWord}
            disabled={vocabHasTerm(popup.word)}
            style={{ marginTop: 8 }}
          >
            {vocabHasTerm(popup.word) ? '✓ In vocab' : '+ Add to vocab'}
          </button>
        </div>
      )}
    </div>
  )
}

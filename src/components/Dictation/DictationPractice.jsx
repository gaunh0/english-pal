import React, { useState, useRef } from 'react'
import { useImmersionTimer } from '../../hooks/useImmersionTimer'
import './Dictation.css'

function extractVideoId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

function diffWords(original, userInput) {
  const normalize = s => s.toLowerCase().replace(/[^a-z0-9\s']/g, '').trim()
  const origWords = normalize(original).split(/\s+/).filter(Boolean)
  const userWords = normalize(userInput).split(/\s+/).filter(Boolean)

  return origWords.map((word, i) => ({
    word,
    userWord: userWords[i] || '',
    correct: userWords[i] === word,
  }))
}

function computeScore(original, userInput) {
  const diff = diffWords(original, userInput)
  if (!diff.length) return 0
  return Math.round((diff.filter(d => d.correct).length / diff.length) * 100)
}

const SPEEDS = [0.5, 0.75, 1, 1.25]

export default function DictationPractice() {
  useImmersionTimer('dictation')

  const [sourceMode, setSourceMode] = useState('youtube') // 'youtube' | 'file' | 'text'
  const [ytUrl, setYtUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [audioSrc, setAudioSrc] = useState('')
  const [transcript, setTranscript] = useState('')
  const [showTranscript, setShowTranscript] = useState(false)

  const [speed, setSpeed] = useState(1)
  const [userInput, setUserInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [diff, setDiff] = useState([])

  const audioRef = useRef(null)
  const fileInputRef = useRef(null)

  function loadYouTube() {
    const vid = extractVideoId(ytUrl)
    if (!vid) { alert('Invalid YouTube URL'); return }
    setVideoId(vid)
    setUserInput('')
    setSubmitted(false)
    setScore(null)
    setDiff([])
    setShowTranscript(false)
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAudioSrc(url)
    setUserInput('')
    setSubmitted(false)
    setScore(null)
    setDiff([])
    setShowTranscript(false)
  }

  function handleSubmit() {
    if (!transcript.trim()) {
      setSubmitted(true)
      setScore(null)
      setDiff([])
      return
    }
    const s = computeScore(transcript, userInput)
    const d = diffWords(transcript, userInput)
    setScore(s)
    setDiff(d)
    setSubmitted(true)
  }

  function handleReset() {
    setUserInput('')
    setSubmitted(false)
    setScore(null)
    setDiff([])
    setShowTranscript(false)
  }

  const scoreClass = score === null ? '' : score >= 80 ? 'score-good' : score >= 50 ? 'score-ok' : 'score-poor'

  return (
    <div className="dictation-view">
      <div className="card dictation-setup">
        <h2 className="section-title">Dictation Practice</h2>
        <p className="section-subtitle">Listen to audio, type what you hear, then check your accuracy.</p>

        {/* Source mode */}
        <div className="filter-group" style={{ marginTop: 8 }}>
          {['youtube', 'file', 'text'].map(m => (
            <button key={m} className={`filter-btn${sourceMode === m ? ' active' : ''}`} onClick={() => setSourceMode(m)}>
              {m === 'youtube' ? 'YouTube' : m === 'file' ? 'Audio file' : 'TTS text'}
            </button>
          ))}
        </div>

        {/* YouTube */}
        {sourceMode === 'youtube' && (
          <div className="dictation-row">
            <input
              className="input"
              placeholder="https://www.youtube.com/watch?v=..."
              value={ytUrl}
              onChange={e => setYtUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadYouTube()}
            />
            <button className="btn btn-primary" onClick={loadYouTube}>Load</button>
          </div>
        )}

        {/* File */}
        {sourceMode === 'file' && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
              Choose audio file
            </button>
            {audioSrc && <span className="text-sm text-muted">File loaded</span>}
            <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />
          </div>
        )}

        {/* TTS text */}
        {sourceMode === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="text-sm text-muted">Type or paste a passage. Use the "Listen" button to hear it via TTS, then type from memory.</p>
            <textarea
              className="input"
              rows={4}
              placeholder="The quick brown fox jumps over the lazy dog…"
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
            />
            <button
              className="btn btn-secondary"
              onClick={() => transcript && window.speechSynthesis.speak(
                Object.assign(new SpeechSynthesisUtterance(transcript), { rate: speed })
              )}
              disabled={!transcript.trim()}
            >
              🔊 Listen (TTS)
            </button>
          </div>
        )}

        {/* Speed (for file + TTS) */}
        {sourceMode !== 'youtube' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span className="text-sm text-muted">Speed:</span>
            <div className="filter-group">
              {SPEEDS.map(s => (
                <button
                  key={s}
                  className={`filter-btn${speed === s ? ' active' : ''}`}
                  onClick={() => {
                    setSpeed(s)
                    if (audioRef.current) audioRef.current.playbackRate = s
                  }}
                >{s}x</button>
              ))}
            </div>
          </div>
        )}

        {/* Transcript input (for youtube / file modes) */}
        {sourceMode !== 'text' && (
          <div style={{ marginTop: 8 }}>
            <label className="text-sm text-muted">Answer key (optional — paste the correct transcript to get scored):</label>
            <textarea
              className="input"
              rows={3}
              style={{ marginTop: 4 }}
              placeholder="Paste the correct transcript here to enable scoring…"
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Player area */}
      {sourceMode === 'youtube' && videoId && (
        <div className="dictation-yt-wrap card">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0`}
            title="YouTube player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <p className="text-xs text-muted" style={{ marginTop: 8 }}>
            Listen carefully — the transcript is hidden below. Replay as many times as you like.
          </p>
        </div>
      )}

      {sourceMode === 'file' && audioSrc && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <audio ref={audioRef} controls src={audioSrc} style={{ width: '100%' }} />
        </div>
      )}

      {/* Input area */}
      {(videoId || audioSrc || (sourceMode === 'text' && transcript.trim())) && !submitted && (
        <div className="card dictation-input-card">
          <label className="text-sm" style={{ fontWeight: 600 }}>Type what you hear:</label>
          <textarea
            className="input dictation-textarea"
            rows={6}
            placeholder="Start typing…"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!userInput.trim()}>
              Check answer
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {submitted && (
        <div className="card dictation-result">
          {score !== null && (
            <div className="dictation-score-row">
              <span className="text-sm text-muted">Score:</span>
              <span className={`dictation-score ${scoreClass}`}>{score}%</span>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${score}%`,
                    background: score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)',
                  }}
                />
              </div>
              {score >= 80 && <span className="text-success">Excellent!</span>}
              {score >= 50 && score < 80 && <span style={{ color: 'var(--warning)' }}>Good, keep going!</span>}
              {score < 50 && <span className="text-danger">Keep practicing!</span>}
            </div>
          )}

          {/* Diff view */}
          {diff.length > 0 && (
            <div className="dictation-diff">
              <p className="text-sm text-muted" style={{ marginBottom: 8 }}>Word-by-word comparison:</p>
              <div className="dictation-diff-words">
                {diff.map((d, i) => (
                  <span key={i} className={`dictation-diff-word ${d.correct ? 'correct' : 'wrong'}`} title={d.correct ? '' : `You wrote: "${d.userWord || '(missing)'}"`}>
                    {d.word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Show answer key */}
          {transcript.trim() && !showTranscript && score === null && (
            <button className="btn btn-secondary btn-sm" onClick={() => setShowTranscript(true)}>
              Reveal transcript
            </button>
          )}
          {(showTranscript || score !== null) && transcript.trim() && (
            <div className="dictation-transcript-reveal">
              <p className="text-sm text-muted" style={{ marginBottom: 4 }}>Correct transcript:</p>
              <p className="dictation-transcript-text">{transcript}</p>
            </div>
          )}

          {/* Your answer */}
          <div className="dictation-transcript-reveal">
            <p className="text-sm text-muted" style={{ marginBottom: 4 }}>Your answer:</p>
            <p className="dictation-transcript-text">{userInput}</p>
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleReset} style={{ alignSelf: 'flex-start' }}>
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

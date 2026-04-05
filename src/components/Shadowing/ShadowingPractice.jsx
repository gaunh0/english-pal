import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useShadowingStore } from '../../store/shadowingStore'
import { useImmersionTimer } from '../../hooks/useImmersionTimer'
import './Shadowing.css'

function extractVideoId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

function decodeHtml(html) {
  const el = document.createElement('textarea')
  el.innerHTML = html
  return el.value
}

function parseSRT(text) {
  const blocks = text.trim().split(/\n\s*\n/)
  return blocks.map(block => {
    const lines = block.trim().split('\n')
    if (lines.length < 3) return null
    const timeLine = lines[1]
    const m = timeLine.match(/(\d{2}:\d{2}:\d{2}[,.]?\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]?\d{3})/)
    if (!m) return null
    const toSec = t => {
      const [h, min, s] = t.replace(',', '.').split(':')
      return parseFloat(h) * 3600 + parseFloat(min) * 60 + parseFloat(s)
    }
    const start = toSec(m[1])
    const end = toSec(m[2])
    const text = lines.slice(2).join(' ').replace(/<[^>]+>/g, '').trim()
    return { text, start, dur: end - start }
  }).filter(Boolean)
}

function loadYTApi(cb) {
  if (window.YT?.Player) { cb(); return }
  const prev = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = () => { prev?.(); cb() }
  if (!document.getElementById('yt-iframe-api-script')) {
    const s = document.createElement('script')
    s.id = 'yt-iframe-api-script'
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  }
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5]

export default function ShadowingPractice() {
  useImmersionTimer('shadowing')
  const { sessions, addSession, deleteSession } = useShadowingStore()

  const [tab, setTab] = useState('practice') // 'practice' | 'history'
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [transcript, setTranscript] = useState([])
  const [loadingTranscript, setLoadingTranscript] = useState(false)
  const [transcriptError, setTranscriptError] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [showManual, setShowManual] = useState(false)

  const [currentIdx, setCurrentIdx] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [speed, setSpeed] = useState(1)

  const [recording, setRecording] = useState(false)
  const [userAudioUrl, setUserAudioUrl] = useState('')
  const [practicedCount, setPracticedCount] = useState(0)

  const playerRef = useRef(null)
  const playerReadyRef = useRef(false)
  const loopRef = useRef(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])

  // Init YouTube API once
  useEffect(() => { loadYTApi(() => {}) }, [])

  // Create/recreate player when videoId changes
  useEffect(() => {
    if (!videoId) return
    let destroyed = false

    function init() {
      if (destroyed) return
      playerReadyRef.current = false
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
        playerRef.current = null
      }
      // Ensure container exists
      const container = document.getElementById('yt-player')
      if (!container) return

      playerRef.current = new window.YT.Player('yt-player', {
        videoId,
        playerVars: { enablejsapi: 1, modestbranding: 1, rel: 0 },
        events: {
          onReady() { playerReadyRef.current = true },
        },
      })
    }

    loadYTApi(init)
    return () => {
      destroyed = true
      clearInterval(loopRef.current)
      try { playerRef.current?.destroy() } catch {}
      playerRef.current = null
      playerReadyRef.current = false
    }
  }, [videoId])

  // Sync current sentence highlight every 500ms
  useEffect(() => {
    if (!transcript.length) return
    const iv = setInterval(() => {
      if (!playerReadyRef.current || !playerRef.current) return
      try {
        const t = playerRef.current.getCurrentTime?.() ?? 0
        const idx = [...transcript].reverse().findIndex(s => s.start <= t)
        if (idx >= 0) setCurrentIdx(transcript.length - 1 - idx)
      } catch {}
    }, 500)
    return () => clearInterval(iv)
  }, [transcript])

  // Apply speed
  useEffect(() => {
    if (!playerReadyRef.current) return
    try { playerRef.current?.setPlaybackRate?.(speed) } catch {}
  }, [speed])

  async function fetchTranscript(vid) {
    setLoadingTranscript(true)
    setTranscriptError('')
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://www.youtube.com/api/timedtext?lang=en&v=${vid}&fmt=srv3`
      )}`
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) })
      const json = await res.json()
      if (!json.contents) throw new Error('empty')
      const parser = new DOMParser()
      const doc = parser.parseFromString(json.contents, 'text/xml')
      const texts = Array.from(doc.querySelectorAll('text, p'))
      if (!texts.length) throw new Error('no captions')
      const parsed = texts.map(el => ({
        text: decodeHtml(el.textContent.trim()),
        start: parseFloat(el.getAttribute('start') || el.getAttribute('t') || '0') / (el.hasAttribute('t') ? 1000 : 1),
        dur: parseFloat(el.getAttribute('dur') || el.getAttribute('d') || '2000') / (el.hasAttribute('d') ? 1000 : 1),
      })).filter(s => s.text)
      setTranscript(parsed)
      setCurrentIdx(0)
    } catch {
      setTranscriptError('Auto-fetch failed. Paste transcript manually (SRT format or plain text).')
      setShowManual(true)
    } finally {
      setLoadingTranscript(false)
    }
  }

  function handleLoad() {
    const vid = extractVideoId(url)
    if (!vid) { setTranscriptError('Invalid YouTube URL'); return }
    setVideoId(vid)
    setTranscript([])
    setUserAudioUrl('')
    setPracticedCount(0)
    setIsLooping(false)
    clearInterval(loopRef.current)
    fetchTranscript(vid)
  }

  function applyManualTranscript() {
    if (!manualInput.trim()) return
    let parsed = parseSRT(manualInput)
    if (!parsed.length) {
      // Treat as plain sentences split by newline
      parsed = manualInput.split('\n').filter(l => l.trim()).map((text, i) => ({
        text: text.trim(), start: i * 5, dur: 4,
      }))
    }
    setTranscript(parsed)
    setCurrentIdx(0)
    setShowManual(false)
    setTranscriptError('')
  }

  function seekTo(idx) {
    const s = transcript[idx]
    if (!s || !playerReadyRef.current) return
    try {
      playerRef.current?.seekTo?.(s.start, true)
      playerRef.current?.playVideo?.()
      playerRef.current?.setPlaybackRate?.(speed)
    } catch {}
    setCurrentIdx(idx)
  }

  function toggleLoop(idx) {
    if (isLooping) {
      clearInterval(loopRef.current)
      setIsLooping(false)
      return
    }
    setIsLooping(true)
    seekTo(idx)
    const s = transcript[idx]
    loopRef.current = setInterval(() => {
      try {
        const t = playerRef.current?.getCurrentTime?.() ?? 0
        if (t >= s.start + s.dur - 0.15) {
          playerRef.current?.seekTo?.(s.start, true)
        }
      } catch {}
    }, 150)
  }

  async function startRecording() {
    if (!navigator.mediaDevices) { alert('Microphone not available'); return }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    chunksRef.current = []
    const recorder = new MediaRecorder(stream)
    recorder.ondataavailable = e => chunksRef.current.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      setUserAudioUrl(URL.createObjectURL(blob))
      stream.getTracks().forEach(t => t.stop())
      setPracticedCount(c => c + 1)
    }
    recorder.start()
    recorderRef.current = recorder
    setRecording(true)
    setUserAudioUrl('')
  }

  function stopRecording() {
    recorderRef.current?.stop()
    setRecording(false)
  }

  function saveSession() {
    if (!videoId) return
    addSession({ url, videoId, sentenceCount: transcript.length, practicedCount })
    alert('Session saved!')
  }

  const current = transcript[currentIdx]

  return (
    <div className="shadowing-view">
      {/* Tab bar */}
      <div className="shadowing-tabs">
        <button className={`filter-btn${tab === 'practice' ? ' active' : ''}`} onClick={() => setTab('practice')}>Practice</button>
        <button className={`filter-btn${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>
          History {sessions.length > 0 && <span className="badge-count">{sessions.length}</span>}
        </button>
      </div>

      {tab === 'history' && (
        <div className="shadowing-history">
          <h3 className="section-title">Past Sessions</h3>
          {!sessions.length && <p className="text-muted text-center" style={{ padding: 32 }}>No sessions yet.</p>}
          {sessions.map(s => (
            <div key={s.id} className="card shadowing-session-card">
              <div className="shadowing-session-info">
                <div className="shadowing-session-url">{s.url}</div>
                <div className="text-sm text-muted">
                  {s.sentenceCount} sentences · {s.practicedCount} practiced · {new Date(s.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => deleteSession(s.id)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'practice' && (
        <>
          {/* URL input */}
          <div className="card shadowing-url-card">
            <h2 className="section-title">Shadowing Practice</h2>
            <p className="section-subtitle">Paste a YouTube URL, load the video and transcript, then shadow sentence by sentence.</p>
            <div className="shadowing-url-row">
              <input
                className="input"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLoad()}
              />
              <button className="btn btn-primary" onClick={handleLoad} disabled={loadingTranscript}>
                {loadingTranscript ? 'Loading…' : 'Load'}
              </button>
            </div>
            {transcriptError && (
              <p className="text-danger text-sm" style={{ marginTop: 8 }}>{transcriptError}</p>
            )}
          </div>

          {/* Manual transcript input */}
          {showManual && (
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>Paste Transcript</h3>
              <p className="text-sm text-muted" style={{ marginBottom: 8 }}>
                Paste SRT format or one sentence per line. Get it from YouTube (⚙️ → Subtitles → Open transcript).
              </p>
              <textarea
                className="input"
                rows={8}
                placeholder="00:00:01,000 --> 00:00:04,000&#10;Hello and welcome to this video..."
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={applyManualTranscript}>Apply</button>
                <button className="btn btn-secondary" onClick={() => setShowManual(false)}>Cancel</button>
              </div>
            </div>
          )}

          {videoId && (
            <div className="shadowing-main">
              {/* Left: player + controls */}
              <div className="shadowing-left">
                <div className="shadowing-player-wrap">
                  <div id="yt-player" />
                </div>

                {/* Speed control */}
                <div className="shadowing-controls card">
                  <div className="shadowing-controls-row">
                    <span className="text-sm text-muted">Speed:</span>
                    <div className="filter-group">
                      {SPEEDS.map(s => (
                        <button
                          key={s}
                          className={`filter-btn${speed === s ? ' active' : ''}`}
                          onClick={() => setSpeed(s)}
                        >{s}x</button>
                      ))}
                    </div>
                  </div>

                  {/* Recording */}
                  <div className="shadowing-record-row">
                    <div style={{ flex: 1 }}>
                      {current && <p className="text-sm text-muted">Current: "{current.text}"</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {recording
                        ? <button className="btn btn-danger" onClick={stopRecording}>⏹ Stop</button>
                        : <button className="btn btn-primary" onClick={startRecording}>🎤 Record me</button>
                      }
                      {videoId && transcript.length > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={saveSession}>💾 Save session</button>
                      )}
                    </div>
                  </div>

                  {userAudioUrl && (
                    <div className="shadowing-audio-compare">
                      <div className="shadowing-audio-item">
                        <span className="text-xs text-muted">Your recording</span>
                        <audio controls src={userAudioUrl} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: transcript */}
              <div className="shadowing-transcript card">
                {!transcript.length && !loadingTranscript && (
                  <div className="empty-state">
                    <div className="empty-state-icon">📄</div>
                    <p>Transcript not loaded.</p>
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => setShowManual(true)}>
                      Paste manually
                    </button>
                  </div>
                )}
                {loadingTranscript && <p className="text-muted text-center" style={{ padding: 16 }}>Fetching transcript…</p>}
                {transcript.map((s, i) => (
                  <div
                    key={i}
                    className={`shadowing-sentence${i === currentIdx ? ' active' : ''}`}
                    onClick={() => seekTo(i)}
                  >
                    <span className="shadowing-sentence-time">{Math.floor(s.start / 60)}:{String(Math.floor(s.start % 60)).padStart(2, '0')}</span>
                    <span className="shadowing-sentence-text">{s.text}</span>
                    <button
                      className={`btn btn-sm ${isLooping && i === currentIdx ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={e => { e.stopPropagation(); toggleLoop(i) }}
                      title="Loop this sentence"
                    >
                      {isLooping && i === currentIdx ? '⏹' : '🔁'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

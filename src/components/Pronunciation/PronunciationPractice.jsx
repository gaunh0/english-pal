import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useVocabStore } from '../../store/vocabStore'
import { useSettingsStore } from '../../store/settingsStore'
import { SpeechRecognitionWrapper } from '../../utils/speechRecognition'
import './Pronunciation.css'

const speech = new SpeechRecognitionWrapper()

/** Pronunciation practice with text-to-speech and speech recognition. */
export default function PronunciationPractice() {
  const vocabulary = useVocabStore(s => s.vocabulary)
  const incrementPractice = useVocabStore(s => s.incrementPractice)
  const recordActivity = useSettingsStore(s => s.recordActivity)

  const [selectedId, setSelectedId] = useState(vocabulary[0]?.id ?? null)
  const [isRecording, setIsRecording] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const word = useMemo(
    () => vocabulary.find(w => w.id === Number(selectedId)) ?? vocabulary[0],
    [vocabulary, selectedId]
  )

  const isSupported = speech.isSupported()

  const handleListen = () => {
    if (!word) return
    speech.speak(word.term)
  }

  const handleRecord = () => {
    if (!isSupported || !word) return
    setError('')
    setResult(null)

    if (isRecording) {
      speech.stop()
      setIsRecording(false)
      return
    }

    setIsRecording(true)
    speech.start(
      (transcript) => {
        setIsRecording(false)
        const accuracy = speech.calculateAccuracy(word.term, transcript)
        const score = Math.round(accuracy * 100)
        setResult({ transcript, score })
        incrementPractice(word.id)
        recordActivity('practice', 1)
        setHistory(prev => [
          { term: word.term, transcript, score, id: Date.now() },
          ...prev.slice(0, 9),
        ])
      },
      (err) => {
        setIsRecording(false)
        setError(err)
      }
    )
  }

  const getAccuracyClass = (score) => {
    if (score >= 80) return 'accuracy-good'
    if (score >= 50) return 'accuracy-ok'
    return 'accuracy-poor'
  }

  return (
    <div className="pronunciation-practice">
      <div className="pronunciation-selector">
        <label htmlFor="word-select">Select word:</label>
        <select
          id="word-select"
          value={selectedId ?? ''}
          onChange={e => { setSelectedId(e.target.value); setResult(null); setError('') }}
        >
          {vocabulary.map(w => (
            <option key={w.id} value={w.id}>
              {w.term} ({w.category === 'iot' ? 'IoT' : 'IT'})
            </option>
          ))}
        </select>
      </div>

      {word && (
        <div className="pronunciation-target">
          <div className="pronunciation-word">{word.term}</div>
          <div className="pronunciation-meaning">{word.meaning}</div>
          <div className="pronunciation-actions">
            <button className="btn btn-secondary" onClick={handleListen}>
              🔊 Listen
            </button>
            {isSupported ? (
              <button
                className={`btn btn-primary${isRecording ? ' btn-recording' : ''}`}
                onClick={handleRecord}
              >
                {isRecording ? '⏹ Stop Recording' : '🎤 Record'}
              </button>
            ) : (
              <span className="text-muted text-sm">Recognition not supported</span>
            )}
          </div>
          {word.practiceCount > 0 && (
            <p className="text-sm text-muted" style={{ marginTop: 12 }}>
              Practiced {word.practiceCount} time{word.practiceCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {!isSupported && (
        <div className="no-speech-banner">
          ⚠️ Speech recognition is not supported in this browser. Try Chrome or Edge.
          Text-to-speech (Listen) is still available.
        </div>
      )}

      {error && (
        <div className="no-speech-banner" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {result && (
        <div className="pronunciation-result">
          <div className="pronunciation-result-title">Your pronunciation</div>
          <div className="pronunciation-result-text">"{result.transcript}"</div>
          <div className="accuracy-bar">
            <span className={`accuracy-label ${getAccuracyClass(result.score)}`}>
              {result.score}%
            </span>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${result.score}%`,
                  background: result.score >= 80 ? 'var(--success)' : result.score >= 50 ? 'var(--warning)' : 'var(--danger)',
                }}
              />
            </div>
          </div>
          {result.score >= 80 && <p className="text-success mt-2">Excellent pronunciation! 🎉</p>}
          {result.score >= 50 && result.score < 80 && <p style={{ color: 'var(--warning)' }} className="mt-2">Good — keep practicing!</p>}
          {result.score < 50 && <p className="text-danger mt-2">Try again — listen and repeat.</p>}
        </div>
      )}

      {history.length > 0 && (
        <div className="practice-history card">
          <h3>Recent Practice</h3>
          {history.map(item => (
            <div key={item.id} className="history-item">
              <span className="history-item-term">{item.term}</span>
              <span className="text-muted text-sm">→ "{item.transcript}"</span>
              <span className={`history-item-score ${getAccuracyClass(item.score)}`}>
                {item.score}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * @fileoverview Web Speech API wrapper for speech recognition and synthesis.
 */

/**
 * Wraps the browser's Web Speech API for recognition and text-to-speech.
 */
export class SpeechRecognitionWrapper {
  constructor() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    this._recognition = SpeechRecognition ? new SpeechRecognition() : null
    this._isListening = false

    if (this._recognition) {
      this._recognition.continuous = false
      this._recognition.interimResults = false
      this._recognition.lang = 'en-US'
      this._recognition.maxAlternatives = 1
    }
  }

  /**
   * Check if the browser supports speech recognition.
   * @returns {boolean}
   */
  isSupported() {
    return this._recognition !== null
  }

  /**
   * Check if speech synthesis is supported.
   * @returns {boolean}
   */
  isSynthesisSupported() {
    return 'speechSynthesis' in window
  }

  /**
   * Check if currently listening.
   * @returns {boolean}
   */
  get isListening() {
    return this._isListening
  }

  /**
   * Start speech recognition.
   * @param {function(string): void} onResult - Called with the recognized text
   * @param {function(string): void} onError - Called with an error message
   */
  start(onResult, onError) {
    if (!this._recognition) {
      onError?.('Speech recognition is not supported in this browser.')
      return
    }
    if (this._isListening) return

    this._recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || ''
      this._isListening = false
      onResult?.(transcript.trim())
    }

    this._recognition.onerror = (event) => {
      this._isListening = false
      const messages = {
        'no-speech': 'No speech detected. Try speaking louder.',
        'audio-capture': 'Microphone not found or not accessible.',
        'not-allowed': 'Microphone permission denied.',
        'network': 'Network error during recognition.',
      }
      onError?.(messages[event.error] || `Recognition error: ${event.error}`)
    }

    this._recognition.onend = () => {
      this._isListening = false
    }

    try {
      this._recognition.start()
      this._isListening = true
    } catch (e) {
      this._isListening = false
      onError?.(`Could not start recognition: ${e.message}`)
    }
  }

  /**
   * Stop speech recognition.
   */
  stop() {
    if (this._recognition && this._isListening) {
      this._recognition.stop()
      this._isListening = false
    }
  }

  /**
   * Speak text aloud using the Web Speech Synthesis API.
   * @param {string} text - Text to speak
   * @param {{ rate?: number, pitch?: number, volume?: number }} options
   */
  speak(text, options = {}) {
    if (!this.isSynthesisSupported()) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = options.rate ?? 0.9
    utterance.pitch = options.pitch ?? 1
    utterance.volume = options.volume ?? 1

    // Prefer an English voice if available
    const voices = window.speechSynthesis.getVoices()
    const enVoice = voices.find(v => v.lang.startsWith('en-') && !v.name.includes('Google'))
    if (enVoice) utterance.voice = enVoice

    window.speechSynthesis.speak(utterance)
  }

  /**
   * Compare two strings for similarity (normalized).
   * @param {string} expected
   * @param {string} spoken
   * @returns {number} 0-1 similarity score
   */
  calculateAccuracy(expected, spoken) {
    const norm = str => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
    const a = norm(expected)
    const b = norm(spoken)
    if (a === b) return 1
    if (!b) return 0

    // Levenshtein-based similarity
    const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
      Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    )
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b[i - 1] === a[j - 1]
            ? matrix[i - 1][j - 1]
            : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1])
      }
    }
    const distance = matrix[b.length][a.length]
    return Math.max(0, 1 - distance / Math.max(a.length, b.length))
  }
}

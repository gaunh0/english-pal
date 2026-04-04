import React, { useState, useMemo } from 'react'
import './IPALearning.css'

const IPA_DATA = {
  vowels: [
    { symbol: '/iː/', description: 'Long "ee"', example: 'see', phonetic: '/siː/' },
    { symbol: '/ɪ/', description: 'Short "i"', example: 'sit', phonetic: '/sɪt/' },
    { symbol: '/e/', description: 'Short "e"', example: 'bed', phonetic: '/bed/' },
    { symbol: '/æ/', description: 'Short "a"', example: 'cat', phonetic: '/kæt/' },
    { symbol: '/ɑː/', description: 'Long "ah"', example: 'father', phonetic: '/ˈfɑːðər/' },
    { symbol: '/ɒ/', description: 'Short "o"', example: 'lot', phonetic: '/lɒt/' },
    { symbol: '/ɔː/', description: 'Long "aw"', example: 'thought', phonetic: '/θɔːt/' },
    { symbol: '/ʊ/', description: 'Short "oo"', example: 'book', phonetic: '/bʊk/' },
    { symbol: '/uː/', description: 'Long "oo"', example: 'food', phonetic: '/fuːd/' },
    { symbol: '/ʌ/', description: 'Short "u"', example: 'cup', phonetic: '/kʌp/' },
    { symbol: '/ɜː/', description: '"er" sound', example: 'bird', phonetic: '/bɜːd/' },
    { symbol: '/ə/', description: 'Schwa (unstressed)', example: 'about', phonetic: '/əˈbaʊt/' },
  ],
  diphthongs: [
    { symbol: '/eɪ/', description: '"ay"', example: 'day', phonetic: '/deɪ/' },
    { symbol: '/aɪ/', description: '"eye"', example: 'my', phonetic: '/maɪ/' },
    { symbol: '/ɔɪ/', description: '"oy"', example: 'boy', phonetic: '/bɔɪ/' },
    { symbol: '/əʊ/', description: '"oh"', example: 'go', phonetic: '/ɡəʊ/' },
    { symbol: '/aʊ/', description: '"ow"', example: 'now', phonetic: '/naʊ/' },
    { symbol: '/ɪə/', description: '"ear"', example: 'near', phonetic: '/nɪə/' },
    { symbol: '/eə/', description: '"air"', example: 'hair', phonetic: '/heə/' },
    { symbol: '/ʊə/', description: '"oor"', example: 'tour', phonetic: '/tʊə/' },
  ],
  consonants: [
    { symbol: '/p/', description: 'Voiceless bilabial stop', example: 'pen', phonetic: '/pen/' },
    { symbol: '/b/', description: 'Voiced bilabial stop', example: 'bad', phonetic: '/bæd/' },
    { symbol: '/t/', description: 'Voiceless alveolar stop', example: 'two', phonetic: '/tuː/' },
    { symbol: '/d/', description: 'Voiced alveolar stop', example: 'did', phonetic: '/dɪd/' },
    { symbol: '/k/', description: 'Voiceless velar stop', example: 'cat', phonetic: '/kæt/' },
    { symbol: '/ɡ/', description: 'Voiced velar stop', example: 'got', phonetic: '/ɡɒt/' },
    { symbol: '/f/', description: 'Voiceless labiodental fricative', example: 'fall', phonetic: '/fɔːl/' },
    { symbol: '/v/', description: 'Voiced labiodental fricative', example: 'voice', phonetic: '/vɔɪs/' },
    { symbol: '/θ/', description: 'Voiceless dental fricative', example: 'think', phonetic: '/θɪŋk/' },
    { symbol: '/ð/', description: 'Voiced dental fricative', example: 'this', phonetic: '/ðɪs/' },
    { symbol: '/s/', description: 'Voiceless alveolar fricative', example: 'see', phonetic: '/siː/' },
    { symbol: '/z/', description: 'Voiced alveolar fricative', example: 'zoo', phonetic: '/zuː/' },
    { symbol: '/ʃ/', description: 'Voiceless postalveolar fricative', example: 'she', phonetic: '/ʃiː/' },
    { symbol: '/ʒ/', description: 'Voiced postalveolar fricative', example: 'vision', phonetic: '/ˈvɪʒən/' },
    { symbol: '/h/', description: 'Voiceless glottal fricative', example: 'how', phonetic: '/haʊ/' },
    { symbol: '/tʃ/', description: 'Voiceless affricate', example: 'chair', phonetic: '/tʃeə/' },
    { symbol: '/dʒ/', description: 'Voiced affricate', example: 'judge', phonetic: '/dʒʌdʒ/' },
    { symbol: '/m/', description: 'Bilabial nasal', example: 'man', phonetic: '/mæn/' },
    { symbol: '/n/', description: 'Alveolar nasal', example: 'no', phonetic: '/nəʊ/' },
    { symbol: '/ŋ/', description: 'Velar nasal', example: 'sing', phonetic: '/sɪŋ/' },
    { symbol: '/l/', description: 'Lateral approximant', example: 'leg', phonetic: '/leɡ/' },
    { symbol: '/r/', description: 'Rhotic approximant', example: 'red', phonetic: '/red/' },
    { symbol: '/w/', description: 'Labial-velar approximant', example: 'wet', phonetic: '/wet/' },
    { symbol: '/j/', description: 'Palatal approximant', example: 'yes', phonetic: '/jes/' },
  ],
}

const ALL_SYMBOLS = [
  ...IPA_DATA.vowels.map(s => ({ ...s, type: 'vowels' })),
  ...IPA_DATA.diphthongs.map(s => ({ ...s, type: 'diphthongs' })),
  ...IPA_DATA.consonants.map(s => ({ ...s, type: 'consonants' })),
]

const BROWSE_TABS = [
  { id: 'vowels', label: 'Vowels' },
  { id: 'diphthongs', label: 'Diphthongs' },
  { id: 'consonants', label: 'Consonants' },
]

const PRACTICE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'vowels', label: 'Vowels' },
  { value: 'diphthongs', label: 'Diphthongs' },
  { value: 'consonants', label: 'Consonants' },
  { value: 'unlearned', label: 'Not learned' },
]

function speak(word) {
  if (!window.speechSynthesis) return
  const utt = new SpeechSynthesisUtterance(word)
  window.speechSynthesis.speak(utt)
}

export default function IPALearning() {
  const [mode, setMode] = useState('browse')
  const [browseTab, setBrowseTab] = useState('vowels')
  const [learned, setLearned] = useState({})

  const [practiceFilter, setPracticeFilter] = useState('all')
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [practicedToday, setPracticedToday] = useState(0)

  const toggleLearned = (symbol) => {
    setLearned(prev => ({ ...prev, [symbol]: !prev[symbol] }))
  }

  const practicePool = useMemo(() => {
    if (practiceFilter === 'all') return ALL_SYMBOLS
    if (practiceFilter === 'unlearned') return ALL_SYMBOLS.filter(s => !learned[s.symbol])
    return ALL_SYMBOLS.filter(s => s.type === practiceFilter)
  }, [practiceFilter, learned])

  const currentCard = practicePool[practiceIndex % Math.max(practicePool.length, 1)]

  const handleGotIt = () => {
    if (currentCard) {
      setLearned(prev => ({ ...prev, [currentCard.symbol]: true }))
      setPracticedToday(n => n + 1)
    }
    nextCard()
  }

  const handleNeedMore = () => {
    setPracticedToday(n => n + 1)
    nextCard()
  }

  const nextCard = () => {
    setRevealed(false)
    setPracticeIndex(i => (i + 1) % Math.max(practicePool.length, 1))
  }

  const handlePracticeFilterChange = (val) => {
    setPracticeFilter(val)
    setPracticeIndex(0)
    setRevealed(false)
  }

  return (
    <div className="ipa-learning">
      <div className="section-header">
        <div>
          <h2 className="section-title">IPA Learning</h2>
          <p className="section-subtitle">International Phonetic Alphabet</p>
        </div>
        <div className="ipa-mode-toggle">
          <button
            className={`filter-btn${mode === 'browse' ? ' active' : ''}`}
            onClick={() => setMode('browse')}
          >
            Browse
          </button>
          <button
            className={`filter-btn${mode === 'practice' ? ' active' : ''}`}
            onClick={() => setMode('practice')}
          >
            Practice
          </button>
        </div>
      </div>

      {mode === 'browse' && (
        <>
          <div className="filter-group ipa-browse-tabs">
            {BROWSE_TABS.map(tab => (
              <button
                key={tab.id}
                className={`filter-btn${browseTab === tab.id ? ' active' : ''}`}
                onClick={() => setBrowseTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="ipa-grid">
            {IPA_DATA[browseTab].map(item => (
              <div key={item.symbol} className={`ipa-card${learned[item.symbol] ? ' ipa-card--learned' : ''}`}>
                <div className="ipa-symbol">{item.symbol}</div>
                <div className="ipa-description">{item.description}</div>
                <div className="ipa-example-word">{item.example}</div>
                <div className="ipa-phonetic">{item.phonetic}</div>
                <div className="ipa-card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => speak(item.example)}
                    title="Speak"
                  >
                    🔊 Speak
                  </button>
                  <button
                    className={`btn btn-sm${learned[item.symbol] ? ' btn-success' : ' btn-secondary'}`}
                    onClick={() => toggleLearned(item.symbol)}
                  >
                    {learned[item.symbol] ? '✓ Learned' : 'Mark learned'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'practice' && (
        <div className="ipa-practice">
          <div className="ipa-practice-toolbar">
            <div className="filter-group">
              {PRACTICE_FILTERS.map(f => (
                <button
                  key={f.value}
                  className={`filter-btn${practiceFilter === f.value ? ' active' : ''}`}
                  onClick={() => handlePracticeFilterChange(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="ipa-practice-progress">
              {practicedToday} / {practicePool.length} practiced today
            </div>
          </div>

          {practicePool.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <h3>All learned!</h3>
              <p>Switch to "All" to keep practicing.</p>
            </div>
          ) : (
            <div className="ipa-flashcard">
              <div className="ipa-flashcard-symbol">{currentCard?.symbol}</div>

              {!revealed ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setRevealed(true)}
                >
                  Reveal
                </button>
              ) : (
                <div className="ipa-flashcard-reveal">
                  <div className="ipa-flashcard-description">{currentCard?.description}</div>
                  <div className="ipa-flashcard-example">
                    <strong>{currentCard?.example}</strong>
                    <span className="ipa-phonetic">{currentCard?.phonetic}</span>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => currentCard && speak(currentCard.example)}
                  >
                    🔊 Speak
                  </button>
                  <div className="ipa-flashcard-buttons">
                    <button className="btn btn-success" onClick={handleGotIt}>
                      Got it
                    </button>
                    <button className="btn btn-secondary" onClick={handleNeedMore}>
                      Need more practice
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

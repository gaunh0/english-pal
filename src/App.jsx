import React, { useState, useEffect } from 'react'
import { useSettingsStore } from './store/settingsStore'
import { useVocabStore } from './store/vocabStore'
import Header from './components/Layout/Header'
import Navigation from './components/Layout/Navigation'
import VocabularyBrowser from './components/Vocabulary/VocabularyBrowser'
import FlashcardMode from './components/Flashcards/FlashcardMode'
import PronunciationPractice from './components/Pronunciation/PronunciationPractice'
import SpacedRepetition from './components/SRS/SpacedRepetition'
import NotesManager from './components/Notes/NotesManager'
import InterviewQuestions from './components/Questions/InterviewQuestions'
import ProgressDashboard from './components/Progress/ProgressDashboard'
import Settings from './components/Settings/Settings'
import IPALearning from './components/IPA/IPALearning'
import ShadowingPractice from './components/Shadowing/ShadowingPractice'
import ReadingPractice from './components/Reading/ReadingPractice'
import DictationPractice from './components/Dictation/DictationPractice'
import WritingJournal from './components/Journal/WritingJournal'
import './App.css'

const VIEWS = {
  vocabulary:    <VocabularyBrowser />,
  flashcards:    <FlashcardMode />,
  pronunciation: <PronunciationPractice />,
  srs:           <SpacedRepetition />,
  notes:         <NotesManager />,
  questions:     <InterviewQuestions />,
  progress:      <ProgressDashboard />,
  settings:      <Settings />,
  ipa:           <IPALearning />,
  shadowing:     <ShadowingPractice />,
  reading:       <ReadingPractice />,
  dictation:     <DictationPractice />,
  journal:       <WritingJournal />,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('vocabulary')
  const darkMode = useSettingsStore(s => s.darkMode)
  const fetchVocabulary = useVocabStore(s => s.fetchVocabulary)
  const vocabLoading = useVocabStore(s => s.loading)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => { fetchVocabulary() }, [fetchVocabulary])

  return (
    <div className="layout">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content" key={activeTab}>
        {vocabLoading && (activeTab === 'vocabulary' || activeTab === 'flashcards' || activeTab === 'srs' || activeTab === 'pronunciation' || activeTab === 'progress') ? (
          <div className="flex-center" style={{ padding: '64px 20px' }}>
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <h3>Loading vocabulary…</h3>
            </div>
          </div>
        ) : (
          VIEWS[activeTab]
        )}
      </main>
    </div>
  )
}

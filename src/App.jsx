import React, { useState, useEffect } from 'react'
import { useSettingsStore } from './store/settingsStore'
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
}

/** Root application component. */
export default function App() {
  const [activeTab, setActiveTab] = useState('vocabulary')
  const darkMode = useSettingsStore(s => s.darkMode)

  // Apply dark mode attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="layout">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content" key={activeTab}>
        {VIEWS[activeTab]}
      </main>
    </div>
  )
}

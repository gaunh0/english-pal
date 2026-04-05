# EngLearn — Comprehensive English Learning App Roadmap

> Personal app. 4 skills: Listening, Speaking, Reading, Writing.
> Current stack: React 18, Vite, Zustand, Supabase.

---

## Phase 1 — Shadowing (Listening + Speaking) ✅

- [x] Build `Shadowing` view, add to `App.jsx` VIEWS + Navigation
- [x] Input: accept YouTube URL
- [x] Fetch transcript via allorigins.win proxy (YouTube timedtext API), fallback to manual SRT/plain paste
- [x] Display transcript as sentence list with timestamps
- [x] Embed YouTube player (iframe API), sync highlight to current sentence (polls every 500ms)
- [x] "Loop sentence" button — replay current sentence on demand
- [x] Playback speed control (0.5x / 0.75x / 1x / 1.25x / 1.5x)
- [x] Record user voice for current sentence (MediaRecorder API)
- [x] Playback user recording
- [x] Save shadowed sessions to Supabase (via shadowingStore)
- [x] History list of past sessions

---

## Phase 2 — Reading + Inline Vocabulary ✅

- [x] Build `Reading` view, add to App
- [x] Input modes: paste text OR fetch article from URL (allorigins proxy)
- [x] Render text with word-click handler
- [x] On word click: show popup with definition (Free Dictionary API) + pronunciation audio
- [x] "Save word" button in popup → saves to savedWordsStore (persisted)
- [x] Saved Words tab: list all saved words with definitions
- [x] Reading timer + word count + WPM tracking

---

## Phase 3 — Dictation (Listening + Writing) ✅

- [x] Build `Dictation` view, add to App
- [x] Source tabs: YouTube URL | Audio file upload | TTS text
- [x] Paste transcript as answer key (optional)
- [x] User types answer in textarea
- [x] On submit: word-by-word diff (highlight correct/wrong), score percentage
- [x] Speed control for file/TTS modes

---

## Phase 4 — Writing Journal + AI Review ✅

- [x] Build `Journal` view
- [x] Sidebar: list of entries grouped by month
- [x] Daily entry with date, title, free text area
- [x] "AI Review" button → call Claude Haiku API
  - Grammar corrections, style suggestions, vocabulary upgrades
- [x] Review displayed in panel below editor
- [x] Streak tracker (consecutive days written)
- [x] Save journal entries to Supabase (via journalStore)

---

## Phase 5 — Immersion Tracker ✅

- [x] `useImmersionTimer` hook — auto-records time per skill on view unmount
- [x] `ImmersionStats` component — per-skill bar chart in Progress Dashboard
- [x] Extended settingsStore with `immersionTime` + `anthropicApiKey`
- [x] Settings page: Anthropic API key input

---

## Improvements to Existing Features (Future)

- [ ] Pronunciation Practice: highlight mispronounced words (not just pass/fail)
- [ ] Vocabulary: auto-fetch definition + example when adding a word
- [ ] SRS: Anki-style import (CSV/TSV) and export
- [ ] Saved Words: mini-SRS flashcard review mode within Reading
- [ ] Dictation: save session scores to track improvement over time
- [ ] Shadowing: add video title display when loaded

---

## Tech / Infrastructure Notes

- YouTube transcript auto-fetch uses allorigins.win proxy → can be flaky; manual paste is the reliable fallback
- Free Dictionary API: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}` — no key needed
- Anthropic API key stored in settingsStore (Supabase-persisted), never hardcoded
- Transcript backend (yt-dlp) not implemented — would need an Edge Function or Express proxy for more reliable fetching

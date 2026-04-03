# Content Extension Spec — Vocabulary & Interview Questions

**File to edit:** `src/utils/constants.js`  
All vocabulary and interview questions live in this single file as exported arrays.

---

## 1. Adding Vocabulary Words

### Data shape
```js
{
  id: number,           // REQUIRED — must be unique, increment from last ID (currently 150)
  term: string,         // REQUIRED — the English term or abbreviation
  meaning: string,      // REQUIRED — clear, concise definition (1–2 sentences)
  example: string,      // REQUIRED — one example sentence showing usage in context
  category: 'general' | 'iot',  // REQUIRED — determines filter tab
  interval: 1,          // fixed default — do not change
  nextReview: Date.now(),        // fixed default — do not change
  repetitions: 0,       // fixed default — do not change
  practiceCount: 0,     // fixed default — do not change
}
```

### Where to append
Open `src/utils/constants.js` and find the `VOCABULARY` array.

- General IT words → append after id 85 (last General IT entry)
- IoT/Embedded words → append after id 150 (last IoT entry)

### Example — adding 3 new words
```js
// General IT — append inside VOCABULARY array, after id 85
{ id: 151, term: 'Monorepo', meaning: 'A single repository containing multiple projects or packages sharing tooling and dependencies.', example: 'Our frontend and backend live in the same monorepo managed by Turborepo.', category: 'general', interval: 1, nextReview: Date.now(), repetitions: 0, practiceCount: 0 },
{ id: 152, term: 'Feature Flag', meaning: 'A configuration switch that enables or disables a feature in production without deploying new code.', example: 'We rolled out the new checkout UI to 10% of users using a feature flag.', category: 'general', interval: 1, nextReview: now, repetitions: 0, practiceCount: 0 },

// IoT/Embedded — append inside VOCABULARY array, after id 150
{ id: 153, term: 'RSSI', meaning: 'Received Signal Strength Indicator — a measurement of the power level of a received wireless signal.', example: 'The device reconnects to a stronger AP when RSSI drops below -80 dBm.', category: 'iot', interval: 1, nextReview: now, repetitions: 0, practiceCount: 0 },
```

> **Note:** The file already defines `const now = Date.now()` at the top — use `now` instead of `Date.now()` inside the array for consistency.

### ID rules
- IDs must be **unique integers**, never reused
- Always check the current last ID before adding (`grep "id: 1" src/utils/constants.js | tail -5`)
- IDs are used as React `key` props and SRS lookup keys — duplicates cause bugs

### Category guidelines
| category | Use for |
|----------|---------|
| `'general'` | Software engineering, web dev, algorithms, networking, cloud, CS fundamentals |
| `'iot'`     | Embedded firmware, MCU peripherals, IoT protocols, hardware, RTOS, industrial |

---

## 2. Adding Interview Questions

### Data shape
```js
{
  id: number,                              // REQUIRED — unique integer, increment from 15
  question: string,                        // REQUIRED — the interview question as asked
  answer: string,                          // REQUIRED — model answer, 3–6 sentences
  category: 'behavioral' | 'technical' | 'iot',  // REQUIRED
}
```

### Where to append
Find the `INTERVIEW_QUESTIONS` array in `src/utils/constants.js` and append new entries at the end.

### Example — adding 2 new questions
```js
{
  id: 16,
  question: 'What is the difference between a process and a thread?',
  answer: 'A process is an independent program in execution with its own memory space. A thread is a lighter unit of execution within a process, sharing the same memory space as other threads. Processes are isolated from each other (IPC is needed to communicate), while threads within the same process communicate via shared memory. Using multiple threads is faster for concurrent tasks within one application, but requires careful synchronization to avoid race conditions.',
  category: 'technical',
},
{
  id: 17,
  question: 'Describe a time you had to learn something quickly.',
  answer: 'During a project I was assigned to integrate a LoRaWAN gateway I had never used before. I had one week before the sprint demo. I read the datasheet, studied the AT command set, built a small test harness, and had packets flowing by day three. By demo day I had end-to-end sensor data reaching our MQTT broker. The key was prioritizing the minimum viable understanding needed to unblock progress, then deepening my knowledge after the deliverable was met.',
  category: 'behavioral',
},
```

### Category guidelines
| category | Use for |
|----------|---------|
| `'behavioral'` | Soft skills, teamwork, conflict, growth, motivation |
| `'technical'`  | CS/programming concepts, architecture, tools (non-IoT) |
| `'iot'`        | Embedded systems, hardware protocols, firmware, IoT architecture |

---

## 3. Quality Checklist

Before committing new content:

- [ ] `id` is unique (no duplicate IDs in either array)
- [ ] `term` / `question` has no trailing whitespace
- [ ] `meaning` / `answer` is factually correct and written in plain English
- [ ] `example` sentences are realistic and in the correct context
- [ ] `category` is one of the valid enum values
- [ ] SRS defaults (`interval: 1, nextReview: now, repetitions: 0, practiceCount: 0`) are present on all new vocab entries
- [ ] File still compiles (`npm run build` passes with no errors)

---

## 4. Bulk Import Alternative

If adding 50+ words, consider generating them as a JS snippet and pasting at the correct position:

```js
// Script pattern to generate IDs automatically
const newWords = [
  { term: '...', meaning: '...', example: '...', category: 'general' },
  // ...
].map((w, i) => ({
  ...w,
  id: 151 + i,   // adjust starting ID
  interval: 1,
  nextReview: Date.now(),
  repetitions: 0,
  practiceCount: 0,
}))
```

Then splice the result into the `VOCABULARY` array.

---

## 5. No Code Changes Required Elsewhere

The rest of the app reads `VOCABULARY` and `INTERVIEW_QUESTIONS` dynamically:

| What changes automatically | Where |
|---------------------------|-------|
| Word count display | `VocabularyBrowser` |
| Flashcard deck size | `FlashcardMode` |
| SRS stats (new/learning/mastered) | `SpacedRepetition` |
| Pronunciation word selector | `PronunciationPractice` |
| Question list & filters | `InterviewQuestions` |
| Progress percentage | `useProgress` |

No store, hook, or component edits are needed when only adding data to `constants.js`.

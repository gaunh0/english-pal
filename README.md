# EngLearn — Interview Prep

A comprehensive English learning web application designed specifically for software engineers. This tool helps you build your technical vocabulary, practice pronunciation, master software engineering concepts through spaced repetition, and prepare for senior-level technical interviews.

## Features

- **Vocabulary Browser**: Browse and manage your technical vocabulary with terms covering Web Services, APIs, Databases, Architecture, and DevOps.
- **Flashcards & SRS**: Master complex technical vocabulary efficiently using a built-in Spaced Repetition System (SRS) algorithm.
- **Pronunciation Practice**: Practice and evaluate your pronunciation of technical terms.
- **Interview Questions**: Prepare for senior-level job interviews with deep dives into system design, scalable architecture, and backend engineering concepts.
- **Notes Manager**: Keep your personal study notes and system design thoughts organized.
- **Progress Dashboard**: Track your learning progress over time.
- **Settings & Dark Mode**: Personalize your learning experience with theming support.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Zustand
- **Unique IDs**: uuid

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate to the project root directory:
   ```bash
   cd Eng
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the App

To start the development server:

```bash
npm run dev
```

### Production Build

To build the app for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `/src/components`: Contains the application components categorized by feature (Flashcards, Pronunciation, SRS, Vocabulary, Questions, etc.).
- `/src/store`: Zustand state management stores.
- `/src/hooks`: Custom React hooks.
- `/src/utils`: Utility functions, including vocabulary and interview questions constants.

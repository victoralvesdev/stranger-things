# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Stranger Things quiz application built with React and Vite. The quiz presents 10 randomly selected questions from a pool of 15 questions about the Netflix series. It features a Netflix-inspired UI with red/black color scheme and provides score-based feedback at the end.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Project Structure

```
stranger-things-quiz/
├── src/
│   ├── App.jsx          # Main quiz application component (all quiz logic)
│   ├── App.css          # Quiz-specific styles (Netflix theme)
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles and CSS reset
│   └── public/
│       └── images/      # Netflix logo and Stranger Things imagery
├── public/              # Static assets served at root
├── index.html           # HTML entry point (loads /src/main.jsx)
├── script.js            # LEGACY vanilla JS version (not used in React app)
├── styles.css           # LEGACY CSS (not used in React app)
└── vite.config.js       # Vite configuration with React plugin
```

### Application Flow

The quiz is a single-component React app with three screen states managed by the `screen` state variable:

1. **Intro Screen** (`screen === 'intro'`)
   - Displays Netflix logo, title, and description
   - "COMEÇAR QUIZ" button triggers quiz start

2. **Quiz Screen** (`screen === 'quiz'`)
   - Shows progress bar and question counter
   - Displays current question with 4 answer buttons
   - On answer selection: disables buttons, highlights correct (green) and incorrect (red) answers
   - "PRÓXIMA PERGUNTA" / "VER RESULTADO" button appears after answer selection

3. **Result Screen** (`screen === 'result'`)
   - Shows percentage score in circular display
   - Displays score-based message (90%+, 70-89%, 50-69%, 0-49%)
   - Shows correct answers count
   - "TENTAR NOVAMENTE" button returns to intro screen

### State Management

All state is managed in the `App` component using React hooks:
- `screen`: Current screen ('intro' | 'quiz' | 'result')
- `selectedQuestions`: Array of 10 randomly selected questions from the 15-question pool
- `currentQuestion`: Index of current question being displayed
- `score`: Number of correct answers
- `selectedAnswer`: Index of user's selected answer (null if not yet answered)
- `showNext`: Boolean to control "next" button visibility

### Question Randomization

Questions are shuffled using `[...questions].sort(() => 0.5 - Math.random()).slice(0, 10)` in:
- `useEffect` on component mount
- `startQuiz()` when starting quiz
- `restartQuiz()` when trying again

This ensures users get 10 different random questions each time.

### Quiz Data Structure

Questions are hardcoded in `App.jsx` as an array of objects:
```javascript
{
  question: "Question text in Portuguese",
  answers: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correct: 0  // Index of correct answer (0-3)
}
```

## Styling Conventions

- **Netflix Theme**: Uses Netflix's signature colors
  - Primary red: `#E50914`
  - Black backgrounds: `#000000`
  - Text: White with various opacities
- **Fonts**: Bebas Neue (titles), Roboto (body text) from Google Fonts
- **Responsive**: Mobile-first design with media queries
- **Visual Feedback**:
  - Correct answers: green background with checkmark
  - Incorrect answers: red background with X mark
  - Answer buttons disabled after selection

## Important Notes

- The root-level `script.js` and `styles.css` files are legacy vanilla JavaScript/CSS versions and are NOT used by the React application
- The React app loads via `/src/main.jsx` as specified in `index.html`
- Images must be placed in `/public/images/` and referenced as `/images/filename.ext` in the React app
- All text content is in Brazilian Portuguese (pt-BR)
- The quiz always selects exactly 10 questions from the 15-question pool
- Questions can have duplicate entries in the pool (e.g., question about Hawkins Lab appears twice with slight variations)

## Adding New Questions

To add new questions, append to the `questions` array in `src/App.jsx`:
```javascript
{
  question: "Your question text here?",
  answers: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
  correct: 0  // Index of correct answer
}
```

The quiz will continue to randomly select 10 questions from the expanded pool.

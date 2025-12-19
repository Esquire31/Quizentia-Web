# Quizentia Web 🚀
**Interactive quiz platform — powered by AI-generated content.**

![React](https://img.shields.io/badge/React-18+-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-5.0+-646cff.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-active-brightgreen.svg)
![AI Powered](https://img.shields.io/badge/AI-powered-purple.svg)

---

## 🧠 About Quizentia Web

**Quizentia Web** is the interactive frontend companion to the Quizentia API platform. Transform any article into an engaging, animated quiz experience with real-time feedback, progress tracking, and beautiful animations.

Built with modern React and powered by the Quizentia backend API, this application delivers seamless quiz experiences across any topic or domain.

---

## ✨ Key Features

- 🎯 Interactive quiz interface with real-time feedback
- 🎨 Beautiful animations and smooth transitions (Framer Motion)
- 📊 Progress tracking and scoring system
- 💡 Hint system for learning assistance
- 📱 Responsive design for all devices
- ⚡ Fast loading with Vite bundler
- 🔄 Real-time API integration
- 🎭 Dark theme with gradient aesthetics

---

## 🏗️ Tech Stack

- **Frontend:** React 18 with TypeScript
- **Build Tool:** Vite
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks
- **API Integration:** Fetch API
- **Linting:** ESLint with TypeScript support

---

## 📂 Project Structure

```text
quizentia-web/
│
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   └── quiz/            # Quiz-specific components
│   │       ├── LoadingScreen.tsx
│   │       ├── ErrorScreen.tsx
│   │       ├── QuizHeader.tsx
│   │       ├── QuizProgress.tsx
│   │       ├── QuestionCard.tsx
│   │       └── ResultsScreen.tsx
│   ├── lib/
│   │   ├── quiz-types.ts    # TypeScript interfaces
│   │   └── util.ts          # Utility functions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/quizentia-web.git
cd quizentia-web
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start the Development Server

```bash
npm run dev
```

Open the app at:
👉 `http://localhost:5173/`

### 4️⃣ Connect to Backend API

Make sure the Quizentia backend API is running on `http://localhost:8000` for full functionality.

---

## 📡 API Integration

The frontend connects to the Quizentia backend API:

```typescript
// Example API call
const response = await fetch('http://localhost:8000/generate_quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com/article' })
});
```

### Expected Response Format

```json
{
  "title": "Article Title",
  "questions": [
    {
      "question": "Quiz question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "hint": "Optional hint text"
    }
  ]
}
```

---

## 🧪 Features Overview

### Quiz Flow
1. **Loading**: Fetch quiz data from API
2. **Question Display**: Animated question cards with options
3. **Answer Selection**: Real-time feedback with visual indicators
4. **Progress Tracking**: Visual progress bar
5. **Hints**: Optional learning assistance
6. **Results**: Final score with celebration animations

### Interactive Elements
- Hover effects on answer options
- Shake animation for incorrect answers
- Check/X icons for feedback
- Smooth transitions between questions
- Confetti animation for perfect scores

---

## 🎨 Customization

### Styling
The app uses Tailwind CSS with a custom dark theme. Key design elements:

- **Primary Colors**: Cyan (#06b6d4) and Blue (#3b82f6)
- **Background**: Gradient from slate-950 to slate-900
- **Cards**: Semi-transparent with backdrop blur
- **Animations**: Spring-based transitions

### Component Architecture
- **Separation of Concerns**: Each screen is a separate component
- **Props Interface**: TypeScript interfaces for all component props
- **Reusable UI**: Button and Card components in `src/components/ui/`

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (via ESLint)

---

## 🧪 Testing

The application includes comprehensive quiz functionality:

* API error handling
* Loading states
* Answer validation
* Score calculation
* Question navigation
* Responsive design

---

## 🛣️ Roadmap

* [ ] Quiz difficulty selection
* [ ] Multiple quiz formats (multiple choice, true/false)
* [ ] Quiz sharing and embedding
* [ ] User progress persistence
* [ ] Quiz creation interface
* [ ] Multi-language support
* [ ] Accessibility improvements
* [ ] Performance optimizations

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⭐️ Support

If you find Quizentia Web useful, consider giving it a ⭐️ on GitHub.

Built with ❤️ using React, TypeScript, and modern web technologies.
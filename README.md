# ElectED — Election Process Education

ElectED is a non-partisan, accessible web application designed to educate citizens about the democratic election process. From candidacy declaration to official certification, the platform provides a structured, interactive guide to how democracy works.

## 🌟 Features

- **Interactive Election Timeline**: A step-by-step guide through the lifecycle of an election.
- **Civic Tooling**: Real-time polling station locator with integrated weather and travel data.
- **Educational Quiz**: Test your knowledge of the election process and track your progress.
- **Multi-language Support**: Accessible in multiple languages to support diverse communities.
- **Accessibility First**: WCAG AA/AAA compliant design with full keyboard navigation and screen reader support.
- **AI Assistant**: Quick answers to common voting questions (Simulation).

## 🏗️ Architecture

- **Frontend**: React 18 with TypeScript and Vite.
- **State Management**: Zustand for global state and React Query for server state.
- **Styling**: Vanilla CSS with modern tokens and responsive design.
- **Backend Services**: 
  - **Firebase**: Used for leaderboards and data persistence.
  - **Google Maps Platform**: Powering the Polling Station locator.
- **Deployment**: Google Cloud Run (Containerized).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mraghavendra188-collab/attemt-2.git
   cd PROMTWARS
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see below).

### Running Locally
```bash
npm run dev
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

| Variable | Description |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase API Key for data storage |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project Identifier |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps Platform API Key |
| `VITE_GEMINI_API_KEY` | (Optional) Gemini API for AI Assistant |

## 🧪 Testing

The project uses Jest and React Testing Library for comprehensive test coverage.

### Run Unit Tests
```bash
npm run test:unit
```

### Run Coverage Report
```bash
npm run test:coverage
```

### Run E2E Tests (Playwright)
```bash
npm run test:e2e
```

## 🛡️ Security & Compliance

- **Content Security Policy**: Implemented in Nginx configuration.
- **Sanitization**: All user inputs sanitized via DOMPurify.
- **Accessibility**: Audited with Axe-core and manual keyboard testing.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

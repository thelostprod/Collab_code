

CollabCode - Real-time Collaborative Coding Platform
A modern, real-time collaborative coding platform built with React, Vite, and shadcn/ui.

Features
🔐 User Authentication: Secure login and registration system

🏠 Dashboard: Manage coding sessions and view recent activity

👥 Real-time Collaboration: Code together with multiple users

💬 Live Chat: Communicate with team members in real-time

🎯 Multi-language Support: JavaScript, Python, C++, Java, Go

⚡ Code Execution: Run code directly in the browser

🎨 Modern UI: Beautiful dark theme with Tailwind CSS

📱 Responsive Design: Works on desktop and mobile devices

Tech Stack
This project is built with:

React 18: Modern React with hooks and functional components

Vite: Fast build tool and development server

shadcn/ui: Beautiful and accessible UI components

Tailwind CSS: Utility-first CSS framework

React Router: Client-side routing

TanStack Query: Data fetching and caching

Radix UI: Accessible UI primitives

Lucide React: Beautiful icons

Getting Started
Prerequisites
Node.js (version 18 or higher)

npm or yarn

Installation
Clone the repository

Bash

git clone https://github.com/your-username/collabcode.git
cd collabcode
Install dependencies

Bash

npm install
Start the development server

Bash

npm run dev
Open your browser
Navigate to http://localhost:5173 to see the application.

Available Scripts
npm run dev: Start development server

npm run build: Build for production

npm run build:dev: Build for development

npm run lint: Run ESLint

npm run preview: Preview production build

Project Structure
src/
├── components/ # React components
│   ├── ui/ # shadcn/ui components
│   ├── AuthPage.jsx # Authentication page
│   ├── Dashboard.jsx # Main dashboard
│   ├── RoomEditor.jsx # Collaborative editor
│   ├── CodeEditor.jsx # Code editor component
│   ├── ChatPanel.jsx # Real-time chat
│   └── ConsoleOutput.jsx # Code execution output
├── pages/ # Page components
│   ├── Index.jsx # Main app logic
│   └── NotFound.jsx # 404 page
├── hooks/ # Custom React hooks
├── lib/ # Utility functions
├── App.jsx # Main app component
├── main.jsx # Entry point
└── index.css # Global styles
Development
Adding New Components
Create your component in the appropriate directory

Use the existing UI components from src/components/ui/

Follow the established patterns for styling with Tailwind CSS

Styling
This project uses Tailwind CSS with a custom dark theme. The design system includes:

Custom color palette with primary (green) and accent (purple) colors

Dark theme optimized for coding environments

Responsive design patterns

Smooth animations and transitions

State Management
The application uses React's built-in state management with:

useState for local component state

useEffect for side effects

Custom hooks for reusable logic

Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

License
This project is licensed under the MIT License.


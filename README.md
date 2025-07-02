# AI Resume Screener – Frontend (React + TypeScript)

A modern, responsive frontend interface for the AI Resume Screener application, built with **React**, **TypeScript**, **NextUI**, and **Tailwind CSS**.

## ✨ Features

- **Drag-and-Drop Resume Upload**: Upload multiple PDF resumes via an intuitive UI
- **AI-Powered Search**: Search candidates using natural language queries
- **Live Status Updates**: Real-time feedback from backend
- **Modern UI**: Built with NextUI and Tailwind for a beautiful user experience
- **Responsive Design**: Optimized for both desktop and tablet

## 🧱 Tech Stack

- **React** + **TypeScript**
- **NextUI** for component styling
- **Tailwind CSS** for utility-first custom styling
- **Axios/Fetch** for API communication
- Integrated with a **FastAPI backend**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-resume-screener-frontend.git
cd ai-resume-screener-frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Start the Development Server
bash
Copy
Edit
npm run dev
The frontend will run on: http://localhost:5173

Make sure the backend API is running at http://localhost:8000 or adjust your API URLs in the code.

🧪 Project Structure
pgsql
Copy
Edit
src/
├── components/         # Reusable UI components
├── pages/              # Main views and routes
├── utils/              # Helper functions (e.g. API handlers)
├── types/              # TypeScript interfaces and types
├── assets/             # Icons and static files
└── App.tsx             # Main app wrapper
🧩 Environment Variables
Create a .env file (optional) to store your backend URL:

bash
Copy
Edit
VITE_API_BASE_URL=http://localhost:8000
Example usage in code: import.meta.env.VITE_API_BASE_URL

📦 Building for Production
bash
Copy
Edit
npm run build
This creates a production-ready build in the dist/ folder.

To preview:

bash
Copy
Edit
npm run preview
✅ Requirements
Node.js v18+

A running FastAPI backend (see backend repo)

📂 Deployment
You can deploy the built app using any static hosting service like:

Vercel

Netlify

GitHub Pages

Firebase Hosting

Make sure your API base URL is correctly set for production.

📄 License
This project is open-source and free to use for personal and commercial purposes.


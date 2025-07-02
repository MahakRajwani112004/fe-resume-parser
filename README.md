# AI Resume Screener - Full Stack Application

A sophisticated AI-powered resume screening system with multi-agent analysis capabilities.

## Features

- **Multi-Agent AI System**: Different specialized agents for skill matching, experience analysis, seniority detection, and relevancy scoring
- **PDF Resume Upload**: Drag-and-drop interface for uploading multiple PDF resumes
- **Intelligent Search**: Natural language search with AI-powered candidate matching
- **Real-time Processing**: Live status updates and progress tracking
- **Beautiful UI**: Modern interface built with NextUI and Tailwind CSS

## Architecture

### Frontend (React + TypeScript + NextUI)
- Modern React application with TypeScript
- NextUI components for beautiful, accessible UI
- Real-time communication with backend API
- Responsive design optimized for desktop and tablet

### Backend (FastAPI + Python)
- FastAPI server with async support
- OpenRouter integration for AI processing
- PDF text extraction and parsing
- Vector embeddings for semantic search
- Multi-agent query routing system

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your OpenRouter API key to `.env`:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

5. Create resumes directory:
```bash
mkdir resumes
```

6. Start the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. **Get OpenRouter API Key**: Sign up at [OpenRouter](https://openrouter.ai/) and get your API key
2. **Start Backend**: Run the FastAPI server with your API key configured
3. **Start Frontend**: Launch the React development server
4. **Upload Resumes**: Drag and drop PDF resumes into the upload area
5. **Search Candidates**: Use natural language to search for ideal candidates
6. **Review Results**: Browse AI-analyzed results with relevance scores

## API Endpoints

- `GET /api/status` - Get database status and resume count
- `POST /api/upload` - Upload and process resume files
- `POST /api/search` - Search candidates with AI analysis
- `GET /api/resumes` - Get all processed resumes

## AI Agents

The system uses specialized AI agents for different types of queries:

- **Skill Matcher**: Focuses on technical skills and competencies
- **Experience Analyzer**: Evaluates work history and career progression
- **Relevancy Scorer**: Provides overall relevance scoring and ranking
- **Seniority Detector**: Identifies leadership levels and seniority
- **General Analyzer**: Comprehensive analysis for complex queries

## Requirements

- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- OpenRouter API key
- PDF resumes for testing

## Production Deployment

For production deployment:

1. Build the frontend: `npm run build`
2. Configure environment variables for production
3. Use a production WSGI server like Gunicorn for the backend
4. Set up proper CORS policies
5. Configure file storage and database persistence

Ready for your presentation! 🚀
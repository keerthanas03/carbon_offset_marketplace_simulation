# Carbon Offset Marketplace

A full-stack web application for calculating carbon footprints and exploring carbon offset solutions, powered by AI assistance.

## 🌐 Live Demo

- **Frontend**: https://carbon-offset-marketplace-simulatio.vercel.app/
- **Backend API**: https://carbon-offset-marketplace-simulation.onrender.com

## 🌱 Features

- **Carbon Footprint Calculator**: Calculate emissions from electricity usage and transportation
- **AI Chat Assistant**: Get personalized advice on reducing carbon emissions using Gemini AI
- **Interactive Dashboard**: Visualize your carbon footprint with charts and insights
- **Offset Recommendations**: Discover ways to offset your carbon emissions
- **Import/Export**: Save and share your carbon footprint data

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Chart.js** for data visualization
- **Framer Motion** for animations
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **Supabase** for database
- **Google Gemini AI** for chat assistance
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Google Gemini API key

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/carbon.git
cd carbon
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (use `.env.example` as template):

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5001
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
carbon/
├── backend/
│   ├── index.js          # Express server and API routes
│   ├── .env              # Environment variables (not in git)
│   ├── .env.example      # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── utils/        # Helper functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/
│   └── package.json
├── schema.sql            # Database schema
└── README.md
```

## 🔑 Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `PORT` | Backend server port (default: 5001) |
| `GEMINI_API_KEY` | Google Gemini API key for AI chat |

## 🌐 API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/chat` - Chat with AI assistant
- `POST /api/calculate` - Calculate carbon footprint

## 📊 Database Schema

The application uses Supabase with the following main tables:
- User footprint data
- Carbon offset projects
- Chat history

See `schema.sql` for the complete database structure.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent chat assistance
- Supabase for backend infrastructure
- Chart.js for beautiful data visualizations

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

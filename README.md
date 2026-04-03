# Complete README.md for JalChetna

```markdown
# JalChetna 🌊

### AI-Powered Water-Borne Disease Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)

> **Real-time AI analysis combining environmental data, historical patterns, and predictive modeling for water-borne disease prevention**

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

JalChetna is a comprehensive public health intelligence platform that leverages **Artificial Intelligence** to predict, monitor, and prevent water-borne disease outbreaks. The system aggregates real-time environmental data, analyzes historical disease patterns, and provides actionable insights to health authorities and citizens.

### The Problem We Solve

Water-borne diseases like Cholera, Typhoid, Dysentery, and Hepatitis A affect millions annually. Current challenges include:
- ❌ No unified monitoring systems combining environmental and health indicators
- ❌ Disease outbreaks detected only after cases increase
- ❌ Lack of data analytics tools for regional monitoring
- ❌ Limited public access to risk awareness tools

### Our Solution

JalChetna provides:
- ✅ Real-time environmental monitoring (weather + water quality)
- ✅ AI-powered risk prediction and symptom checking
- ✅ Interactive disease analytics dashboard
- ✅ Geographic risk visualization
- ✅ Professional PDF reports for medical consultation

---

## Features

### 🤖 AI Health Assistant
- **Symptom Checker**: Describe symptoms for AI-powered preliminary diagnosis
- **Image Upload**: Upload skin rash or water sample photos for analysis
- **PDF Reports**: Download professional health assessment reports

### 📊 Risk Intelligence Dashboard
- **Real-time Risk Assessment**: AI analysis of environmental conditions
- **Disease Probability**: Probability percentages for multiple water-borne diseases
- **Preventive Recommendations**: Actionable steps based on risk level
- **Risk Score Visualization**: Interactive score gauge with color coding

### 🗺️ Interactive Risk Map
- **Geographic Risk Visualization**: India map with risk level markers
- **Filter by Risk**: High/Medium/Low risk filtering
- **Popup Details**: Click markers for detailed risk information
- **Real-time Updates**: Latest predictions from AI analysis

### 📚 Disease Encyclopedia
- **20+ Water-Borne Diseases**: Comprehensive information on causes, symptoms, transmission
- **Risk Factors**: Temperature, rainfall, and seasonal patterns
- **Prevention & Treatment**: Evidence-based recommendations
- **Search & Filter**: Find diseases by name, type, or risk level

### 👥 Community Hub
- **Live Health News**: Real-time news from GNews API
- **Community Reports**: User-submitted health issue reports
- **Verified Alerts**: Official health advisories
- **Prevention Tips**: Quick safety guidelines

### 👤 User Profile
- **Account Management**: Registration and secure login
- **Saved Reports**: History of all generated risk assessments
- **Risk Statistics**: High/Medium/Low risk breakdown
- **PDF Downloads**: Access past reports anytime

### 📄 Professional Reports
- **Risk Assessment Reports**: Detailed environmental data + AI analysis
- **Health Assessment Reports**: Symptom-based diagnosis with recommendations
- **Downloadable PDFs**: Print or share with healthcare providers

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router DOM | Navigation |
| Axios | API Calls |
| Leaflet | Interactive Maps |
| jsPDF | PDF Generation |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |

### APIs & Services
| Service | Purpose |
|---------|---------|
| OpenWeatherMap | Real-time weather data |
| Google Gemini AI | Risk analysis & symptom checking |
| GNews API | Live health news |
| CPCB Data | Water quality reference |
| IDSP | Disease surveillance data |

---

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- API Keys (see below)

### Clone Repository
```bash
git clone https://github.com/Hero-Alpha/JalChetna.git
cd JalChetna
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Configure API URL
npm run dev
```

### Running Both Services
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173` to view the application.

---

## Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jalchetna

# APIs
WEATHER_API_KEY=your_openweathermap_key
GEMINI_API_KEY=your_google_gemini_key
GNEWS_API_KEY=your_gnews_api_key

# Authentication
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env)
```env
VITE_API_URL=https://jalchetna.onrender.com/api
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/prediction/analyze` | Generate risk prediction |
| GET | `/api/prediction/:region` | Get prediction by region |
| GET | `/api/prediction/all` | Get all predictions |
| POST | `/api/prediction/symptom-check` | AI symptom analysis |

### Disease Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/disease/trends` | Get disease trends |
| GET | `/api/disease/list` | Get all diseases |
| GET | `/api/disease/summary/:region` | Get disease summary |

### Environment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/environment/current/:region` | Current environmental data |
| GET | `/api/environment/trends/:region` | Environmental trends |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard summary |
| GET | `/api/analytics/risk-distribution` | Risk distribution across regions |

### News
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news/health-news` | Live health news |

---

## Deployment

### Deploy Backend to Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && node server.js`
6. Add environment variables
7. Deploy

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Import project on Vercel
3. Set framework preset: Vite
4. Set root directory: `frontend`
5. Add environment variable: `VITE_API_URL`
6. Deploy

---

## Project Structure

```
jalchetna/
├── backend/
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # External APIs (Weather, Gemini, News)
│   ├── scripts/         # Data import scripts
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── utils/       # Helpers (PDF generator)
│   │   └── App.jsx      # Main component
│   └── public/          # Static assets
│
└── ss/                  # Screenshots for documentation
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

Project Link: [https://github.com/Hero-Alpha/JalChetna](https://github.com/Hero-Alpha/JalChetna)

---

## Acknowledgments

- OpenWeatherMap for weather data
- Google Gemini AI for risk analysis
- GNews API for live health news
- CPCB for water quality reference data
- IDSP for disease surveillance data

---

**Made with ❤️ for Public Health**
```

---

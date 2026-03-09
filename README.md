# ArogyaBot 🩺

**Multilingual AI Health Triage Assistant for India**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-arogya--bot--lac.vercel.app-E07B39?style=flat-square)](https://arogya-bot-lac.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-prancare--ai.onrender.com-5C2D6E?style=flat-square)](https://prancare-ai.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-2D7A4F?style=flat-square)](LICENSE)

---

## What is ArogyaBot?

ArogyaBot is a production-deployed, mobile-first Progressive Web App (PWA) that delivers AI-powered health triage to users in 9 Indian languages. Users describe their symptoms by typing or speaking in their native language; ArogyaBot extracts medical entities from the conversation, generates a structured triage assessment using Llama 3.3-70B, recommends affordable Jan Aushadhi generic medicine alternatives, locates nearby hospitals and clinics on a live map, and lets users download a formatted PDF health report — all without needing to install anything.

The project was built with India's 900M+ underserved population in mind: communities where the nearest qualified doctor can be hours away, where literacy varies, and where healthcare navigation is a daily challenge.

---

## Live Demo

- **Frontend:** https://arogya-bot-lac.vercel.app
- **Backend API:** https://prancare-ai.onrender.com

> **Note:** The backend runs on Render's free tier. On first visit, allow up to 60 seconds for the server to wake from sleep. The UI shows a countdown banner while this happens.

---

## Features

**Multilingual Voice & Text Input**
Supports English, हिन्दी, অসমীয়া, বাংলা, తెలుగు, தமிழ், मराठी, ಕನ್ನಡ, and ગુજરાતી. Voice input uses the Web Speech API with per-language speech recognition codes so users can speak naturally in their dialect.

**AI-Powered Triage**
Powered by Groq's Llama 3.3-70B-Versatile model, the triage engine classifies severity as Mild, Moderate, Urgent, or Emergency and provides contextual health guidance in the user's chosen language.

**Custom Medical NER Pipeline**
A lightweight, custom Named Entity Recognition pipeline extracts structured medical data from free-form text: symptoms, duration, severity cues, body parts, and patient age — without relying on any external NLP APIs.

**Jan Aushadhi Generic Medicine Suggestions**
After symptoms are identified, ArogyaBot queries its medicine database to suggest affordable government-backed generic alternatives with brand-to-generic price comparisons and savings percentages.

**Nearby Facility Finder**
Uses browser geolocation and the OpenStreetMap Overpass API to surface nearby hospitals, clinics, and health centres on an interactive Leaflet.js map.

**Downloadable PDF Health Report**
Generates a formatted PDF summary (via fpdf2) containing the session's symptoms, AI assessment, severity level, recommended medicines, and a medical disclaimer — downloadable in one tap.

**Progressive Web App**
Installable on Android and iOS, with a web app manifest, theme colour, and `100dvh` viewport handling that ensures the layout never gets cropped by mobile browser chrome.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 15 (App Router), TypeScript |
| UI & Animation | Framer Motion, Lucide React |
| Fonts | Fraunces (display), Plus Jakarta Sans (body), JetBrains Mono (mono) |
| Backend Framework | FastAPI, Python 3.11 |
| AI Model | Groq API — Llama 3.3-70B-Versatile |
| Database | MongoDB Atlas |
| PDF Generation | fpdf2 |
| Maps | Leaflet.js, OpenStreetMap Overpass API |
| Voice Input | Web Speech API |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
ArogyaBot/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── chat/page.tsx        # Main chat interface
│   │   │   ├── layout.tsx           # Root layout, fonts, PWA meta
│   │   │   └── globals.css          # Saffron Light theme variables
│   │   ├── components/
│   │   │   ├── MessageBubble.tsx    # Chat message renderer
│   │   │   ├── VoiceButton.tsx      # Mic input with ripple animation
│   │   │   ├── VoiceWaveform.tsx    # Recording indicator
│   │   │   ├── LanguageSelector.tsx # 9-language dropdown
│   │   │   ├── SeverityBadge.tsx    # Triage level pill
│   │   │   ├── EntityTags.tsx       # Extracted symptom tags
│   │   │   ├── MedicineCard.tsx     # Generic alternatives card
│   │   │   ├── FindFacilitiesButton.tsx  # Geolocation + map trigger
│   │   │   ├── FacilityMap.tsx      # Leaflet map modal
│   │   │   └── DownloadReportButton.tsx  # PDF download trigger
│   │   ├── hooks/
│   │   │   └── useVoiceInput.ts     # Web Speech API hook
│   │   ├── lib/
│   │   │   └── api.ts               # Backend API client
│   │   └── types/
│   │       └── chat.ts              # Message & entity type definitions
│   └── public/
│       └── manifest.json            # PWA manifest
│
└── backend/
    ├── main.py                      # FastAPI app, CORS, router registration
    ├── routers/
    │   ├── chat.py                  # POST /api/chat
    │   ├── session.py               # POST /api/session
    │   ├── facility.py              # GET /api/facilities
    │   ├── medicine.py              # GET /api/medicines
    │   ├── pdf_report.py            # POST /api/report/pdf
    │   ├── voice.py                 # POST /api/voice
    │   └── health.py                # GET /api/health
    ├── services/
    │   ├── groq_service.py          # Llama 3.3-70B triage logic
    │   └── ner_service.py           # Custom medical NER pipeline
    └── db/
        └── database.py              # MongoDB Atlas connection
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A MongoDB Atlas cluster (free tier works)
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend Setup

```
cd backend
pip install -r requirements.txt

# Create .env file
echo "MONGODB_URI=your_mongodb_uri" > .env
echo "GROQ_API_KEY=your_groq_api_key" >> .env

uvicorn main:app --reload
```

### Frontend Setup

```
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```

Open [http://localhost:3000/chat](http://localhost:3000/chat) in your browser.

---

## Environment Variables

**Backend (`backend/.env`)**

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GROQ_API_KEY` | Groq API key for Llama 3.3-70B |

**Frontend (`frontend/.env.local`)**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. `https://prancare-ai.onrender.com`) |

---

## Deployment

**Frontend → Vercel**
1. Connect GitHub repo to Vercel
2. Set Root Directory to `frontend`
3. Add `NEXT_PUBLIC_API_URL` environment variable

**Backend → Render**
1. Connect GitHub repo to Render
2. Set Root Directory to `backend`
3. Set Start Command to `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add `MONGODB_URI` and `GROQ_API_KEY` environment variables

---

## Supported Languages

| Language | Code | Voice Support |
|---|---|---|
| English | `en` | ✅ en-IN |
| हिन्दी (Hindi) | `hi` | ✅ hi-IN |
| অসমীয়া (Assamese) | `as` | ✅ as-IN |
| বাংলা (Bengali) | `bn` | ✅ bn-IN |
| తెలుగు (Telugu) | `te` | ✅ te-IN |
| தமிழ் (Tamil) | `ta` | ✅ ta-IN |
| मराठी (Marathi) | `mr` | ✅ mr-IN |
| ગુજરાતી (Gujarati) | `gu` | ✅ gu-IN |
| ಕನ್ನಡ (Kannada) | `kn` | ✅ kn-IN |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/session` | Create a new chat session |
| POST | `/api/chat` | Send a message, receive triage response |
| GET | `/api/facilities` | Find nearby health facilities |
| GET | `/api/medicines` | Get generic medicine suggestions |
| POST | `/api/report/pdf` | Generate and download PDF report |
| GET | `/api/health` | Health check |

---

## Roadmap

- [ ] Aadhaar-linked patient history
- [ ] ABDM (Ayushman Bharat Digital Mission) integration
- [ ] Offline mode with cached triage logic
- [ ] ASHABot integration for community health workers
- [ ] More regional languages (Odia, Punjabi, Malayalam)

---

## Author

**Darpan** — [@darpan-NITS](https://github.com/darpan-NITS)

Built as part of a personal initiative to make healthcare navigation accessible for India's underserved communities.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

> ⚠️ ArogyaBot is an AI-powered triage assistant and is not a substitute for professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.

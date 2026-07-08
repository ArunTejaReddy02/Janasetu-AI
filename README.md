# Janasetu AI

> **Multilingual Civic Demand Intelligence & Prioritization Platform**

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-blueviolet?style=for-the-badge&logo=vercel)](https://janasetu-ai.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](#)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

---

## 📌 Problem Statement

Civic complaint triage and demand tracking are heavily manual, slow, and fragmented across channels (such as web portals, WhatsApp, and voice messages). Elected representatives and municipalities struggle to process citizen requests in multiple languages and identify geographic hotspots or common clusters of community needs. This leads to delayed responses, lack of transparency, and misallocated resources.

**Janasetu AI** bridges this gap by automatically aggregate-clustering citizen submissions, analyzing them using advanced language models, and presenting a prioritized roadmap of development projects to local representatives.

---

## ✨ Key Features

- **🌐 Multi-Channel Intake**: Seamlessly collects community issues from WhatsApp (integrated via Twilio Webhooks), Web Forms, and Voice Submissions.
- **🗣️ Multilingual & Voice Support**: Translates regional language inputs and transcribes voice messages in real time using Google Cloud Speech-to-Text & Gemini.
- **🤖 AI-Driven Entity Extraction**: Automatically extracts facility type, urgency level, location details, and summaries from raw unstructured complaints.
- **📍 Smart DBSCAN Clustering**: Groups geographically and contextually similar complaints into distinct "Demand Hotspots" to highlight widespread community issues.
- **📊 Priority Scoring Engine**: Ranks hotspots based on urgency, volume, population impact, and community feedback, recommending actionable development projects.
- **🗺️ Interactive Dashboard**: Map-based visualization (Leaflet) and metrics dashboard for elected officials to view live hotspots, track projects, and allocate budgets effectively.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, Leaflet (Maps) |
| **Backend** | NestJS, Prisma ORM, BullMQ (Queue management), Express |
| **Databases** | PostgreSQL, Redis (Caching and Queues) |
| **AI / NLP** | Google Gemini API (`@google/generative-ai` for Entity Extraction & Embeddings), Google Cloud Speech-to-Text, Google Cloud Translation |
| **Communications & Infra** | Twilio API (WhatsApp Gateway), Google Maps API, Google Cloud Run (Backend), Vercel (Frontend) |

---

## 🏗️ Architecture Overview

The following diagram illustrates how citizen inputs flow from intake channels to the representative's dashboard:

```mermaid
graph TD
    subgraph Intake Channels
        WA[WhatsApp - Twilio Webhook]
        WEB[Web Portal Form]
        VOICE[Voice Submissions - Audio Upload]
    end

    subgraph Processing Pipeline [NestJS Backend]
        API[API Controller]
        STT[GCP Speech-to-Text / Translate]
        Q[BullMQ Queue]
        GEMINI[Gemini AI - Extraction & Embeddings]
        DBSCAN[DBSCAN Clustering Engine]
        DB[(PostgreSQL Database)]
        RD[(Redis Cache / Store)]
    end

    subgraph Representative Interface
        DASH[React Dashboard]
        MAP[Interactive Leaflet Map]
    end

    WA --> API
    WEB --> API
    VOICE --> STT --> API
    API --> RD
    API --> Q
    Q --> GEMINI
    GEMINI --> DBSCAN
    DBSCAN --> DB
    DB --> DASH
    DASH --> MAP
```

---

## 🚀 Live Demo

The platform is deployed and accessible at:
👉 **[janasetu-ai.vercel.app](https://janasetu-ai.vercel.app)**

---

## ⚙️ Getting Started & Local Setup

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18+)
- **PostgreSQL**
- **Redis**

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` directory (you can copy `.env.example` as a template):
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in the required keys:
   ```env
   # Database connection
   DATABASE_URL="postgresql://username:password@localhost:5432/janasetu_db"

   # Google Gemini API Key (Get at: https://aistudio.google.com/app/apikey)
   GEMINI_API_KEY="your-gemini-api-key"

   # Redis Configuration
   REDIS_URL="redis://localhost:6379"

   # Twilio Credentials (For WhatsApp Integration)
   TWILIO_ACCOUNT_SID="your-twilio-sid"
   TWILIO_AUTH_TOKEN="your-twilio-token"
   TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"

   # Google Cloud Credentials (Optional - for Voice STT/Translation)
   GOOGLE_CLOUD_PROJECT_ID="your-gcp-project-id"
   GOOGLE_APPLICATION_CREDENTIALS="./gcp-credentials.json"
   ```

4. Run Database Migrations and Seed:
   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   ```

5. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   The backend server will run on `http://localhost:3000/api`.

---

### 2. Frontend Setup

1. Navigate back to the root directory:
   ```bash
   cd ..
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Configure Frontend Environment (Optional):
   By default, the frontend is configured to run with mock data or connect to the backend running locally. You can specify a custom backend URL by creating a `.env` file in the root directory:
   ```env
   VITE_API_URL="http://localhost:3000/api/v1"
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 📂 Repository Structure

```filepath
Janasetu-AI/
├── backend/                  # NestJS API backend
│   ├── prisma/               # Database schemas, migrations, and seeds
│   ├── src/                  # NestJS TypeScript code (modules, controllers, AI pipeline)
│   ├── Dockerfile            # Container definition for Google Cloud Run
│   └── docker-compose.yml    # Local services (PostgreSQL, Redis) configuration
├── src/                      # React frontend codebase
│   ├── components/           # Reusable UI widgets and cards
│   ├── pages/                # Views (Dashboard, Submission Details, Projects, Map)
│   ├── services/             # API client and integrations
│   └── index.css             # Tailwind v4 utility styles
├── public/                   # Static assets
├── package.json              # Frontend scripts and dependencies
└── README.md                 # Project documentation
```

---

## 👥 Contributors & Tracks

This project was built for a hackathon by a 4-person team:

- **[Contributor 1]** — Infrastructure, Docker, and Google Cloud Run Deployment.
- **[Contributor 2]** — AI/NLP pipeline & Entity Extraction with Gemini.
- **[Contributor 3]** — Geolocation mapping, DBSCAN clustering, & prioritization scoring.
- **[Contributor 4]** — React Frontend, Tailwind styling, & WhatsApp Twilio Integration.

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the `LICENSE` file for details (or backend package.json reference).

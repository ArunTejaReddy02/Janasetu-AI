# JanaSetu-AI Backend Architecture

## Overview

The JanaSetu-AI backend is a modular NestJS application that processes citizen submissions across multiple languages and channels to identify civic demand hotspots and recommend priority development projects.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (NestJS)                    │
│  Auth │ Users │ Submissions │ Hotspots │ Recommendations     │
│  Projects │ Analytics │ Notifications │ Settings │ AI        │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
    ┌─────▼──┐  ┌─────▼──┐  ┌────▼───┐
    │PostgreSQL│  │ Redis  │  │BullMQ  │
    │(PostGIS) │  │(Cache) │  │Queues  │
    └──────────┘  └────────┘  └────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │         AI Workers           │
                    │ STT │ Translation │ NER      │
                    │ Clustering │ Ranking         │
                    └─────────────────────────────┘
```

## Module Breakdown

| Module         | Status     | Description                          |
|----------------|------------|--------------------------------------|
| Auth           | ✅ Module 1 | JWT auth, RBAC, refresh tokens       |
| Users          | ✅ Module 1 | User CRUD, roles                     |
| Submissions    | 🔲 Module 2 | Multi-channel intake, file upload    |
| AI Pipeline    | 🔲 Module 3 | STT, Translation, NER, Embedding     |
| Hotspots       | 🔲 Module 4 | DBSCAN clustering, geo analysis      |
| Recommendations| 🔲 Module 5 | Composite scoring, ranking engine    |
| Projects       | 🔲 Module 6 | Project lifecycle management         |
| Analytics      | 🔲 Module 7 | Dashboard stats, snapshots           |
| Notifications  | 🔲 Module 8 | WhatsApp, Email, SMS dispatch        |
| Settings       | 🔲 Module 9 | Dynamic platform configuration       |

## Data Flow

1. **Submission Intake** → Channel detection (Web/WhatsApp/Voice)
2. **AI Processing Queue** → STT → Translation → NER → Embedding
3. **Geographic Clustering** → DBSCAN on (lat, lon, category)
4. **Hotspot Detection** → Threshold crossing triggers hotspot
5. **Composite Ranking** → Urgency × Impact × Feasibility × Cost-Benefit
6. **Recommendation Generation** → LLM-assisted action plan
7. **Notification Dispatch** → WhatsApp/Email to ward officers

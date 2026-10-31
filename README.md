# Vigil Green GIS — Gia Lai Deforestation Risk Monitoring & Crowdsourcing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20PostGIS-336791?logo=postgresql)](https://postgis.net/)
[![MapLibre](https://img.shields.io/badge/Map-MapLibre%20GL%20JS-blue)](https://maplibre.org/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)

**Vigil Green GIS** (the Gia Lai Province deforestation-risk warning system) is a web GIS platform that combines a **machine-learning model** predicting deforestation risk on a 1 km × 1 km grid with a **crowdsourced field-reporting system**.

> 💡 **Mission:** *VIGIL combines satellite data, AI and field surveys to detect and map deforestation risk early, so conservation action in Vietnam and beyond can be faster and better targeted.*

- 🌐 **Website:** [www.vigil.green](https://www.vigil.green/) (Vietnamese and English)
- 📄 **IDSOL 2026 — ETO submission:** [Whitepaper](eto-competition/VIGIL_IDSOL2026_Whitepaper.pdf) · [Poster](eto-competition/VIGIL_IDSOL2026_Poster.pdf) · [Pitch deck](eto-competition/VIGIL_IDSOL2026_Pitch_Deck.pdf) — Pham Duy Long, Nguyen Duc Anh, Do Nhat Quang (2026)

---

## 📋 Contents
1. [Overview](#-overview)
2. [Core Features](#-core-features)
3. [System Architecture & Data Flow](#-system-architecture--data-flow)
4. [Tech Stack](#-tech-stack)
5. [Repository Layout](#-repository-layout)
6. [Installation & Running](#-installation--running)
7. [Environment Variables](#-environment-variables)
8. [API Endpoints](#-api-endpoints)
9. [Technical Documentation](#-technical-documentation)
10. [ETO Competition Resources](#-eto-competition-resources)

---

## 📌 Overview

Deforestation is one of the most pressing environmental problems in Gia Lai Province. Monitoring today is mostly reactive: forest loss is recorded only after the trees are gone. **Vigil Green GIS** addresses this by:

1. **Moving from reactive monitoring to proactive prediction:** a machine-learning model built on four public datasets (Hansen Global Forest Change, NASA SRTM, CHIRPS rainfall and Sentinel-2) ranks forest areas by deforestation risk on a 1 km × 1 km grid.
2. **A crowdsourced reporting channel:** residents and forest rangers can file field reports straight from the map, with GPS coordinates and photos taken on site.
3. **Patrol efficiency (capture rate in the top 5%):** rangers can focus their limited resources on the **top 5%** highest-risk cells first instead of spreading patrols across the whole forest.

---

## ✨ Core Features

### 🗺️ 1. Interactive Multi-Basemap Map (Web GIS Engine)
- Smooth **60 FPS** rendering of terrain and deforestation-risk layers with the open-source **MapLibre GL JS**.
- Switchable basemaps: `Dark Mode` (high contrast), `Light Mode` and `Satellite`.
- More than **6,000 grid cells** displayed at once, each with its geographic and ecological attributes.

### 🎛️ 2. Real-Time Multi-Criteria Filters
- **Time slider (2001–2024):** follow the history of forest loss year by year.
- **Four terrain and climate sliders:**
  - **Slope** (°)
  - **Elevation** above sea level (m)
  - **Tree Cover 2000**, the baseline forest cover (%)
  - **Annual Rainfall**, mean annual precipitation (mm)
- Filtering runs client-side in the browser, so the map responds instantly.

### 📸 3. Crowdsourced Field Reporting
- **Click-to-report:** click anywhere on the map to open the report form.
- **Photo & notes upload:** attach on-site photos (`.jpg`, `.png`, ≤ 5 MB) and field comments.
- **IP hashing & privacy:** reporter IPs are salted and hashed with `SHA-256` rather than stored in plain text, and submissions are rate-limited (at most 3 reports per 10 minutes per IP) to block spam.
- **Map markers:** approved reports are stored in **PostGIS** and appear immediately as interactive markers with an info popup.

### 🧠 4. Machine-Learning Model
- A baseline score (z-score) is compared with **logistic regression** and **random forest** on the 1 km grid. On the provided split (1,212 test cells), random forest reaches **AUC = 0.861** and logistic regression **AUC = 0.817** (whitepaper, Table II(A)).
- **Area transfer validation:** the model is trained entirely on K'Bang District and tested "blind" on Mang Yang District. AUC drops to **0.589** (logistic) and **0.535** (random forest) because of geographic differences (Table II(B)); the simpler model transfers better. Extending to other provinces requires local re-validation.
- The web map uses a model refitted on all 6,000 cells, so it is a **prioritisation layer**, not an accuracy measure.

---

## 🏗️ System Architecture & Data Flow

The system follows a **client–server** architecture with a **spatial database**:

```mermaid
graph TD
    %% Client Tier
    subgraph Frontend [Client / Browser]
        UI[Next.js 16 UI & TailwindCSS]
        Map[MapLibre GL JS Map Engine]
        UI <--> Map
    end

    %% API Tier
    subgraph Backend [Server API - FastAPI]
        API[FastAPI Router]
        Auth[JWT & IP SHA-256 Auth]
        ORM[SQLAlchemy / GeoAlchemy2]
        API --> Auth
        API <--> ORM
    end

    %% Data Tier
    subgraph Database [Spatial Database]
        DB[(PostgreSQL + PostGIS Extension)]
    end

    %% Data Pipeline Tier
    subgraph DataPipeline [Data Pipeline ETL]
        ETL[GeoPandas / Python]
        CSV[(Raw CSV / ML output)]
        GeoJSON[(grid_data.geojson)]
        CSV --> ETL
        ETL --> GeoJSON
    end

    %% Connections
    Frontend -- REST API / Uploads --> API
    GeoJSON -- Serving Static --> Frontend
    ORM <--> DB
    API -- Save Uploaded Files --> LocalStorage[(Local Storage /uploads)]
```

---

## 🛠️ Tech Stack

| Layer | Technology / Library | Version | Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) | 16.x | Full-stack React framework rendering the UI |
| | [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| | [MapLibre GL JS](https://maplibre.org/) | 5.x | Web GIS library for vector maps and heatmaps |
| | [TailwindCSS](https://tailwindcss.com/) | 4.x | Modern, responsive styling |
| | [Framer Motion](https://www.framer.com/motion/) | 12.x | Transitions and micro-animations |
| **Backend** | [Python](https://www.python.org/) | 3.9+ | Backend language |
| | [FastAPI](https://fastapi.tiangolo.com/) | Latest | High-performance REST API framework |
| | [SQLAlchemy](https://www.sqlalchemy.org/) | 2.x | ORM for the relational database |
| | [GeoAlchemy2](https://geoalchemy2.readthedocs.io/) | Latest | PostGIS spatial types |
| | [Pillow](https://python-pillow.org/) | Latest | Pre-processing and resizing uploaded images |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | 15.x | Relational database |
| | [PostGIS](https://postgis.net/) | 3.3+ | Spatial extension for coordinates (SRID 4326) |
| **Data Pipeline**| [GeoPandas](https://geopandas.org/) / Shapely | Latest | Converts the model's CSV predictions into static GeoJSON |
| **DevOps** | [Docker](https://www.docker.com/) & Docker Compose | Latest | Containerises the whole system |
| | [PM2](https://pm2.keymetrics.io/) & Nginx | Latest | Background processes and reverse proxy in production |

---

## 📂 Repository Layout

```text
vigil-green-gis/
├── backend/                      # Server API (Python FastAPI)
│   ├── tests/                    # API tests
│   ├── uploads/                  # Field-report photos
│   ├── auth.py                   # JWT login and admin checks
│   ├── database.py               # PostgreSQL / SQLAlchemy connection
│   ├── main.py                   # FastAPI entry point
│   ├── models.py                 # Database models & PostGIS geometry
│   ├── schemas.py                # Pydantic schemas validating API data
│   ├── Dockerfile                # Backend image
│   └── requirements.txt          # Python dependencies
├── frontend/                     # Web UI (Next.js 16)
│   ├── public/                   # Static assets
│   │   ├── data/                 # GeoJSON layers shown on the map
│   │   └── papers/               # Whitepaper and poster served at /papers/
│   ├── src/                      # React components & pages
│   │   ├── app/                  # Next.js App Router pages (home, about, map, publication, contact, admin)
│   │   ├── components/           # Map, sidebar, forms, controls
│   │   ├── context/              # Language (VI/EN) context
│   │   └── locales/              # Vietnamese and English UI strings
│   ├── Dockerfile                # Frontend image
│   └── package.json              # Frontend dependencies
├── data-pipeline/                # ETL scripts
│   └── csv_to_geojson.py         # Converts CSV predictions to static GeoJSON
├── docs/                         # Detailed technical documentation
│   ├── TRD_Architecture.md       # System architecture
│   ├── Technical_Requirements_Document.md # Technical requirements & API specs
│   ├── Data_Flow.md              # Data flow and interactive filters
│   ├── ML_Evaluation_Methodology.md # Model methodology & evaluation
│   └── Runbook.md                # Operations & deployment guide
├── eto-competition/              # IDSOL 2026 (ETO) whitepaper, poster and pitch deck
├── docker-compose.yml            # Docker Compose setup (development)
└── README.md                     # This file
```

---

## ⚡ Installation & Running

### 🐳 Option 1: Docker Compose (recommended)

This sets up the PostgreSQL (PostGIS) database, the FastAPI backend and the Next.js frontend with **a single command**.

#### Requirements: [Docker Engine](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pdlong-09/vigil-green-gis.git
   cd vigil-green-gis
   ```

2. **Start the whole stack:**
   ```bash
   docker-compose up --build -d
   ```

3. **Open the application:**
   - 🌐 **Website frontend:** `http://localhost:3000`
   - 📑 **API documentation (Swagger UI):** `http://localhost:8000/docs`
   - 🗄️ **PostGIS database:** `localhost:5433` from the host, `db:5432` inside the Docker network (`gialai_forest`)

4. **Stop the stack:**
   ```bash
   docker-compose down
   ```

---

### 💻 Option 2: Manual Setup (development)

#### 1. Prepare the database (PostgreSQL + PostGIS)
- Create a database named `gialai_forest` in PostgreSQL.
- Enable the PostGIS extension:
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis;
  ```

#### 2. Pre-process the map data (data pipeline)
Convert the raw data file to `.geojson`:
```bash
python data-pipeline/csv_to_geojson.py
```
*(The output `grid_data.geojson` is written to `frontend/public/data/`.)*

#### 3. Start the backend (FastAPI)
```bash
cd backend
python -m venv venv
# Linux/macOS: source venv/bin/activate
# Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create the .env file
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gialai_forest" > .env
echo "SALT_SECRET=my_super_secret_salt_2026" >> .env

# Run the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 4. Start the frontend (Next.js)
```bash
cd ../frontend
npm install

# (Optional) create .env.local if the API runs on another port
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```
Open the application at `http://localhost:3000`.

---

### 🌐 Option 3: Production Deployment (PM2 & Nginx)

On a Linux production server, use **PM2** to keep the services running 24/7 and **Nginx** as the reverse proxy:

```bash
# 1. Build the frontend
cd frontend
npm run build

# 2. Install PM2 and start the processes
npm install -g pm2

# Start the backend
cd ../backend
pm2 start "uvicorn main:app --host 127.0.0.1 --port 8000" --name "gialai-backend"

# Start the frontend
cd ../frontend
pm2 start npm --name "gialai-frontend" -- start

# Restart automatically with the OS
pm2 save
pm2 startup
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/gialai_forest
SALT_SECRET=your_super_secret_salt_string_2026
SECRET_KEY=your_jwt_secret_key
ADMIN_PASSWORD=your_first_admin_password
```

- `SECRET_KEY` signs the JWTs and `SALT_SECRET` salts the reporter IP hashes. If either is empty, the backend generates a random value at each start (logins then end when the server restarts).
- `ADMIN_PASSWORD` is used only when the `admin` account is first created. If it is empty, the backend generates a random password and prints it once in the log.
- To generate a random value: `python -c "import secrets; print(secrets.token_urlsafe(48))"`. Never commit these values.

### Frontend (`frontend/.env.local` or Docker `--build-arg`)
```env
# NOTE: Next.js embeds NEXT_PUBLIC_* variables into the bundle at BUILD TIME.
# When building the Docker image, pass them via build.args in docker-compose.yml or --build-arg.
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 API Endpoints

FastAPI generates full interactive documentation at **`http://localhost:8000/docs`**. The main endpoints are:

| Method | API path | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reports` | Create a field report (coordinates + photo + comment) | Public (rate-limited) |
| `GET` | `/api/reports` | List all field reports | Public |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Log in and receive a JWT bearer token | Public |
| `POST` | `/api/contact` | Send a contact message | Public |
| `GET` | `/api/contact` | List contact messages | Admin only |
| `GET` | `/api/about` | Get the About page content (CMS) | Public |
| `POST` | `/api/about` | Update the About page content | Admin only |

---

## 📚 Technical Documentation

The [`docs/`](docs/) folder holds the full technical documentation:

- 🏛️ **[TRD_Architecture.md](docs/TRD_Architecture.md):** the client–server architecture, the spatial database design and how the code is isolated.
- 📋 **[Technical_Requirements_Document.md](docs/Technical_Requirements_Document.md):** functional (FR) and non-functional (NFR) requirements, PostgreSQL table structure and security standards.
- 🔄 **[Data_Flow.md](docs/Data_Flow.md):** the static (AI GeoJSON) and dynamic (field report) data flows and the 60 FPS filtering.
- 🧠 **[ML_Evaluation_Methodology.md](docs/ML_Evaluation_Methodology.md):** model training methodology, the area-transfer validation and the evaluation metrics (AUC, Cap@5%/10%).
- 📖 **[Runbook.md](docs/Runbook.md):** installation, operation, maintenance and troubleshooting in production.

---

## 🏆 ETO Competition Resources

This platform was built for **IDSOL 2026 — Emerging Technologies Olympiads (ETO)**. The VIGIL team's submission (Pham Duy Long, Nguyen Duc Anh, Do Nhat Quang) is in [`eto-competition/`](eto-competition/):

- 📄 **[Whitepaper](eto-competition/VIGIL_IDSOL2026_Whitepaper.pdf):** a 5-page paper on the pipeline, the results and the path to nationwide scale.
- 🖼️ **[Poster](eto-competition/VIGIL_IDSOL2026_Poster.pdf):** the IDSOL26VN posterboard.
- 🎤 **[Pitch deck](eto-competition/VIGIL_IDSOL2026_Pitch_Deck.pdf):** 26 presentation slides, including the business plan.

---
*© 2026 Vigil Green GIS — Gia Lai Deforestation Risk Monitoring Platform.*

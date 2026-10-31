# Installation & Operations Guide (Runbook)

**Project:** Gia Lai Deforestation Risk Map (Web GIS)

This document walks through starting the whole system (frontend + backend) on a local machine (development) and deploying it on a real server (production). Paths are relative to the repository root.

---

## 1. Prerequisites
Before you start, the machine/server needs:
1. **Node.js** (version >= 20.9.0) — *runs the Next.js frontend.*
2. **Python** (version >= 3.9) — *runs the FastAPI backend and the data pipeline.*
3. **PostgreSQL** (with the **PostGIS** extension) — *the spatial database.*

---

## 2. Database Setup (PostgreSQL)
1. Open a database tool (such as pgAdmin or DBeaver).
2. Create a new database, for example `gialai_forest`.
3. Run this SQL to enable PostGIS (required to store map coordinates):
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

---

## 3. Starting the Backend (FastAPI)

Open a terminal and run:

### Step 3.1. Install the dependencies
```bash
cd backend

# (Optional) create a virtual environment
python -m venv venv
# Activate (Windows): venv\Scripts\activate
# Activate (Mac/Linux): source venv/bin/activate

# Install the dependencies
pip install -r requirements.txt
```

### Step 3.2. Configure the environment variables
Create a file named `.env` in `backend/` with the following content (change the user/password to match your database):
```env
DATABASE_URL=postgresql://postgres:123456@localhost:5432/gialai_forest
SALT_SECRET=my_super_secret_salt_2026
SECRET_KEY=change_me_to_a_random_value
ADMIN_PASSWORD=change_me_too
```

### Step 3.3. Run the server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
👉 Once running, the API is available at `http://localhost:8000`.
The API documentation (Swagger UI) is at `http://localhost:8000/docs`.

---

## 4. Starting the Frontend (Next.js)

Open a **new** terminal (keep the backend running):

### Step 4.1. Install the dependencies
```bash
cd frontend
npm install
```

### Step 4.2. Configure the environment variables (optional)
Create `.env.local` in `frontend/` (only if the backend does not run on the default port 8000):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 4.3. Run the server
```bash
npm run dev
```
👉 The website is available at `http://localhost:3000`.

---

## 5. Updating the Map Data (Data Pipeline)
The map reads its data from a static `.geojson` file. Whenever there is a new `CSV` (for example after the data team re-runs the ML model or adds columns such as NDVI or NBR), update the map as follows:

1. Put the new CSV in the `data/` folder.
2. Update the file path in `data-pipeline/csv_to_geojson.py` (if the file name changed).
3. Run:
   ```bash
   python data-pipeline/csv_to_geojson.py
   ```
4. The script writes `grid_data.geojson` and overwrites it in `frontend/public/data/`.
5. Reload the website (F5) and the map shows the new data immediately.

---

## 6. Production Deployment (real server)

On a real server, do not use `npm run dev` or `uvicorn --reload`; they are not stable under load. Use **PM2** (process manager).

**1. Build the frontend:**
```bash
cd frontend
npm run build
```

**2. Install PM2 and run in the background:**
```bash
npm install -g pm2

# Start the backend
cd ../backend
pm2 start "uvicorn main:app --host 127.0.0.1 --port 8000" --name "gialai-backend"

# Start the frontend
cd ../frontend
pm2 start npm --name "gialai-frontend" -- start

# Save the state so everything restarts when the server reboots
pm2 save
pm2 startup
```

The system now runs reliably in the background 24/7. You can add Nginx as a reverse proxy to attach a domain (e.g. `gialai-forest.com`) instead of using port 3000.

---

## 7. Deployment with Docker Compose (recommended for servers/production)

This installs the PostgreSQL database (with PostGIS), the backend and the frontend with a single command and avoids environment conflicts entirely.

**Requirements:** the machine/server has [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

**1. Go to the repository root:**
```bash
cd vigil-green-gis
```

**2. Adjust the parameters (if needed):**
Open `docker-compose.yml`. In the `frontend` service, `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000`. When deploying to a VPS/server with a domain or public IP, change it to your real domain/IP.

**3. Build and start the system:**
```bash
docker-compose up --build -d
```
This pulls the PostGIS image, builds the FastAPI (backend) image and builds the Next.js (frontend) image automatically. `-d` runs everything in the background.

**4. Status:**
- Frontend (website): `http://localhost:3000`
- Backend API docs: `http://localhost:8000/docs`
- Database: port `5432` inside the Docker network, published on the host as `5433`.

**5. Stop the system:**
```bash
docker-compose down
```
Note: database data and uploaded images persist in Docker volumes (`postgres_data` and `backend_uploads`) and are not lost when running `down`.

# Technical Requirements Document (TRD)

**Project:** Gia Lai Deforestation Risk Map (Web GIS)  
**Version:** 1.0.0  
**Last updated:** June 2026  

---

## 1. Purpose
This document specifies the technical requirements, data structures and API contract that the frontend and backend developers build the Gia Lai Deforestation Warning Map platform against.

## 2. Core Functional Requirements

### 2.1. Map module
*   **FR1.1 – Map initialisation:** the map is rendered with **MapLibre GL JS**, centred by default on Gia Lai Province `[108.46, 14.10]` at zoom level `10`.
*   **FR1.2 – Basemaps:** a toggle in the UI switches between `Dark Mode` (Carto Dark Matter) and `Light Mode/Satellite`.
*   **FR1.3 – Spatial data loading:** the static file `grid_data.geojson` is fetched from `public/data/` and loaded as grid features.
*   **FR1.4 – Data styling:** forest-loss (or risk) points are drawn as high-contrast `circle` features: transparent fill (`rgba(255,0,0,0.2)`) with a neon-red outline (`#ff0055`, 2 px).
*   **FR1.5 – Time slider filter:** when the user changes the year (2001 → 2024), the map immediately shows or hides points by their `loss_first_year` field, using `0 < loss_first_year <= current_year`.

### 2.2. Check-in & field report module
*   **FR2.1 – Click capture:** when the user clicks anywhere on the map, its `[Lng, Lat]` coordinates are passed to the report form.
*   **FR2.2 – Input:** the user can enter up to 1,000 characters of text and upload at most one `JPG/PNG` image of no more than `5MB`.
*   **FR2.3 – Anonymity & IP hashing:** no login is required. The system takes the client IP, appends a `SALT` string and stores its `SHA-256` hash in the database (to tell users apart while keeping them private).
*   **FR2.4 – Check-in list:** reported points are shown on the map as pins/markers. Clicking a marker opens a popup with the comment and the image.

## 3. API Specifications (FastAPI)

All APIs are protected by a **CORS policy** (only the internal domain and `localhost:3000` are allowed).

### 3.1. Create a report (POST `/api/reports`)
*   **Content-Type:** `multipart/form-data`
*   **Payload:**
    *   `lat` (float, required): latitude.
    *   `lon` (float, required): longitude.
    *   `comment` (string, optional): field comment.
    *   `file` (file, optional): evidence photo (.jpg/.png).
*   **Server processing:**
    *   Check the image format and save it to `/uploads/{uuid}.jpg`.
    *   Build a WKT object (`POINT(lon lat)`) to store in PostGIS.
*   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "lat": 14.123,
      "lon": 108.456,
      "comment": "The forest here is being cut down",
      "image_url": "/uploads/a1b2c3d4.jpg",
      "created_at": "2026-06-10T15:30:00Z"
    }
    ```

### 3.2. List reports (GET `/api/reports`)
*   **Content-Type:** `application/json`
*   **Response (200 OK):** a JSON array of all stored reports. PostGIS coordinates are parsed into `lat`/`lon` automatically.

## 4. Database Schema

**PostgreSQL** with the **PostGIS** extension.

| Table | Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `field_reports` | `id` | Integer / UUID | Primary key, auto increment | Primary key |
| | `geom` | Geometry(POINT, 4326) | Not null | Spatial coordinates (SRID 4326) |
| | `comment` | Text | Nullable | Report text |
| | `image_url` | Varchar(255) | Nullable | Local image path `/uploads/...` |
| | `user_ip_hash` | Varchar(64) | Index | SHA-256 hashed IP (64 characters) |
| | `created_at` | Timestamptz | Default: `now()` | Submission time |

## 5. Non-Functional Requirements

*   **NFR1 – Performance:**
    *   The check-in list API (GET `/api/reports`) responds in under `200ms` for fewer than 10,000 records.
    *   MapLibre loads the GeoJSON for the whole study area (~6,000 cells) smoothly at no less than 30 FPS.
*   **NFR2 – Security:**
    *   Apply `rate limiting` (e.g. at most 5 reports per minute per IP) against spam.
    *   Uploaded file names are random `UUID`s so they cannot be guessed (prevents directory traversal).
*   **NFR3 – Compatibility:**
    *   The frontend UI is responsive: it works on laptop screens (from `1024px`) and tablets.
    *   Supported browsers: latest Chrome, Edge, Safari and Firefox.

## 6. Environment Variables

### 6.1. Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
SALT_SECRET=your_super_secret_salt_string_here
SECRET_KEY=your_jwt_secret_key
ADMIN_PASSWORD=your_first_admin_password
```

### 6.2. Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://<domain_or_server_ip>:8000/api
```

# Vigil Green GIS — Gia Lai Deforestation Risk Monitoring & Crowdsourcing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20PostGIS-336791?logo=postgresql)](https://postgis.net/)
[![MapLibre](https://img.shields.io/badge/Map-MapLibre%20GL%20JS-blue)](https://maplibre.org/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)

**Vigil Green GIS** (Hệ thống Cảnh báo Nguy cơ Mất rừng Tỉnh Gia Lai) là một giải pháp Web GIS toàn diện kết hợp **Mô hình Machine Learning (AI)** dự báo rủi ro tàn phá rừng ở độ phân giải 1km x 1km với **Hệ thống Báo cáo Thực địa Cộng đồng (Crowdsourced Field Reporting)** theo thời gian thực.

> 💡 **Sứ mệnh Dự án:** *VIGIL tích hợp dữ liệu ảnh vệ tinh, trí tuệ nhân tạo (AI) cùng khảo sát thực địa nhằm phát hiện sớm đồng thời trực quan hóa các nguy cơ mất rừng trên bản đồ, từ đó thúc đẩy hành động bảo tồn nhanh chóng, hiệu quả hơn tại Việt Nam và trên toàn cầu.*

---

## 📋 Mục Lục
1. [Giới Thiệu Tổng Quan](#-giới-thiệu-tổng-quan)
2. [Tính Năng Cốt Lõi](#-tính-năng-cốt-lõi)
3. [Kiến Trúc Hệ Thống & Luồng Dữ Liệu](#-kiến-trúc-hệ-thống--luồng-dữ-liệu)
4. [Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
5. [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
6. [Hướng Dẫn Cài Đặt & Khởi Chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
7. [Cấu Hình Biến Môi Trường](#-cấu-hình-biến-môi-trường)
8. [Tóm Tắt API Endpoints](#-tóm-tắt-api-endpoints)
9. [Chỉ Mục Tài Liệu Kỹ Thuật (Docs)](#-chỉ-mục-tài-liệu-kỹ-thuật-docs)

---

## 📌 Giới Thiệu Tổng Quan

**VIGIL** tích hợp dữ liệu ảnh vệ tinh, trí tuệ nhân tạo (AI) cùng khảo sát thực địa nhằm phát hiện sớm đồng thời trực quan hóa các nguy cơ mất rừng trên bản đồ, từ đó thúc đẩy hành động bảo tồn nhanh chóng, hiệu quả hơn tại Việt Nam và trên toàn cầu.

Tàn phá rừng là một trong những thách thức môi trường cấp thiết tại Tỉnh Gia Lai. Phương pháp thống kê truyền thống thường thụ động (chỉ ghi nhận khi rừng đã bị chặt phá). **Vigil Green GIS** được xây dựng nhằm giải quyết bài toán này bằng cách:

1. **Chuyển từ Giám sát Thụ động sang Dự báo Chủ động (Proactive Monitoring):** Sử dụng mô hình Machine Learning tích hợp dữ liệu vệ tinh đa nguồn (Hansen GFW, NASA SRTM, CHIRPS, OpenStreetMap) để dự báo sớm các khu vực rừng có rủi ro cao ở quy mô lưới 1km x 1km.
2. **Kênh Đóng góp Cộng đồng (Crowdsourcing Field Reports):** Cho phép người dân, lực lượng kiểm lâm gửi báo cáo thực địa trực tiếp từ bản đồ kèm tọa độ GPS và hình ảnh chụp tại hiện trường.
3. **Hiệu quả Tuần tra (Capture Rate Top 5%):** Định hướng lực lượng kiểm lâm tập trung nguồn lực vào **Top 5%** khu vực có nguy cơ cao nhất thay vì phải dàn trải tuần tra hàng triệu hecta rừng.

---

## ✨ Tính Năng Cốt Lõi

### 🗺️ 1. Bản Đồ Tương Tác Đa Nền (Web GIS Engine)
- Render dữ liệu địa hình và lớp phủ rủi ro mất rừng mượt mà ở tốc độ **60 FPS** với **MapLibre GL JS** (mã nguồn mở).
- Hỗ trợ chuyển đổi giao diện linh hoạt giữa các chế độ: `Dark Mode` (Tối ưu tương phản), `Light Mode` và `Satellite` (Ảnh vệ tinh).
- Hiển thị đồng thời hơn **6,000 ô lưới không gian (cells)** cùng thuộc tính địa lý sinh thái.

### 🎛️ 2. Bộ Lọc Động Đa Tiêu Chí Real-time (Multi-Criteria Filter)
- **Time Slider (2001 - 2024):** Theo dõi lịch sử và diễn biến mất rừng qua các năm.
- **4 Thanh trượt Địa hình & Khí hậu:**
  - **Slope (Độ dốc):** Lọc theo độ dốc địa hình (°).
  - **Elevation (Độ cao):** Lọc theo độ cao so với mực nước biển (m).
  - **Tree Cover 2000 (Độ che phủ):** Lọc theo độ che phủ rừng ban đầu (%).
  - **Annual Rainfall (Lượng mưa):** Lọc theo lượng mưa trung bình hàng năm (mm).
- Phản hồi sinh thái học tức thì (Client-side filtering) trên trình duyệt không bị trễ.

### 📸 3. Báo Cáo Thực Địa Cộng Đồng (Crowdsourcing Field Reporting)
- **Click-to-Report:** Nhấp trực tiếp vào bất kỳ vị trí nào trên bản đồ để mở Form gửi báo cáo.
- **Upload Ảnh & Ghi chú:** Đính kèm hình ảnh hiện trường (`.jpg`, `.png` <= 5MB) và nhận xét thực địa.
- **Mã hóa IP & Bảo mật:** Sử dụng thuật toán `SHA-256` kết hợp `Salt secret` băm mã hóa IP người dùng, bảo vệ danh tính 100% nhưng vẫn ngăn chặn hành vi spam (Rate limiting: Tối đa 3 báo cáo / 10 phút / IP).
- **Trực quan hóa Marker:** Báo cáo sau khi duyệt được lưu vào **PostGIS** và hiển thị tức thì dưới dạng Marker tương tác có Popup thông tin.

### 🧠 4. Tích Hợp Mô Hình AI / Machine Learning
- So sánh điểm tham chiếu (z-score) với **Hồi quy Logistic** và **Random Forest** trên lưới 1 km. Trên tập chia sẵn (1.212 ô kiểm tra), Random Forest đạt **AUC = 0.861**, Hồi quy Logistic đạt **AUC = 0.817** (whitepaper, Bảng II(A)).
- **Area Transfer Validation:** Mô hình được huấn luyện 100% tại Huyện K'Bang và kiểm thử "dự đoán mù" tại Huyện Mang Yang. AUC giảm còn **0.589** (Logistic) và **0.535** (Random Forest) do khác biệt địa lý (Bảng II(B)); mô hình đơn giản chuyển vùng tốt hơn. Mở rộng ra tỉnh khác cần kiểm chứng lại bằng dữ liệu địa phương.
- Bản đồ trên web dùng mô hình huấn luyện lại trên toàn bộ 6.000 ô, nên là lớp **xếp hạng ưu tiên**, không phải thước đo độ chính xác.

---

## 🏗️ Kiến Trúc Hệ Thống & Luồng Dữ Liệu

Hệ thống được thiết kế theo kiến trúc **Client-Server** kết hợp **Spatial Database** hiện đại:

```mermaid
graph TD
    %% Client Tier
    subgraph Frontend [Client / Trình duyệt]
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
    subgraph Database [Database Spatial]
        DB[(PostgreSQL + PostGIS Extension)]
    end

    %% Data Pipeline Tier
    subgraph DataPipeline [Data Pipeline ETL]
        ETL[GeoPandas / Python]
        CSV[(Dữ liệu thô CSV/ML)]
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

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Phân hệ | Công nghệ / Thư viện | Phiên bản | Vai trò |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) | 16.x | Framework React full-stack rendering giao diện |
| | [TypeScript](https://www.typescriptlang.org/) | 5.x | Đảm bảo an toàn kiểu dữ liệu |
| | [MapLibre GL JS](https://maplibre.org/) | 5.x | Thư viện Web GIS hiển thị bản đồ vector/heatmap |
| | [TailwindCSS](https://tailwindcss.com/) | 4.x | Styling giao diện hiện đại & responsive |
| | [Framer Motion](https://www.framer.com/motion/) | 12.x | Hiệu ứng chuyển động & Micro-animations |
| **Backend** | [Python](https://www.python.org/) | 3.9+ | Ngôn ngữ phát triển backend |
| | [FastAPI](https://fastapi.tiangolo.com/) | Latest | High-performance RESTful API Framework |
| | [SQLAlchemy](https://www.sqlalchemy.org/) | 2.x | ORM tương tác CSDL quan hệ |
| | [GeoAlchemy2](https://geoalchemy2.readthedocs.io/) | Latest | Xử lý các kiểu dữ liệu không gian PostGIS |
| | [Pillow](https://python-pillow.org/) | Latest | Tiền xử lý & resize hình ảnh upload |
| **Database** | [PostgreSQL](https://www.postgresql.org/) | 15.x | Cơ sở dữ liệu quan hệ |
| | [PostGIS](https://postgis.net/) | 3.3+ | Extension mở rộng lưu trữ tọa độ không gian (SRID 4326) |
| **Data Pipeline**| [GeoPandas](https://geopandas.org/) / Shapely | Latest | Chuyển đổi dữ liệu CSV dự báo AI thành GeoJSON tĩnh |
| **DevOps** | [Docker](https://www.docker.com/) & Docker Compose | Latest | Đóng gói container hóa toàn bộ hệ thống |
| | [PM2](https://pm2.keymetrics.io/) & Nginx | Latest | Khởi chạy ngầm & Reverse Proxy trên môi trường Production |

---

## 📂 Cấu Trúc Thư Mục

```text
web-gis/
├── backend/                      # Mã nguồn Server API (Python FastAPI)
│   ├── app/                      # Modules logic & routers
│   ├── uploads/                  # Lưu trữ hình ảnh báo cáo thực địa
│   ├── database.py               # Kết nối PostgreSQL / SQLAlchemy
│   ├── main.py                   # Entry point FastAPI Server
│   ├── models.py                 # Định nghĩa Database Schemas & PostGIS Geometry
│   ├── schemas.py                # Pydantic Schemas validate dữ liệu API
│   ├── Dockerfile                # Dockerfile cho Backend
│   └── requirements.txt          # Danh sách thư viện Python
├── frontend/                     # Mã nguồn Giao diện Web (Next.js 16)
│   ├── public/                   # Thư mục chứa tài nguyên tĩnh
│   │   └── data/                 # Chứa file grid_data.geojson hiển thị bản đồ
│   ├── src/                      # Source code React components & pages
│   │   ├── app/                  # Next.js App Router (Layouts, Pages, API routes)
│   │   └── components/           # Components Map, Sidebar, Form, Controls
│   ├── Dockerfile                # Dockerfile cho Frontend
│   └── package.json              # Khai báo dependencies Frontend
├── data-pipeline/                # Script ETL chuyển đổi dữ liệu
│   └── csv_to_geojson.py         # Script Python biến đổi CSV -> GeoJSON tĩnh
├── docker-images/                # Gói nén các Docker Image phục vụ deploy offline
├── docs/                         # Thư mục Tài liệu Kỹ thuật Chi tiết
│   ├── TRD_Architecture.md       # Kiến trúc hệ thống chi tiết
│   ├── Technical_Requirements_Document.md # Yêu cầu kỹ thuật & API specs
│   ├── Data_Flow.md              # Mô tả luồng dữ liệu & bộ lọc tương tác
│   ├── ML_Evaluation_Methodology.md # Phương pháp luận & Đánh giá AI
│   └── Runbook.md                # Hướng dẫn vận hành & triển khai chi tiết
├── docker-compose.yml            # File cấu hình chạy Docker Compose (Development)
└── README.md                     # Tài liệu tổng quan hệ thống (File này)
```

---

## ⚡ Hướng Dẫn Cài Đặt & Khởi Chạy

### 🐳 Phương Pháp 1: Chạy bằng Docker Compose (Khuyến Nghị)

Phương pháp này giúp tự động cài đặt cả Database PostgreSQL (PostGIS), Backend FastAPI và Frontend Next.js chỉ trong **1 dòng lệnh**:

#### Yêu cầu: Máy tính đã cài sẵn [Docker Engine](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/).

1. **Clone repository:**
   ```bash
   git clone https://github.com/minhduc01168/vigil-green-gis.git
   cd vigil-green-gis
   ```

2. **Khởi chạy toàn bộ hệ thống:**
   ```bash
   docker-compose up --build -d
   ```

3. **Truy cập ứng dụng:**
   - 🌐 **Website Frontend:** `http://localhost:3000`
   - 📑 **API Documentation (Swagger UI):** `http://localhost:8000/docs`
   - 🗄️ **Database PostGIS:** Port `5432` (`gialai_forest`)

4. **Dừng hệ thống:**
   ```bash
   docker-compose down
   ```

---

### 💻 Phương Pháp 2: Cài Đặt Thủ Công (Môi Trường Development)

#### 1. Chuẩn bị Cơ sở dữ liệu (PostgreSQL + PostGIS)
- Tạo database tên `gialai_forest` trong PostgreSQL.
- Kích hoạt extension PostGIS:
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis;
  ```

#### 2. Tiền xử lý Dữ liệu Bản đồ (Data Pipeline)
Chạy script để chuyển đổi file dữ liệu thô sang `.geojson`:
```bash
python data-pipeline/csv_to_geojson.py
```
*(File đầu ra `grid_data.geojson` sẽ tự động được ghi vào `frontend/public/data/`).*

#### 3. Khởi chạy Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Linux/macOS: source venv/bin/activate
# Windows: venv\Scripts\activate

pip install -r requirements.txt

# Tạo file .env
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gialai_forest" > .env
echo "SALT_SECRET=my_super_secret_salt_2026" >> .env

# Chạy server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 4. Khởi chạy Frontend (Next.js)
```bash
cd ../frontend
npm install

# (Tùy chọn) Tạo file .env.local nếu đổi port
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```
Truy cập ứng dụng tại `http://localhost:3000`.

---

### 🌐 Phương Pháp 3: Triển Khai Production (PM2 & Nginx)

Trên Server Linux Production, sử dụng **PM2** để duy trì dịch vụ chạy ngầm 24/7 và **Nginx** làm Reverse Proxy:

```bash
# 1. Build Frontend
cd frontend
npm run build

# 2. Cài đặt PM2 & Khởi chạy tiến trình
npm install -g pm2

# Start Backend
cd ../backend
pm2 start "uvicorn main:app --host 127.0.0.1 --port 8000" --name "gialai-backend"

# Start Frontend
cd ../frontend
pm2 start npm --name "gialai-frontend" -- start

# Lưu trạng thái tự khởi động cùng OS
pm2 save
pm2 startup
```

---

## ⚙️ Cấu Hình Biến Môi Trường

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/gialai_forest
SALT_SECRET=your_super_secret_salt_string_2026
SECRET_KEY=your_jwt_secret_key
```

### Frontend (`frontend/.env.local` hoặc Docker `--build-arg`)
```env
# LƯU Ý: Biến NEXT_PUBLIC_* trong Next.js được nhúng vào bundle lúc BUILD TIME.
# Khi build Docker container, truyền qua build.args trong docker-compose.yml hoặc --build-arg
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 Tóm Tắt API Endpoints

FastAPI tự động tạo trang tài liệu tương tác đầy đủ tại **`http://localhost:8000/docs`**. Các endpoints chính bao gồm:

| Phương thức | Đường dẫn API | Mô tả | Authorization |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reports` | Tạo báo cáo thực địa mới (Tọa độ + Ảnh + Comment) | Public (Rate-limited) |
| `GET` | `/api/reports` | Lấy danh sách tất cả các điểm báo cáo thực địa | Public |
| `POST` | `/api/auth/register` | Đăng ký tài khoản người dùng mới | Public |
| `POST` | `/api/auth/login` | Đăng nhập lấy JWT Bearer Token | Public |
| `POST` | `/api/contact` | Gửi tin nhắn liên hệ hỗ trợ | Public |
| `GET` | `/api/contact` | Lấy danh sách tin nhắn liên hệ | Admin only |
| `GET` | `/api/about` | Lấy nội dung trang giới thiệu (CMS) | Public |
| `POST` | `/api/about` | Cập nhật nội dung trang giới thiệu | Admin only |

---

## 📚 Chỉ Mục Tài Liệu Kỹ Thuật (Docs)

Hệ thống đi kèm bộ tài liệu kỹ thuật đầy đủ được lưu giữ tại thư mục [`docs/`](docs/):

- 🏛️ **[TRD_Architecture.md](docs/TRD_Architecture.md):** Tổng quan kiến trúc hệ thống Client-Server, kiến trúc CSDL không gian và giải pháp cô lập mã nguồn.
- 📋 **[Technical_Requirements_Document.md](docs/Technical_Requirements_Document.md):** Chi tiết yêu cầu chức năng (FR), yêu cầu phi chức năng (NFR), cấu trúc bảng PostgreSQL và chuẩn bảo mật.
- 🔄 **[Data_Flow.md](docs/Data_Flow.md):** Chi tiết luồng dữ liệu tĩnh (AI GeoJSON) & động (Báo cáo thực địa), cơ chế lọc động 60 FPS.
- 🧠 **[ML_Evaluation_Methodology.md](docs/ML_Evaluation_Methodology.md):** Phương pháp luận huấn luyện AI, kịch bản Area Transfer Validation và các chỉ số đánh giá (AUC, Cap@5%/10%).
- 📖 **[Runbook.md](docs/Runbook.md):** Cẩm nang hướng dẫn cài đặt, vận hành, bảo trì và xử lý sự cố trong môi trường thực tế.

---
*© 2026 Vigil Green GIS — Gia Lai Deforestation Risk Monitoring Platform.*

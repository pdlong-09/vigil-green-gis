# Hướng Dẫn Cài Đặt & Vận Hành Hệ Thống (Runbook)

**Dự án:** Gia Lai Deforestation Risk Map (Web GIS)

Tài liệu này hướng dẫn chi tiết từng bước để khởi chạy toàn bộ hệ thống (Frontend + Backend) trên máy tính local (môi trường phát triển) và cách triển khai trên Server thật (Production).

---

## 1. Yêu cầu Hệ thống (Prerequisites)
Trước khi bắt đầu, máy tính/server của bạn cần cài đặt sẵn:
1. **Node.js** (Phiên bản >= 20.9.0) - *Dùng để chạy Frontend Next.js.*
2. **Python** (Phiên bản >= 3.9) - *Dùng để chạy Backend FastAPI và Data Pipeline.*
3. **PostgreSQL** (Kèm extension **PostGIS**) - *Cơ sở dữ liệu lưu trữ không gian.*

---

## 2. Thiết lập Cơ Sở Dữ Liệu (PostgreSQL)
1. Mở công cụ quản lý DB (như pgAdmin hoặc DBeaver).
2. Tạo một Database mới, đặt tên ví dụ là: `gialai_forest`.
3. Chạy lệnh SQL sau để kích hoạt PostGIS (Bắt buộc để lưu tọa độ bản đồ):
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

---

## 3. Khởi chạy Backend (FastAPI)

Mở Terminal / Command Prompt và thực hiện:

### Bước 3.1. Cài đặt thư viện
```bash
cd web-gis/backend

# (Tùy chọn) Tạo môi trường ảo (Virtual Environment)
python -m venv venv
# Active venv (Windows): venv\Scripts\activate
# Active venv (Mac/Linux): source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt
```

### Bước 3.2. Cấu hình biến môi trường
Tạo một file có tên `.env` trong thư mục `web-gis/backend` với nội dung sau (Thay đổi thông tin user/password cho khớp với DB của bạn):
```env
DATABASE_URL=postgresql://postgres:123456@localhost:5432/gialai_forest
SALT_SECRET=my_super_secret_salt_2026
```

### Bước 3.3. Chạy Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
👉 Khi chạy thành công, API sẽ hoạt động tại: `http://localhost:8000`.
Bạn có thể xem tài liệu API (Swagger UI) tại: `http://localhost:8000/docs`.

---

## 4. Khởi chạy Frontend (Next.js)

Mở một Terminal **mới** (Giữ terminal Backend tiếp tục chạy):

### Bước 4.1. Cài đặt thư viện
```bash
cd web-gis/frontend
npm install
```

### Bước 4.2. Cấu hình biến môi trường (Tùy chọn)
Tạo file `.env.local` trong thư mục `frontend/` (nếu Backend không chạy ở cổng 8000 mặc định):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Bước 4.3. Chạy Server
```bash
npm run dev
```
👉 Giao diện Website sẽ hiển thị tại: `http://localhost:3000`.

---

## 5. Cập nhật Dữ Liệu Bản Đồ (Data Pipeline)
Hệ thống lấy dữ liệu trực quan hiển thị trên bản đồ từ file tĩnh `.geojson`. Mỗi khi có file `CSV` mới (ví dụ khi Team Data chạy xong mô hình ML hoặc bổ sung các cột như NDVI, NBR), bạn làm theo các bước sau để cập nhật bản đồ:

1. Đặt file CSV mới vào thư mục `data/` ở thư mục gốc của project.
2. Sửa lại đường dẫn file trong `web-gis/data-pipeline/csv_to_geojson.py` (nếu tên file thay đổi).
3. Chạy lệnh:
   ```bash
   cd web-gis
   python data-pipeline/csv_to_geojson.py
   ```
4. Script sẽ tự động tạo file `grid_data.geojson` và chép đè vào thư mục `frontend/public/data/`.
5. F5 (Tải lại) trang web, bản đồ sẽ ngay lập tức được cập nhật dữ liệu mới.

---

## 6. Hướng dẫn Triển khai Production (Server thực tế)

Trên Server thực, bạn không nên dùng `npm run dev` hay `uvicorn --reload` vì nó không ổn định khi chịu tải. Hãy dùng **PM2** (Process Manager).

**1. Build Frontend:**
```bash
cd web-gis/frontend
npm run build
```

**2. Cài đặt PM2 và Chạy ngầm:**
```bash
npm install -g pm2

# Khởi chạy Backend
cd web-gis/backend
pm2 start "uvicorn main:app --host 127.0.0.1 --port 8000" --name "gialai-backend"

# Khởi chạy Frontend
cd ../frontend
pm2 start npm --name "gialai-frontend" -- start

# Lưu trạng thái để tự động bật lại khi Server bị khởi động lại
pm2 save
pm2 startup
```

Lúc này, hệ thống của bạn đã sẵn sàng chạy ngầm ổn định 24/7. Bạn có thể cài đặt thêm Nginx làm Reverse Proxy để gắn Domain (VD: `gialai-forest.com`) thay vì dùng port 3000.

---

## 7. Triển khai bằng Docker Compose (Khuyến nghị cho Server/Production)

Phương pháp này giúp tự động cài đặt cả Database PostgreSQL (kèm PostGIS), Backend và Frontend chỉ với một dòng lệnh, giải quyết hoàn toàn vấn đề xung đột môi trường.

**Yêu cầu:** Máy tính/Server đã cài đặt sẵn [Docker](https://docs.docker.com/get-docker/) và [Docker Compose](https://docs.docker.com/compose/install/).

**1. Di chuyển vào thư mục web-gis:**
```bash
cd d:\Slide_THPT\NCKH_TA\deforestation-risk-ai\web-gis
```
*(Trên Linux Server, cd vào thư mục web-gis tương ứng).*

**2. Tùy chỉnh tham số (Nếu cần):**
Mở tệp `docker-compose.yml`, ở phần service `frontend`, biến `NEXT_PUBLIC_API_URL` đang để mặc định là `http://localhost:8000`. Nếu triển khai lên VPS/Server có Domain hoặc Public IP, hãy đổi tham số này thành Domain/IP thực tế của bạn.

**3. Build và Chạy hệ thống:**
```bash
docker-compose up --build -d
```
Quá trình này sẽ diễn ra tự động: tải Image PostGIS, build Image cho FastAPI (Backend) và build Image cho Next.js (Frontend). Lệnh `-d` giúp hệ thống chạy ngầm.

**4. Trạng thái:**
- Frontend (Website): `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`
- Database: Chạy trên port `5432` nội bộ.

**5. Dừng hệ thống:**
```bash
docker-compose down
```
Lưu ý: Dữ liệu Database và Ảnh Upload được lưu trữ vĩnh viễn ở các Docker Volumes (`postgres_data` và `backend_uploads`), sẽ không bị mất khi chạy lệnh `down`.

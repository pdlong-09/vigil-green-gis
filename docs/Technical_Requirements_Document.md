# Tài Liệu Yêu Cầu Kỹ Thuật (Technical Requirements Document - TRD)

**Dự án:** Gia Lai Deforestation Risk Map (Web GIS)  
**Phiên bản:** 1.0.0  
**Ngày cập nhật:** Tháng 06/2026  

---

## 1. Mục Đích Tài Liệu
Tài liệu này đặc tả chi tiết các yêu cầu kỹ thuật (Technical Specifications), cấu trúc dữ liệu, và giao thức giao tiếp (API) để đội ngũ lập trình (Frontend & Backend) dựa vào đó thi công Nền tảng Bản đồ Cảnh báo Mất rừng Gia Lai.

## 2. Yêu Cầu Chức Năng Cốt Lõi (Functional Requirements)

### 2.1. Phân hệ Bản đồ (Map Module)
*   **FR1.1 - Khởi tạo Bản đồ:** Bản đồ phải được render bằng **MapLibre GL JS**, lấy tọa độ trung tâm mặc định tại Tỉnh Gia Lai `[108.46, 14.10]`, mức zoom mặc định là `10`.
*   **FR1.2 - Chế độ nền (Base map):** Phải hỗ trợ chuyển đổi giữa chế độ `Dark Mode` (Carto Dark Matter) và `Light Mode/Satellite` thông qua nút Toggle trên UI.
*   **FR1.3 - Tải Dữ liệu Không gian:** Tự động gọi file tĩnh `grid_data.geojson` từ thư mục `public/data/` để nạp thành phần tử lưới.
*   **FR1.4 - Style Dữ liệu:** Các điểm mất rừng (hoặc nguy cơ) phải được hiển thị bằng tính năng `circle` (Vòng tròn) với độ tương phản cao: Nền trong suốt (`rgba(255,0,0,0.2)`) và viền ngoài màu đỏ neon (`#ff0055`, độ dày 2px).
*   **FR1.5 - Time Slider Filter:** Khi người dùng thay đổi mốc năm (từ 2001 -> 2024), bản đồ phải lập tức (Real-time) ẩn/hiện các điểm có trường `loss_first_year` tương ứng với logic: `0 < loss_first_year <= current_year`.

### 2.2. Phân hệ Check-in & Báo Cáo Thực Địa (Field Report Module)
*   **FR2.1 - Bắt sự kiện Click:** Khi người dùng click vào một điểm bất kỳ trên bản đồ, lấy tọa độ `[Lng, Lat]` đó để truyền vào Form Báo Cáo.
*   **FR2.2 - Nhận dữ liệu đầu vào:** Cho phép người dùng nhập 1 đoạn văn bản (Text) tối đa 1000 ký tự và Upload tối đa 1 ảnh định dạng `JPG/PNG`. Dung lượng ảnh không được vượt quá `5MB`.
*   **FR2.3 - Ẩn danh & Hash IP:** Không yêu cầu Đăng nhập. Hệ thống tự động thu thập IP của client, nối với 1 chuỗi `SALT`, dùng hàm mã hóa `SHA-256` để lưu xuống Database (nhằm phân biệt các user khác nhau mà vẫn giữ quyền riêng tư).
*   **FR2.4 - Lấy danh sách Check-in:** Hiển thị các điểm người dùng đã báo cáo (Ghim/Marker) lên bản đồ. Click vào Marker sẽ hiển thị popup chứa nội dung bình luận và hình ảnh.

## 3. Đặc tả API (API Specifications - FastAPI)

Tất cả các API được bảo vệ bởi **CORS Policy** (Chỉ cho phép tên miền nội bộ và `localhost:3000` truy cập).

### 3.1. Tạo mới Báo cáo (POST `/api/reports`)
*   **Content-Type:** `multipart/form-data`
*   **Payload:**
    *   `lat` (float, Bắt buộc): Vĩ độ.
    *   `lon` (float, Bắt buộc): Kinh độ.
    *   `comment` (string, Không bắt buộc): Bình luận thực địa.
    *   `file` (file, Không bắt buộc): Ảnh minh chứng (.jpg/.png).
*   **Xử lý Server:** 
    *   Kiểm tra định dạng ảnh, lưu vào `/uploads/{uuid}.jpg`.
    *   Tạo đối tượng WKT (`POINT(lon lat)`) để lưu vào PostGIS.
*   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "lat": 14.123,
      "lon": 108.456,
      "comment": "Rừng ở đây đang bị đốn hạ",
      "image_url": "/uploads/a1b2c3d4.jpg",
      "created_at": "2026-06-10T15:30:00Z"
    }
    ```

### 3.2. Lấy danh sách Báo cáo (GET `/api/reports`)
*   **Content-Type:** `application/json`
*   **Response (200 OK):** Trả về mảng JSON chứa tất cả báo cáo đã lưu. Tọa độ PostGIS được parse tự động thành `lat`/`lon`.

## 4. Đặc tả Cơ Sở Dữ Liệu (Database Schema)

Sử dụng **PostgreSQL** với Extension **PostGIS**.

| Bảng (Table) | Trường (Column) | Kiểu dữ liệu (Type) | Cấu trúc Ràng buộc (Constraints) | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| `field_reports` | `id` | Integer / UUID | Primary Key, Auto Increment | Khóa chính |
| | `geom` | Geometry(POINT, 4326) | Not Null | Tọa độ không gian (SRID 4326) |
| | `comment` | Text | Nullable | Nội dung báo cáo |
| | `image_url` | Varchar(255) | Nullable | Đường dẫn ảnh local `/uploads/...` |
| | `user_ip_hash` | Varchar(64) | Index | IP mã hóa SHA-256 (64 ký tự) |
| | `created_at` | Timestamptz | Default: `now()` | Thời gian gửi báo cáo |

## 5. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

*   **NFR1 - Hiệu năng (Performance):** 
    *   API lấy danh sách điểm check-in (GET `/api/reports`) phải phản hồi dưới `200ms` với khối lượng dữ liệu < 10.000 records.
    *   Bản đồ MapLibre phải load GeoJSON của toàn bộ khu vực nghiên cứu (~6000 cells) mượt mà ở tốc độ tối thiểu 30 FPS.
*   **NFR2 - Bảo mật (Security):** 
    *   Áp dụng giới hạn `Rate Limiting` (VD: Tối đa 5 report / phút / IP) để chống Spam.
    *   Đường dẫn File (Image Upload) phải được sinh ngẫu nhiên bằng `UUID` để tránh hiện tượng đoán trước tên file (Directory Traversal).
*   **NFR3 - Khả năng tương thích (Compatibility):** 
    *   UI Frontend phải Reponsive: Chạy tốt trên màn hình Laptop (từ `1024px`) và Tablet.
    *   Trình duyệt hỗ trợ: Chrome, Edge, Safari, Firefox bản mới nhất.

## 6. Biến Môi Trường (Environment Variables)

### 6.1. Backend (`web-gis/backend/.env`)
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
SALT_SECRET=your_super_secret_salt_string_here
```

### 6.2. Frontend (`web-gis/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://<domain_or_server_ip>:8000/api
```

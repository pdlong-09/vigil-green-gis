# Phương Pháp Luận & Đánh Giá Mô Hình AI Cảnh Báo Mất Rừng

Tài liệu này trình bày chi tiết về quá trình xây dựng, huấn luyện và phương pháp kiểm thử tính chuẩn xác của mô hình Machine Learning trong dự án **"Hệ thống Cảnh báo Nguy cơ Mất rừng tại Tỉnh Gia Lai"**. Thông tin được chuẩn hóa để phục vụ cho việc thuyết minh khoa học và bảo vệ trước Hội đồng Giám khảo.

---

## 1. Mục Tiêu Nghiên Cứu
Xây dựng một khung theo dõi chủ động (Proactive monitoring framework) có khả năng dự đoán trước các vùng có nguy cơ mất rừng cao ở độ phân giải 1km x 1km, thay vì chỉ thống kê sau khi rừng đã bị chặt phá.

## 2. Nguồn Dữ Liệu & Biến Độc Lập (Features)
Mô hình không chỉ phụ thuộc vào một nguồn ảnh duy nhất mà tích hợp đa lớp dữ liệu không gian (Multi-source satellite data) để phản ánh đầy đủ các yếu tố sinh thái và con người ảnh hưởng đến rừng:

*   **Nhãn Mục Tiêu (Target Label):** `loss_any_2001_2024` - Dữ liệu lịch sử về diện tích rừng bị mất thực tế, được thu thập từ bản đồ **Hansen Global Forest Change (GFW)**. Mô hình được học trên những cánh rừng đã biến mất trong quá khứ.
*   **Đặc Trưng Đầu Vào (X_features):**
    *   **Địa hình:** Độ cao (Elevation) và Độ dốc (Slope) từ vệ tinh **NASA SRTM**.
    *   **Khí hậu:** Lượng mưa trung bình (Rainfall) từ **CHIRPS**.
    *   **Sinh học:** Độ che phủ rừng gốc năm 2000 (Tree cover 2000).
    *   **Tác động của con người:** Khoảng cách đến mạng lưới giao thông (đường bộ) lấy từ **OpenStreetMap (OSM)**.

---

## 3. Quá Trình Huấn Luyện & Thuật Toán
Chúng tôi đã áp dụng và so sánh 3 phương pháp luận khác nhau để tìm ra giải pháp tối ưu nhất:

1.  **Baseline Risk Score (Chấm điểm cơ bản):** Sử dụng các công thức tính điểm tĩnh theo khoảng cách. Đóng vai trò làm mốc đối chuẩn (Benchmark).
2.  **Logistic Regression (Hồi quy Logistic):** Được sử dụng với mục đích **giải thích khoa học (Interpretability)**. Thuật toán này cho phép chúng ta nhìn rõ "Trọng số" (Coefficients) của từng yếu tố. Ví dụ: Nó giải thích được độ dốc càng lớn thì nguy cơ phá rừng càng giảm.
3.  **Random Forest (Rừng ngẫu nhiên):** Mô hình được chọn làm cốt lõi cho hệ thống dự báo. Với tập hợp hàng trăm cây quyết định (Decision Trees), nó có khả năng "bắt" được các quy luật tương tác phi tuyến tính phức tạp trong tự nhiên, đem lại hiệu suất dự báo (AUC) cao nhất.

---

## 4. Phương Pháp Kiểm Thử Chéo (Validation Scenarios)
Để chứng minh mô hình **không bị học vẹt (Overfitting)** và hoàn toàn có khả năng triển khai thực tiễn, quy trình kiểm thử (Test) được chia thành 2 kịch bản khắt khe:

### Kịch bản 1: Đánh giá tiêu chuẩn (Provided Split)
*   **Cách làm:** Chia tập dữ liệu thu thập được thành 2 phần Train (Huấn luyện) và Test (Kiểm thử) ngẫu nhiên theo tỷ lệ chuẩn.
*   **Mục đích:** Đo lường độ chính xác tổng quát của các thuật toán.

### Kịch bản 2: Đánh giá Chuyển Giao Vùng (Area Transfer Validation) 🌟 (Điểm Nhấn Khác Biệt)
*   **Cách làm:** Mô hình được huấn luyện **100% trên dữ liệu của huyện K’Bang**, hoàn toàn không biết gì về địa hình của các nơi khác. Sau đó, mô hình được mang đi dự đoán mù (Test) trên **100% dữ liệu của huyện Mang Yang**.
*   **Mục đích:** Chứng minh tính khái quát hóa (Generalization) của AI. Kết quả cho thấy mô hình thực sự "hiểu" quy luật sinh thái học gây mất rừng (độ dốc, lượng mưa) thay vì chỉ nhớ tọa độ. Điều này khẳng định hệ thống hoàn toàn có thể nhân rộng (scale) ra toàn bộ các tỉnh thành trên cả nước mà không cần phải thu thập lại toàn bộ dữ liệu lịch sử ở tỉnh đó.

---

## 5. Kết Quả Đo Lường & Tính Thực Tiễn (Evaluation Metrics)

Thay vì chỉ dùng "Độ chính xác" (Accuracy) thông thường dễ gây sai lệch do mất cân bằng dữ liệu, chúng tôi sử dụng các thước đo chuyên ngành:

*   **Chỉ số Phân biệt (AUC - Area Under Curve):** Đạt mức **0.89** cho mô hình Random Forest. Nghĩa là mô hình có độ tin cậy lên tới 89% khi được yêu cầu phân loại giữa một ô đất rừng "An toàn" và một ô đất rừng "Sắp bị xâm phạm".
*   **Tỷ lệ Đón đầu (Capture Rate Top 5%):** Đây là con số quan trọng nhất về mặt ứng dụng thực tiễn. 
    *   **Giới thiệu với Giám khảo:** *"Nguồn lực kiểm lâm có hạn, không thể ngày nào cũng tuần tra 100% diện tích hàng triệu hecta rừng. Với mô hình này, chúng em xuất ra một Bản đồ Nhiệt, chỉ ra **Top 5%** diện tích có nguy cơ rủi ro cao nhất (Màu Đỏ). Nếu kiểm lâm chỉ cần tập trung lực lượng tuần tra đúng 5% diện tích này, họ có thể đón đầu và phòng ngừa phần lớn các vụ phá rừng sắp diễn ra."*

## 6. Tính Minh Bạch & Không "Hộp Đen" (Explainability)
Trái với các mạng Neural Network thường bị coi là "hộp đen" (Blackbox), kiến trúc sử dụng Random Forest và Logistic Regression của dự án cho phép xuất ra biểu đồ **Độ quan trọng của đặc trưng (Feature Importance)**. 
Chúng ta hoàn toàn có thể trình bày cho Hội đồng xem yếu tố nào đang là nguyên nhân số 1 gây nguy cơ mất rừng tại địa phương (Ví dụ: Việc mở đường băng qua rừng tự nhiên làm tăng rủi ro lên gấp x lần).

---
*Tài liệu này tóm tắt phương pháp từ mã nguồn `src/pipeline.py` phục vụ thuyết minh dự án.*

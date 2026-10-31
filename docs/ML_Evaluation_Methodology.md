# Phương Pháp Luận & Đánh Giá Mô Hình AI Cảnh Báo Mất Rừng

Tài liệu này trình bày chi tiết về quá trình xây dựng, huấn luyện và phương pháp kiểm thử tính chuẩn xác của mô hình Machine Learning trong dự án **"Hệ thống Cảnh báo Nguy cơ Mất rừng tại Tỉnh Gia Lai"**. Thông tin được chuẩn hóa để phục vụ cho việc thuyết minh khoa học và bảo vệ trước Hội đồng Giám khảo.

---

## 1. Mục Tiêu Nghiên Cứu
Xây dựng một khung theo dõi chủ động (Proactive monitoring framework) có khả năng dự đoán trước các vùng có nguy cơ mất rừng cao ở độ phân giải 1km x 1km, thay vì chỉ thống kê sau khi rừng đã bị chặt phá.

## 2. Nguồn Dữ Liệu & Biến Độc Lập (Features)
Mô hình không chỉ phụ thuộc vào một nguồn ảnh duy nhất mà tích hợp đa lớp dữ liệu không gian (Multi-source satellite data) để phản ánh đầy đủ các yếu tố sinh thái và con người ảnh hưởng đến rừng:

*   **Nhãn Mục Tiêu (Target Label):** `loss_any_2001_2024` - Dữ liệu lịch sử về diện tích rừng bị mất thực tế, lấy từ lớp `lossyear` của **Hansen Global Forest Change (v1.12)**, chỉ xét các ô có `treecover2000 ≥ 30%`. Mẫu được cân bằng 50/50. Mô hình được học trên những cánh rừng đã biến mất trong quá khứ.
*   **Đặc Trưng Đầu Vào (X_features):**
    *   **Địa hình:** Độ cao (`mean_elevation_m`) và Độ dốc (`mean_slope_deg`) từ **NASA SRTM**.
    *   **Khí hậu:** Tổng lượng mưa 12 tháng và lượng mưa trung bình năm 2000–2024 từ **CHIRPS**.
    *   **Sinh học:** Độ che phủ rừng gốc năm 2000 (`treecover2000`).
    *   **Quang học:** Các kênh B2, B3, B4, B8, B11, B12 và chỉ số NDVI, NBR từ **Sentinel-2** (2023).
*   Khoảng cách đến đường bộ và quyền sử dụng đất **chưa** là biến đầu vào; chúng nằm trong hướng phát triển tiếp theo.

---

## 3. Quá Trình Huấn Luyện & Thuật Toán
Chúng tôi đã áp dụng và so sánh 3 phương pháp luận khác nhau để tìm ra giải pháp tối ưu nhất:

1.  **Baseline Risk Score (Chấm điểm cơ bản):** Điểm z-score minh bạch từ các biến đã chuẩn hóa, không học từ dữ liệu. Đóng vai trò làm mốc đối chuẩn (Benchmark).
2.  **Logistic Regression (Hồi quy Logistic):** Được sử dụng với mục đích **giải thích khoa học (Interpretability)**. Thuật toán này cho phép chúng ta nhìn rõ "Trọng số" (Coefficients) của từng yếu tố: lượng mưa cao hơn, độ cao/độ dốc thấp hơn đi kèm nguy cơ cao hơn. Đây cũng là mô hình chuyển vùng tốt nhất.
3.  **Random Forest (Rừng ngẫu nhiên):** Nắm bắt các quan hệ phi tuyến và cho AUC cao nhất trên tập chia sẵn, nhưng giảm mạnh hơn Hồi quy Logistic khi chuyển sang huyện chưa từng thấy.

---

## 4. Phương Pháp Kiểm Thử Chéo (Validation Scenarios)
Để chứng minh mô hình **không bị học vẹt (Overfitting)** và hoàn toàn có khả năng triển khai thực tiễn, quy trình kiểm thử (Test) được chia thành 2 kịch bản khắt khe:

### Kịch bản 1: Đánh giá tiêu chuẩn (Provided Split)
*   **Cách làm:** Gộp 6.000 ô của hai huyện, chia thành 4.788 ô huấn luyện và 1.212 ô kiểm thử (620 ô mất rừng).
*   **Mục đích:** Đo khả năng xếp hạng rủi ro trong cùng vùng dữ liệu.

### Kịch bản 2: Đánh giá Chuyển Giao Vùng (Area Transfer Validation) 🌟 (Điểm Nhấn Khác Biệt)
*   **Cách làm:** Mô hình được huấn luyện **100% trên dữ liệu của huyện K’Bang** (4.000 ô), rồi dự đoán mù trên **100% dữ liệu của huyện Mang Yang** (2.000 ô, 1.000 ô mất rừng).
*   **Mục đích:** Kiểm tra mô hình giữ được bao nhiêu khả năng xếp hạng khi sang một huyện chưa từng thấy. Kết quả cho thấy hiệu năng **giảm rõ** do khác biệt về sử dụng đất, đường sá và quản lý, nhưng vẫn còn tín hiệu ưu tiên. Vì vậy mỗi tỉnh mới cần được kiểm chứng lại bằng dữ liệu địa phương trước khi dùng.

---

## 5. Kết Quả Đo Lường & Tính Thực Tiễn (Evaluation Metrics)

Thay vì chỉ dùng "Độ chính xác" (Accuracy) thông thường dễ gây sai lệch do mất cân bằng dữ liệu, chúng tôi sử dụng các thước đo chuyên ngành:

*   **Chỉ số Phân biệt (AUC - Area Under Curve):** Xác suất mô hình xếp một ô mất rừng cao hơn một ô không mất rừng chọn ngẫu nhiên (0,5 là đoán bừa). Kết quả (whitepaper, Bảng II):

    | Kịch bản | Tham chiếu | Hồi quy Logistic | Random Forest |
    |---|---|---|---|
    | Chia sẵn (1.212 ô) | 0.504 | 0.817 | **0.861** |
    | Chuyển vùng K'Bang → Mang Yang (2.000 ô) | 0.376 | **0.589** | 0.535 |

*   **Tỷ lệ Đón đầu (Capture Rate Top 5% / 10%):** Tỷ lệ ô mất rừng nằm trong 5% (hoặc 10%) ô được xếp rủi ro cao nhất. Vì tập kiểm thử cân bằng 50/50, Cap@5% tối đa chỉ khoảng 0,098; Hồi quy Logistic đạt 0,089 (khoảng 90% mức trần) và vẫn đứng đầu khi chuyển vùng (0,062).
    *   **Giới thiệu với Giám khảo:** *"Nguồn lực kiểm lâm có hạn, không thể ngày nào cũng tuần tra 100% diện tích rừng. Mô hình xếp hạng các ô theo rủi ro để kiểm lâm ưu tiên tuần tra trước những ô xếp cao nhất. Đây là công cụ hỗ trợ ưu tiên, cần được hiệu chỉnh và kiểm chứng tại địa phương, không phải bằng chứng vi phạm tại một vị trí cụ thể."*

## 6. Tính Minh Bạch & Không "Hộp Đen" (Explainability)
Trái với các mạng Neural Network thường bị coi là "hộp đen" (Blackbox), kiến trúc sử dụng Random Forest và Logistic Regression của dự án cho phép xuất ra biểu đồ **Độ quan trọng của đặc trưng (Feature Importance)**. 
Theo mức quan trọng đặc trưng của Random Forest, `treecover2000`, độ cao, độ dốc và hai biến lượng mưa đứng đầu. Các đầu ra này cho biết mô hình dựa vào yếu tố nào để xếp hạng, **không** chứng minh quan hệ nhân quả. Một kiểm tra độ nhạy với định nghĩa nhãn mất rừng thay thế cho kết luận nhất quán.

---
*Tài liệu này tóm tắt phương pháp từ mã nguồn `src/pipeline.py` phục vụ thuyết minh dự án.*

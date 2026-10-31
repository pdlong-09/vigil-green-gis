# ETO Competition Resources

Hồ sơ đội VIGIL nộp cho **IDSOL 2026 — Emerging Technologies Olympiads (ETO)**, cuộc thi mà nền tảng [www.vigil.green](https://www.vigil.green/) (mã nguồn trong repo này) được dùng để tham gia.

Đội VIGIL: **Phạm Duy Long** (đội trưởng, The Olympia School) · **Nguyễn Đức Anh** (Foreign Language Specialized School) · **Đỗ Nhật Quang** (Vinschool The Harmony).

| Tài liệu | Nội dung |
|---|---|
| [Whitepaper](VIGIL_IDSOL2026_Whitepaper.pdf) | *VIGIL: An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution* (5 trang): khung 3 trụ cột dữ liệu, pipeline lưới 1 km, kết quả Bảng II(A)/(B), nền tảng web, lộ trình mở rộng toàn quốc, cân nhắc đạo đức. |
| [Poster](VIGIL_IDSOL2026_Poster.pdf) | Posterboard IDSOL26VN: bối cảnh, kiến trúc hệ thống và pipeline huấn luyện, kết quả AUC / Cap@5% theo hai kịch bản, bảng thuật ngữ. |
| [Pitch deck](VIGIL_IDSOL2026_Pitch_Deck.pdf) | 26 slide thuyết trình: vấn đề, tầm nhìn, phương pháp, kết quả, nền tảng web, hạn chế và đạo đức, mô hình mở rộng 4 lớp, kế hoạch kinh doanh, đội ngũ. |

Số liệu chính (whitepaper, Bảng II):

| Kịch bản | Tham chiếu | Hồi quy Logistic | Random Forest |
|---|---|---|---|
| Chia sẵn — AUC | 0.504 | 0.817 | **0.861** |
| Chuyển vùng K'Bang → Mang Yang — AUC | 0.376 | **0.589** | 0.535 |

Whitepaper và poster cũng được trang web phục vụ tại `/papers/` (bản sao giống hệt trong [`frontend/public/papers/`](../frontend/public/papers/)).

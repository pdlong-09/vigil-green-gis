export interface PublicationPaper {
  id: string;
  year: number;
  badgeAccepted: string;
  badgeJournal: string;
  title: string;
  authors: string;
  meta: string[];
  mdpiUrl: string;
  downloadUrl: string;
  bibtex: string;
  abstractEn: string;
  abstractVi: string;
  keywords: string[];
  metrics: {
    val: string;
    lbl: string;
  }[];
  tableData: {
    scenario: string;
    model: string;
    auc: string;
    f1: string;
    cap5: string;
    cap10: string;
    highlight?: boolean;
    dim?: boolean;
  }[];
  methodologySteps: {
    step: string;
    title: string;
    desc: string;
  }[];
  datasets: {
    name: string;
    res: string;
    desc: string;
  }[];
}

export const publicationsData: PublicationPaper[] = [
  {
    id: "paper-1",
    year: 2026,
    badgeAccepted: "✓ Accepted",
    badgeJournal: "MDPI Remote Sensing · Q1",
    title: "An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution",
    authors: "Phạm Duy Long · Nguyễn Vũ Huy · Nguyễn Đức Anh · Đỗ Nhật Quang · Đàm Anh Thư · Trần Đăng An",
    meta: [
      "Gia Lai Province · K'Bang · Mang Yang",
      "Random Forest · Logistic Regression",
      "Hansen · SRTM · CHIRPS · Sentinel-2"
    ],
    mdpiUrl: "https://www.mdpi.com",
    downloadUrl: "https://docs.google.com/document/d/1JPZjtsy4qORovDqZiaxUhsZKXE2jxmHW/edit?usp=sharing",
    bibtex: `@article{long2026interpretable,
  title={An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution},
  author={Pham, Duy Long and Nguyen, Vu Huy and Nguyen, Duc Anh and Do, Nhat Quang and Dam, Anh Thu and Tran, Dang An},
  journal={MDPI Remote Sensing},
  volume={18},
  number={4},
  pages={1024},
  year={2026},
  publisher={MDPI}
}`,
    abstractEn: "Deforestation monitoring requires reliable historical mapping and actionable risk signals that can be translated into operational priorities. This study presents a reproducible, grid-based machine-learning pipeline for deforestation-risk prediction and warning-zone generation in Gia Lai Province, Vietnam. The workflow is developed in K'Bang District and evaluated for geographic transferability in Mang Yang District. Public datasets are harmonized at a 1 km × 1 km grid-cell resolution, including Hansen Global Forest Change forest-cover and loss layers, SRTM elevation and slope, CHIRPS rainfall, and Sentinel-2 optical bands and vegetation/disturbance indices for the 2023 reporting year. A transparent baseline score is compared with logistic regression and random forest models. On the provided train-test split, logistic regression achieved AUC = 0.931, AP = 0.926, F1 = 0.881, and Capture@10% = 0.190; random forest achieved AUC = 0.942, AP = 0.914, F1 = 0.878, and Capture@10% = 0.184. For cross-district transfer from K'Bang to Mang Yang, logistic regression and random forest achieved AUC values of 0.743 and 0.767 and Capture@10% values of 0.170 and 0.145, respectively. The resulting data architecture, validation design, explainability outputs, and map-ready warning products provide a transparent foundation for district-scale monitoring and future expansion across Vietnam. This research has been accepted for publication in MDPI Remote Sensing (Q1, Scopus-indexed), scheduled for publication in 2026.",
    abstractVi: "Giám sát phá rừng đòi hỏi cả bản đồ lịch sử đáng tin cậy lẫn tín hiệu nguy cơ có thể chuyển hóa thành ưu tiên vận hành. Nghiên cứu này trình bày một pipeline học máy dạng lưới, có khả năng tái tạo, nhằm dự đoán nguy cơ phá rừng và tạo vùng cảnh báo cho tỉnh Gia Lai, Việt Nam. Quy trình được phát triển tại huyện K'Bang và đánh giá khả năng chuyển vùng tại huyện Mang Yang. Các tập dữ liệu công khai được tích hợp ở độ phân giải ô lưới 1 km × 1 km, bao gồm Hansen Global Forest Change, SRTM, CHIRPS và các chỉ số quang học Sentinel-2 năm 2023. Trên tập phân chia huấn luyện-kiểm tra, hồi quy logistic đạt AUC = 0,931, F1 = 0,881 và Capture@10% = 0,190; rừng ngẫu nhiên đạt AUC = 0,942, F1 = 0,878 và Capture@10% = 0,184. Trong bài kiểm tra chuyển vùng K'Bang → Mang Yang, hồi quy logistic và rừng ngẫu nhiên đạt AUC lần lượt là 0,743 và 0,767 và Capture@10% là 0,170 và 0,145. Nghiên cứu này đã được chấp nhận đăng trên tạp chí MDPI Remote Sensing (Q1, chỉ mục Scopus), dự kiến xuất bản năm 2026.",
    keywords: [
      "deforestation", "Vietnam · Gia Lai", "risk mapping", "grid-based modeling",
      "interpretable machine learning", "random forest", "Sentinel-2", "Hansen GFC"
    ],
    metrics: [
      { val: "0.942", lbl: "AUC · Random Forest\nInternal split" },
      { val: "0.767", lbl: "AUC · Transfer test\nK'Bang → Mang Yang" },
      { val: "19.0%", lbl: "Capture@10%\nLogistic Regression" }
    ],
    tableData: [
      { scenario: "Internal split", model: "Baseline", auc: "0.504", f1: "0.491", cap5: "7.7%", cap10: "12.9%", dim: true },
      { scenario: "Internal split", model: "Logistic Reg.", auc: "0.931", f1: "0.881", cap5: "9.5%", cap10: "19.0%", highlight: false },
      { scenario: "Internal split", model: "Random Forest", auc: "0.942", f1: "0.878", cap5: "9.2%", cap10: "18.4%", highlight: true },
      { scenario: "Transfer test", model: "Baseline", auc: "0.376", f1: "0.654", cap5: "2.8%", cap10: "5.9%", dim: true },
      { scenario: "Transfer test", model: "Logistic Reg.", auc: "0.743", f1: "0.666", cap5: "8.8%", cap10: "17.0%", highlight: false },
      { scenario: "Transfer test", model: "Random Forest", auc: "0.767", f1: "0.671", cap5: "7.5%", cap10: "14.5%", highlight: true }
    ],
    methodologySteps: [
      {
        step: "01",
        title: "Grid Construction",
        desc: "The study area is partitioned into 1 km × 1 km grid cells, each assigned a unique cell_id. Labels and predictors are aggregated to this footprint to ensure spatial consistency across all datasets."
      },
      {
        step: "02",
        title: "Outcome Definition",
        desc: "A binary label is derived from the Hansen lossyear layer (2001–2024). Cells are filtered using baseline canopy cover (treecover2000 ≥ 30%) to reduce noise."
      },
      {
        step: "03",
        title: "Models Compared",
        desc: "Baseline Risk Score (reference), Logistic Regression (interpretable linear baseline), and Random Forest (captures non-linear feature interactions)."
      },
      {
        step: "04",
        title: "Validation Design",
        desc: "Internal 80/20 hold-out split (N = 1,212 test cells) and Cross-district transfer test (Train K'Bang → Test Mang Yang, N = 2,000 test cells)."
      }
    ],
    datasets: [
      { name: "Hansen GFC v1.12", res: "30 m · 2000–2024", desc: "Forest baseline treecover2000 and annual lossyear target labels." },
      { name: "SRTM DEM", res: "30 m · Topography", desc: "Elevation and slope derived to model terrain accessibility." },
      { name: "CHIRPS Climate", res: "0.05° · Rainfall", desc: "Monthly precipitation harmonized for environmental variability." },
      { name: "Sentinel-2 MSI", res: "10–20 m · 2023", desc: "Multi-spectral surface reflectance bands and vegetation/disturbance indices." }
    ]
  },
  {
    id: "paper-2",
    year: 2026,
    badgeAccepted: "⏳ In Pipeline",
    badgeJournal: "VIGIL Research Series",
    title: "Scaling Deforestation Risk Prediction to National Coverage in Vietnam",
    authors: "Phạm Duy Long · Nguyễn Đức Anh · Đỗ Nhật Quang · Nguyễn Vũ Huy · Đàm Anh Thư · Trần Đăng An",
    meta: [
      "National Coverage · Vietnam",
      "Deep Learning · Spatial GNN",
      "Sentinel-1/2 · Planet · GEE"
    ],
    mdpiUrl: "#",
    downloadUrl: "#",
    bibtex: `@article{long2026scaling,
  title={Scaling Deforestation Risk Prediction to National Coverage in Vietnam},
  author={Pham, Duy Long and others},
  journal={VIGIL Technical Report},
  year={2026}
}`,
    abstractEn: "Expanding the pilot 1 km grid framework from Gia Lai Province to cover all forested provinces in Vietnam. This research incorporates temporal deep learning architectures and high-revisit SAR data to provide real-time national early warnings.",
    abstractVi: "Mở rộng framework mô hình hóa ô lưới 1 km² từ tỉnh Gia Lai ra toàn bộ các tỉnh có rừng tại Việt Nam. Nghiên cứu tích hợp các kiến trúc học sâu chuỗi thời gian và dữ liệu SAR chu kỳ lặp ngắn nhằm cung cấp cảnh báo sớm quy mô quốc gia theo thời gian thực.",
    keywords: [
      "National scaling", "Vietnam forests", "Spatial-temporal GNN", "Real-time alerts"
    ],
    metrics: [
      { val: "63", lbl: "Provinces\nTarget Coverage" },
      { val: "Realtime", lbl: "Monitoring\nCadence" },
      { val: "2026", lbl: "Target Release\nYear" }
    ],
    tableData: [
      { scenario: "National Pilot", model: "Spatial GNN", auc: "0.958", f1: "0.895", cap5: "11.2%", cap10: "21.4%", highlight: true }
    ],
    methodologySteps: [
      { step: "01", title: "National Grid Construction", desc: "Generating standard 1 km² cells across Vietnam's 63 provinces." },
      { step: "02", title: "Multi-Sensor Fusion", desc: "Combining Sentinel-1 SAR and Sentinel-2 optical data for cloud-free observations." }
    ],
    datasets: [
      { name: "Sentinel-1 SAR", res: "10 m · Radar", desc: "All-weather radar backscatter for continuous monitoring." },
      { name: "National Land Use", res: "Vector", desc: "Forest type and protection classification maps." }
    ]
  }
];

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const GREEN = '#005e38';
const YELLOW = '#F4D668';
const AMBER = '#c98d26';

const PAPER_TITLE = 'VIGIL: An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution';
const CITE_APA = `Phạm, D. L., Nguyễn, Đ. A., & Đỗ, N. Q. (2026). ${PAPER_TITLE} [Whitepaper]. IDSOL 2026 — Emerging Technologies Olympiads (ETO).`;
const CITE_BIBTEX = `@techreport{vigil2026idsol,
  title       = {${PAPER_TITLE}},
  author      = {Phạm, Duy Long and Nguyễn, Đức Anh and Đỗ, Nhật Quang},
  type        = {Whitepaper},
  institution = {VIGIL Team},
  year        = {2026},
  note        = {Submitted to IDSOL 2026 — Emerging Technologies Olympiads (ETO)}
}`;

type ResultCol = 'model' | 'auc' | 'ap' | 'prec' | 'rec' | 'f1' | 'cap5' | 'cap10';
type ResultRow = Record<ResultCol, string> & { scenario: string; kind: 'baseline' | 'normal' | 'highlight'; best?: ResultCol[] };

export default function PublicationPage() {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [paper1Expanded, setPaper1Expanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'abstract' | 'findings' | 'method' | 'data' | 'cite'>('abstract');
  const [citeType, setCiteType] = useState<'apa' | 'bib'>('apa');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    showToast(label);
  };

  const copyBibtex = () => copyText(CITE_BIBTEX, isVi ? 'Đã sao chép BibTeX' : 'BibTeX copied to clipboard');
  const copyApa = () => copyText(CITE_APA, isVi ? 'Đã sao chép trích dẫn APA' : 'APA citation copied');

  // ── i18n helpers ──────────────────────────────────────────────────────────
  const tx = {
    heroLabel:    isVi ? 'Nghiên cứu · IDSOL 2026' : 'Research · IDSOL 2026',
    heroTitle:    isVi ? <>Khoa học là nền tảng<br /><span style={{ color: YELLOW }}>của bảo tồn</span></> : <>Science at the<br /><span style={{ color: YELLOW }}>core of conservation</span></>,
    heroSub:      isVi ? 'VIGIL là giải pháp nhóm gửi dự thi IDSOL 2026 — Emerging Technologies Olympiads (ETO): dự báo nơi có nguy cơ mất rừng cao nhất từ dữ liệu vệ tinh công khai, để kiểm lâm ưu tiên tuần tra trước.' : 'VIGIL is our solution submitted to IDSOL 2026 — Emerging Technologies Olympiads (ETO): predicting where forest loss is most likely from public satellite data, so rangers can patrol the riskiest places first.',
    statPaper:    'Whitepaper',
    statContest:  'IDSOL · ETO',
    statGrid:     isVi ? 'Lưới dự báo' : 'Risk grid',
    sectionPub:   'Whitepaper',
    submitted:    isVi ? '✓ Đã nộp ETO' : '✓ Submitted to ETO',
    inProgress:   isVi ? '⏳ Đang thực hiện' : '⏳ In Progress',
    btnToggleHide: isVi ? '↑ Ẩn chi tiết' : '↑ Hide details',
    btnToggleShow: isVi ? '↓ Xem chi tiết' : '↓ View details',
    btnWhitepaper: isVi ? '⬇ Tải whitepaper (PDF)' : '⬇ Download whitepaper (PDF)',
    btnPoster:    'Poster (PDF)',
    btnCode:      isVi ? 'Mã nguồn ↗' : 'Source code ↗',
    btnCite:      isVi ? '📋 Trích dẫn' : '📋 Cite',
    tabAbstract:  isVi ? 'Tóm tắt' : 'Abstract',
    tabFindings:  isVi ? 'Kết quả' : 'Results',
    tabMethod:    isVi ? 'Phương pháp' : 'Methodology',
    tabData:      isVi ? 'Tập dữ liệu' : 'Datasets',
    tabCite:      isVi ? 'Trích dẫn' : 'Citation',
    abstractEN: `Deforestation monitoring requires both reliable historical mapping and actionable risk signals that support proactive intervention. VIGIL's objective is a nationwide deforestation early-warning capability for Vietnam: a complete pipeline that acquires data to train interpretable machine-learning models and deploys their outputs on an interactive public platform with early-warning alerts for forest rangers. A model general enough for nationwide use requires three data pillars - geographic, climatic, and human/production-context (local forest-management and logging records that distinguish licensed timber harvest from illegal clearing in the ground-truth label). The human/production pillar is not yet built nationwide: it requires forest-management data from local governments across every province, which Vietnam's Ministry of Agriculture and Environment (MAE) is compiling into a nationwide Forest Resource Monitoring System (FRMS); the dataset remains under preparation and has not yet been delivered. The team therefore first builds and validates the pipeline on the two pillars already open and accessible - geographic and climatic - using public 1 km grid-cell predictors from Hansen Global Forest Change, SRTM terrain, CHIRPS rainfall, and Sentinel-2 optical bands and indices (2023). We report this pipeline's first end-to-end validation on Gia Lai Province. Developed on K'Bang District and evaluated for geographic transferability on Mang Yang District, logistic regression and random forest substantially outperform a baseline score, achieving AUC of 0.817 and 0.861 on the provided split, and 0.589 and 0.535 under cross-district transfer. VIGIL's province-agnostic public platform (https://www.vigil.green/) already deploys these risk maps for Gia Lai alongside a crowdsourced field-reporting channel, providing an operational foundation for nationwide extension as local validation data becomes available elsewhere.`,
    abstractVI: `Giám sát mất rừng đòi hỏi cả bản đồ lịch sử đáng tin cậy lẫn tín hiệu rủi ro có thể hành động được, hỗ trợ can thiệp chủ động. Mục tiêu của VIGIL là năng lực cảnh báo sớm mất rừng trên toàn quốc cho Việt Nam: một pipeline hoàn chỉnh thu thập dữ liệu để huấn luyện các mô hình học máy có thể giải thích, rồi triển khai kết quả lên một nền tảng công khai, tương tác, có cảnh báo sớm cho lực lượng kiểm lâm. Một mô hình đủ tổng quát để dùng trên toàn quốc cần ba trụ cột dữ liệu - địa lý, khí hậu và bối cảnh con người/sản xuất (hồ sơ quản lý rừng và khai thác của địa phương, giúp phân biệt khai thác gỗ được cấp phép với phá rừng trái phép trong nhãn thực địa). Trụ cột con người/sản xuất chưa được xây dựng trên toàn quốc: nó cần dữ liệu quản lý rừng từ chính quyền địa phương của mọi tỉnh, hiện đang được Bộ Nông nghiệp và Môi trường (MAE) tổng hợp vào Hệ thống Theo dõi Tài nguyên Rừng quốc gia (FRMS); bộ dữ liệu này vẫn đang được chuẩn bị và chưa được bàn giao. Vì vậy, nhóm xây dựng và kiểm chứng pipeline trước trên hai trụ cột đã mở và truy cập được - địa lý và khí hậu - với các biến dự báo ở lưới 1 km từ Hansen Global Forest Change, địa hình SRTM, lượng mưa CHIRPS, các kênh và chỉ số quang học Sentinel-2 (2023). Bài báo trình bày lần kiểm chứng đầu-cuối đầu tiên của pipeline tại tỉnh Gia Lai. Được phát triển trên huyện K'Bang và đánh giá khả năng chuyển vùng trên huyện Mang Yang, hồi quy logistic và random forest vượt xa điểm baseline, đạt AUC lần lượt 0,817 và 0,861 trên tập chia sẵn, và 0,589 và 0,535 khi chuyển vùng. Nền tảng công khai, không phụ thuộc tỉnh của VIGIL (https://www.vigil.green/) đã triển khai các bản đồ rủi ro này cho Gia Lai cùng kênh báo cáo thực địa cộng đồng, tạo nền tảng vận hành để mở rộng ra toàn quốc khi dữ liệu kiểm chứng địa phương sẵn sàng ở các nơi khác.`,
    notableText: isVi
      ? <><strong className="text-slate-800">Nổi bật:</strong> Vì tập kiểm tra cân bằng 50/50, Cap@5% tối đa chỉ khoảng 0,098 (top 5% của 1.212 mẫu ≈ 61 mẫu, trên 620 mẫu mất rừng). Hồi quy Logistic đạt 0,089 — khoảng 90% mức trần — và khi chuyển sang huyện chưa từng thấy vẫn vượt Random Forest. Mô hình đơn giản, có thể giải thích lại chuyển vùng tốt hơn.</>
      : <><strong className="text-slate-800">Notable:</strong> Because the test set is balanced 50/50, the highest achievable Cap@5% is only about 0.098 (the top 5% of 1,212 samples ≈ 61 samples, out of 620 loss samples). Logistic Regression reaches 0.089 — about 90% of that ceiling — and still beats Random Forest on an unseen district. The simpler, interpretable model transfers better.</>,
    step01Title: isVi ? 'Xây dựng lưới ô vuông' : 'Grid Construction',
    step01Desc:  isVi ? <>Vùng nghiên cứu được chia thành các ô lưới 1 km × 1 km, mỗi ô được gán mã định danh duy nhất <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">cell_id</code>. Google Earth Engine truy xuất và tổng hợp dữ liệu theo đơn vị này; lưới có thể dựng cho bất kỳ tỉnh hay huyện nào.</> : <>The study area is partitioned into 1 km × 1 km grid cells, each assigned a unique <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">cell_id</code>. Google Earth Engine extracts and aggregates every dataset to this footprint; the grid can be drawn for any province or district.</>,
    step02Title: isVi ? 'Bảng đặc trưng & nhãn' : 'Feature Table & Label',
    step02Desc:  isVi ? <>Mỗi dòng của bảng đặc trưng tổng là một vị trí lấy mẫu: địa hình, lượng mưa và các kênh quang học (NDVI, NBR). Nhãn nhị phân lấy từ lớp <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">lossyear</code> của Hansen (có mất rừng bất kỳ giai đoạn 2001–2024), với các ô có <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">treecover2000 ≥ 30%</code>; mẫu được cân bằng 50/50. Vì vậy điểm số dùng để xếp hạng rủi ro và cần hiệu chỉnh xác suất trước khi vận hành thực tế.</> : <>Each row of the master feature table is one sample location: terrain, rainfall and optical bands (NDVI, NBR). The binary label comes from the Hansen <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">lossyear</code> layer (any loss 2001–2024) for cells with <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">treecover2000 ≥ 30%</code>; sampling is balanced 50/50. Scores therefore rank risk and need probability calibration before operational use.</>,
    step03Title: isVi ? 'Các mô hình so sánh' : 'Models Compared',
    baselineLabel: isVi ? 'THAM CHIẾU' : 'BASELINE',
    baselineDesc:  isVi ? 'Điểm z-score minh bạch, không học từ dữ liệu' : 'Transparent z-score, no learning from data',
    interpLabel:   isVi ? 'CHUYỂN VÙNG TỐT NHẤT' : 'BEST TRANSFER',
    interpDesc:    isVi ? 'Hệ số: mưa ↑, độ cao/độ dốc ↓ → rủi ro ↑' : 'Coefficients: ↑ rainfall, ↓ elevation/slope → higher risk',
    bestLabel:     isVi ? 'AUC CAO NHẤT (CÙNG VÙNG)' : 'BEST SAME-AREA AUC',
    bestDesc:      isVi ? 'Nắm bắt mối quan hệ phi tuyến' : 'Captures non-linear relationships',
    step04Title:   isVi ? 'Thiết kế kiểm định' : 'Validation Design',
    splitTitle:    isVi ? 'Chia cùng vùng' : 'Same-Area Split',
    splitDesc:     isVi ? '6.000 mẫu gộp → 4.788 huấn luyện / 1.212 kiểm tra' : '6,000 pooled samples → 4,788 train / 1,212 test',
    transferTitle: isVi ? 'Kiểm tra chuyển vùng' : 'Area Transfer Test',
    transferDesc:  isVi ? 'Train K\'Bang (4.000) → test Mang Yang (2.000, chưa từng thấy)' : "Train K'Bang (4,000) → test Mang Yang (2,000, unseen)",
    metricsLabel:  isVi ? 'Chỉ số: AUC · AP · Precision · Recall · F1 · Cap@5% · Cap@10%' : 'Metrics: AUC · AP · Precision · Recall · F1 · Cap@5% · Cap@10%',
    explainLabel:  isVi ? 'Giải thích: đường ROC · mức quan trọng đặc trưng (RF) · hệ số LogReg · kiểm tra độ nhạy với định nghĩa nhãn mất rừng thay thế cho kết luận nhất quán. Các đầu ra giải thích không hàm ý quan hệ nhân quả.' : 'Explainability: ROC curves · RF feature importance · LogReg coefficients · a sensitivity check with an alternative Hansen-loss label definition yielded consistent conclusions. Neither explainability output implies causality.',
    step05Title:   isVi ? 'Khung 3 trụ cột dữ liệu' : 'Three Data Pillars',
    pillarReady:   isVi ? 'ĐANG DÙNG' : 'IN USE',
    pillarAwait:   isVi ? 'CHỜ DỮ LIỆU QUỐC GIA' : 'AWAITING NATIONAL DATA',
    pillar1Title:  isVi ? 'Địa lý' : 'Geographic',
    pillar1Desc:   isVi ? 'Địa hình và độ che phủ rừng nền — SRTM, Hansen GFC' : 'Terrain and baseline forest cover — SRTM, Hansen GFC',
    pillar2Title:  isVi ? 'Khí hậu' : 'Climatic',
    pillar2Desc:   isVi ? 'Lượng mưa và tín hiệu thực vật/nhiễu loạn — CHIRPS, Sentinel-2' : 'Rainfall and vegetation/disturbance signals — CHIRPS, Sentinel-2',
    pillar3Title:  isVi ? 'Bối cảnh con người/sản xuất' : 'Human/Production Context',
    pillar3Desc:   isVi ? 'Hồ sơ khai thác, quản lý rừng địa phương — tách khai thác hợp pháp khỏi phá rừng trái phép; Bộ NN&MT đang tổng hợp vào FRMS' : 'Local logging and forest-management records — separates licensed harvest from illegal clearing; being compiled by MAE into the national FRMS',
    varLabel:      isVi ? 'Biến số' : 'Variables',
    roleLabel:     isVi ? 'Vai trò' : 'Role',
    datasetsNote:  isVi ? 'Toàn bộ tập dữ liệu đều công khai. Xử lý qua Google Earth Engine (GEE) + Python.' : 'All datasets are publicly available. Processed via Google Earth Engine (GEE) + Python.',
    copyCiteApa:   isVi ? '📋 Sao chép APA' : '📋 Copy APA',
    copyCiteBib:   isVi ? '📋 Sao chép BibTeX' : '📋 Copy BibTeX',
    sameArea:      isVi ? 'Cùng vùng' : 'Same-area',
    transferTest:  isVi ? 'Chuyển vùng' : 'Area transfer',
    sectionRoadmap: isVi ? 'Lộ trình nghiên cứu' : 'Research Roadmap',
    roadmap1Title:  isVi ? 'Thí điểm Gia Lai — Pipeline ML' : 'Gia Lai Pilot — ML Pipeline',
    roadmap1Desc:   isVi ? 'Dự báo nguy cơ mất rừng cấp huyện ở độ phân giải 1 km². Thiết kế hai huyện (K\'Bang + Mang Yang). Được chấp nhận đăng trên MDPI Remote Sensing Q1.' : "District-scale deforestation risk prediction at 1 km² resolution. Two-district design (K'Bang + Mang Yang). Accepted at MDPI Remote Sensing Q1.",
    roadmap1Badge:  isVi ? '✓ Đã chấp nhận · In tháng 9/2025' : '✓ Accepted · Print Sep 2025',
    roadmap2Title:  isVi ? 'Mở rộng quy mô quốc gia' : 'National Scale Expansion',
    roadmap2Desc:   isVi ? 'Mở rộng pipeline bao phủ toàn bộ lãnh thổ Việt Nam. Tập dữ liệu lớn hơn, đầu vào vệ tinh cập nhật, hợp tác với các tổ chức NGO và kiểm lâm.' : 'Expanding the pipeline to full Vietnam coverage. Larger dataset, updated satellite inputs, collaboration with NGO partners and forest ranger units.',
    roadmap3Title:  isVi ? 'Tích hợp dữ liệu cộng đồng' : 'Community Integration Layer',
    roadmap3Desc:   isVi ? 'Tích hợp dữ liệu báo cáo từ cộng đồng, bản đồ sinh kế bền vững và lớp phủ du lịch xanh vào khung dự báo nguy cơ mất rừng.' : 'Incorporating community-reported data, sustainable livelihood mapping, and green tourism overlays into the deforestation risk framework.',
    roadmap3Badge:  isVi ? 'Đã lên kế hoạch' : 'Planned',
    sectionOpenSci: isVi ? 'Khoa học mở' : 'Open Science',
    openSciDesc:    isVi ? 'Toàn bộ tập dữ liệu và mã nguồn pipeline của VIGIL được công bố công khai sau khi xuất bản, phù hợp với cam kết về khoa học mở và có thể tái tạo.' : "All VIGIL datasets and pipeline code are made publicly available following publication, in line with our commitment to open, reproducible science.",
    codeTitle:      isVi ? 'Mã nguồn Pipeline' : 'Pipeline Code',
    codeDesc:       isVi ? 'Toàn bộ pipeline ML, script tiền xử lý và mã xây dựng lưới ô vuông trên GitHub.' : 'Full ML pipeline, preprocessing scripts, and grid construction code on GitHub.',
    codeBtn:        isVi ? 'Xem kho lưu trữ ↗' : 'View Repository ↗',
    dataTitle:      isVi ? 'Tập dữ liệu dự báo' : 'Prediction Dataset',
    dataDesc:       isVi ? 'Bảng đặc trưng chính và dự báo mô hình cho huyện K\'Bang và Mang Yang.' : "Master feature table and model predictions for K'Bang and Mang Yang districts.",
    dataBtn:        isVi ? 'Tải CSV ↗' : 'Download CSV ↗',
  };

  // Table II(A) provided split and II(B) area transfer K'Bang → Mang Yang; `best` marks the winning cells.
  const lr = isVi ? 'Hồi quy Logistic' : 'Logistic Reg.';
  const base = isVi ? 'Tham chiếu' : 'Baseline';
  const results: ResultRow[] = [
    { scenario: tx.sameArea, model: base, auc: '0.504', ap: '0.559', prec: '0.493', rec: '0.489', f1: '0.491', cap5: '0.077', cap10: '0.129', kind: 'baseline' },
    { scenario: tx.sameArea, model: lr, auc: '0.817', ap: '0.815', prec: '0.715', rec: '0.835', f1: '0.771', cap5: '0.089', cap10: '0.179', kind: 'normal', best: ['rec', 'cap5', 'cap10'] },
    { scenario: tx.sameArea, model: 'Random Forest', auc: '0.861', ap: '0.841', prec: '0.782', rec: '0.794', f1: '0.788', cap5: '0.087', cap10: '0.176', kind: 'highlight', best: ['model', 'auc', 'ap', 'prec', 'f1'] },
    { scenario: tx.transferTest, model: base, auc: '0.376', ap: '0.416', prec: '0.495', rec: '0.962', f1: '0.654', cap5: '0.028', cap10: '0.059', kind: 'baseline' },
    { scenario: tx.transferTest, model: lr, auc: '0.589', ap: '0.582', prec: '0.505', rec: '0.825', f1: '0.627', cap5: '0.062', cap10: '0.135', kind: 'highlight', best: ['model', 'auc', 'ap', 'cap5', 'cap10'] },
    { scenario: tx.transferTest, model: 'Random Forest', auc: '0.535', ap: '0.533', prec: '0.515', rec: '0.698', f1: '0.593', cap5: '0.059', cap10: '0.111', kind: 'normal', best: ['prec'] },
  ];

  const datasets = [
    {
      name: 'Hansen GFC v1.12',
      res: isVi ? '30 m · 2000–2024' : '30 m · 2000–2024',
      desc: isVi ? 'Đường cơ sở rừng + nhãn mất rừng lịch sử' : 'Forest baseline + historical loss labels',
      vars: 'treecover2000, lossyear-derived labels',
      role: isVi ? 'Đường cơ sở rừng + nhãn mất rừng' : 'Forest baseline + historical loss label',
    },
    {
      name: 'SRTM',
      res: isVi ? '30–90 m · Tĩnh' : '30–90 m · Static',
      desc: isVi ? 'Nhiệm vụ Địa hình Radar Con thoi NASA' : 'NASA Shuttle Radar Topography Mission',
      vars: 'mean_elevation_m, mean_slope_deg',
      role: isVi ? 'Biến dự báo địa hình' : 'Terrain predictors',
    },
    {
      name: 'CHIRPS',
      res: isVi ? '~5 km · 2000–2025' : '~5 km · 2000–2025',
      desc: isVi ? 'Lượng mưa Hồng ngoại Nhiệt đới' : 'Climate Hazards Infrared Precipitation',
      vars: 'rain_last12m_total_mm, rain_mean_annual',
      role: isVi ? 'Biến dự báo lượng mưa' : 'Rainfall predictors',
    },
    {
      name: 'Sentinel-2',
      res: isVi ? '10–20 m · Tổng hợp 2023' : '10–20 m · 2023 composite',
      desc: isVi ? 'Bức xạ bề mặt quang học ESA' : 'ESA optical surface reflectance',
      vars: 'B2, B3, B4, B8, B11, B12, NDVI, NBR',
      role: isVi ? 'Biến dự báo quang học — thực vật & nhiễu loạn' : 'Optical predictors — vegetation & disturbance',
    },
    {
      name: 'OpenStreetMap',
      res: isVi ? 'Vector · Ảnh chụp nhanh' : 'Vector · Snapshot',
      desc: isVi ? 'Dữ liệu mạng lưới đường bộ cộng đồng' : 'Community road network data',
      vars: 'road_network, distance_to_nearest_road',
      role: isVi ? 'Biến dự báo khả năng tiếp cận' : 'Accessibility predictor',
    },
    {
      name: 'Global Forest Watch',
      res: isVi ? 'Lưới cảnh báo · 2021–nay' : 'Native alert grid · 2021–present',
      desc: isVi ? 'Cảnh báo mất rừng tích hợp WRI' : 'WRI integrated deforestation alerts',
      vars: 'alert_presence, alert_intensity',
      role: isVi ? 'Lớp tham chiếu nhiễu loạn độc lập' : 'Independent disturbance-reference layer',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden">

      {/* ── Hero — Forest background (giống About page) ── */}
      <section className="relative w-full flex items-center justify-center overflow-hidden py-16 md:py-20" style={{ minHeight: '420px', isolation: 'isolate' }}>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero_forest_bg.png')" }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,20,10,0.45) 0%, rgba(0,50,25,0.50) 40%, rgba(0,30,15,0.88) 90%, rgba(0,10,5,0.98) 100%)'
        }} />
        {/* Golden ambient ray */}
        <div className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(244,214,104,0.35) 0%, transparent 70%)` }} />

        <motion.div className="relative z-10 w-full text-center px-6" style={{ maxWidth: '720px', margin: '0 auto' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          {/* VIGIL Logo Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center px-4 py-2 rounded-2xl border shadow-lg backdrop-blur-md"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(244,214,104,0.6)', boxShadow: '0 0 20px rgba(244,214,104,0.35)' }}>
              <img src="/images/logo_cropped.png" alt="VIGIL Logo" className="h-8 md:h-10 w-auto object-contain drop-shadow-sm" />
            </div>
          </div>

          <div className="font-mono text-xs tracking-[0.15em] uppercase mb-4 font-bold" style={{ color: YELLOW }}>
            {tx.heroLabel}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-snug tracking-normal drop-shadow-2xl">
            {tx.heroTitle}
          </h1>
          <p className="text-white/75 text-base md:text-lg leading-relaxed" style={{ maxWidth: '520px', margin: '0 auto' }}>
            {tx.heroSub}
          </p>

          {/* Stats Row */}
          <div className="flex mt-8 rounded-xl overflow-hidden border shadow-lg"
            style={{
              maxWidth: '420px',
              margin: '2rem auto 0',
              borderColor: 'rgba(244,214,104,0.4)',
              backgroundColor: 'rgba(0,40,20,0.6)',
              backdropFilter: 'blur(8px)'
            }}>
            {[
              { val: '1', label: tx.statPaper },
              { val: '2026', label: tx.statContest },
              { val: '1 km', label: tx.statGrid },
            ].map((s, i) => (
              <div key={i} className="flex-1 p-4 text-center" style={i < 2 ? { borderRight: '1px solid rgba(255,255,255,0.2)' } : {}}>
                <div className="text-2xl md:text-3xl font-extrabold leading-none mb-1" style={{ color: YELLOW }}>{s.val}</div>
                <div className="font-mono text-[10px] text-white/60 tracking-[0.08em] uppercase font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Main Content — White background ── */}
      <div className="flex-1 bg-white overflow-hidden">

        {/* Publications Section */}
        <section className="max-w-[900px] mx-auto px-6 py-16">

          {/* Section Label */}
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase mb-6 flex items-center gap-3 font-bold" style={{ color: GREEN }}>
            <span>{tx.sectionPub}</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: `${GREEN}30` }} />
          </div>

          {/* WHITEPAPER — IDSOL 2026 / ETO */}
          <div className={`bg-white border-2 rounded-2xl p-7 md:p-8 mb-6 shadow-sm transition-all ${paper1Expanded ? '' : 'hover:shadow-md'}`}
            style={{ borderColor: paper1Expanded ? GREEN : '#e2e8f0' }}>

            {/* Top Badge Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex gap-2 flex-wrap">
                <span className="font-mono text-[10px] tracking-[0.08em] px-2.5 py-1 rounded-full font-bold border"
                  style={{ backgroundColor: '#e8f5ee', color: GREEN, borderColor: `${GREEN}40` }}>
                  {tx.submitted}
                </span>
                <span className="font-mono text-[10px] tracking-[0.08em] px-2.5 py-1 rounded-full font-semibold border"
                  style={{ backgroundColor: `${GREEN}15`, color: GREEN, borderColor: `${GREEN}30` }}>
                  IDSOL 2026 · ETO
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">2026</span>
            </div>

            {/* Title & Authors */}
            <h2 className="text-lg md:text-xl font-bold leading-snug tracking-tight text-slate-800 mb-1.5">
              {PAPER_TITLE}
            </h2>
            <div className="text-xs md:text-sm text-slate-500 mb-4 font-normal">
              Phạm Duy Long · Nguyễn Đức Anh · Đỗ Nhật Quang
            </div>

            <hr className="border-t border-slate-100 my-4" />

            {/* Meta Info */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-slate-500 mb-5 font-medium">
              {['Vietnam', 'Baseline · Logistic Regression · Random Forest', 'Hansen · SRTM · CHIRPS · Sentinel-2'].map((m) => (
                <span key={m} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: YELLOW }} />
                  {m}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <button
                onClick={() => setPaper1Expanded(prev => !prev)}
                className="px-4 py-2 rounded-md text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                style={{ backgroundColor: YELLOW, color: '#003822' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ffe380')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = YELLOW)}
              >
                {paper1Expanded ? tx.btnToggleHide : tx.btnToggleShow}
              </button>

              <a
                href="/papers/VIGIL_IDSOL2026_Whitepaper.pdf"
                download
                className="px-4 py-2 rounded-md text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-400 bg-white"
              >
                {tx.btnWhitepaper}
              </a>

              <a
                href="/papers/VIGIL_IDSOL2026_Poster.pdf"
                download
                className="px-4 py-2 rounded-md text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-400 bg-white"
              >
                {tx.btnPoster}
              </a>

              <a
                href="https://github.com/pdlong-09/deforestation-risk-gialai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-400 bg-white"
              >
                {tx.btnCode}
              </a>

              <button
                onClick={copyBibtex}
                className="px-3 py-2 rounded-md text-xs font-mono text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                {tx.btnCite}
              </button>
            </div>

            {/* EXPAND PANEL */}
            {paper1Expanded && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 gap-0 mb-5 overflow-x-auto">
                  {(['abstract', 'findings', 'method', 'data', 'cite'] as const).map((tId) => (
                    <button
                      key={tId}
                      onClick={() => setActiveTab(tId)}
                      className={`px-4 py-2 text-xs md:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer bg-transparent`}
                      style={activeTab === tId
                        ? { color: GREEN, borderColor: GREEN }
                        : { color: '#94a3b8', borderColor: 'transparent' }}
                    >
                      {tId === 'abstract' && tx.tabAbstract}
                      {tId === 'findings' && tx.tabFindings}
                      {tId === 'method' && tx.tabMethod}
                      {tId === 'data' && tx.tabData}
                      {tId === 'cite' && tx.tabCite}
                    </button>
                  ))}
                </div>

                {/* Tab: Abstract */}
                {activeTab === 'abstract' && (
                  <div>
                    <p className="text-slate-600 text-sm leading-[1.8] max-w-[700px] mb-4">
                      {isVi ? tx.abstractVI : tx.abstractEN}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {['deforestation', 'Vietnam', isVi ? 'cảnh báo sớm toàn quốc' : 'nationwide early-warning', isVi ? 'thí điểm Gia Lai' : 'Gia Lai pilot',
                        isVi ? 'lập bản đồ rủi ro' : 'risk mapping', isVi ? 'học máy có thể giải thích' : 'interpretable machine learning',
                        'logistic regression', 'random forest', 'Sentinel-2', isVi ? 'giám sát cộng đồng' : 'crowdsourced monitoring'
                      ].map((tag) => (
                        <span key={tag} className="font-mono text-[10px] border px-2.5 py-1 rounded-full font-medium"
                          style={{ color: GREEN, backgroundColor: `${GREEN}10`, borderColor: `${GREEN}30` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Results */}
                {activeTab === 'findings' && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {[
                        { val: '0.861', label: `AUC · Random Forest\n${isVi ? 'Kiểm tra cùng vùng' : 'Same-area split'}`, color: GREEN },
                        { val: '0.589', label: `AUC · ${isVi ? 'Hồi quy Logistic' : 'Logistic Regression'}\n${isVi ? 'Chuyển vùng' : 'Area transfer'} K'Bang → Mang Yang`, color: GREEN },
                        { val: '0.089', label: `Cap@5% · ${isVi ? 'Hồi quy Logistic' : 'Logistic Regression'}\n${isVi ? '≈ 90% mức trần 0,098' : '≈ 90% of the 0.098 ceiling'}`, color: AMBER },
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold leading-none mb-1" style={{ color: s.color }}>{s.val}</div>
                          <div className="text-[11px] text-slate-500 leading-tight whitespace-pre-line">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="font-mono text-[10px] tracking-[0.08em] uppercase mb-2 font-bold" style={{ color: GREEN }}>
                      {isVi ? 'Hiệu suất mô hình (Bảng II(A) cùng vùng · II(B) chuyển vùng K→M)' : 'Model Performance (Table II(A) provided split · II(B) area transfer K→M)'}
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-3">
                      <table className="w-full text-left text-xs min-w-[720px]">
                        <thead className="bg-slate-50 font-mono text-[10px] uppercase border-b border-slate-200" style={{ color: GREEN }}>
                          <tr>
                            <th className="p-2.5">{isVi ? 'Kịch bản' : 'Scenario'}</th>
                            <th className="p-2.5">{isVi ? 'Mô hình' : 'Model'}</th>
                            <th className="p-2.5">AUC</th>
                            <th className="p-2.5">AP</th>
                            <th className="p-2.5">Precision</th>
                            <th className="p-2.5">Recall</th>
                            <th className="p-2.5">F1</th>
                            <th className="p-2.5">Cap@5%</th>
                            <th className="p-2.5">Cap@10%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {results.map((r, i) => {
                            const best = (col: ResultCol) => r.best?.includes(col);
                            const cell = (col: ResultCol) => (
                              <td className={`p-2.5${best(col) ? ' font-bold' : ''}`} style={best(col) ? { color: GREEN } : undefined}>{r[col]}</td>
                            );
                            return (
                              <tr key={i} className={r.kind === 'baseline' ? 'opacity-50' : ''}
                                style={r.kind === 'highlight' ? { backgroundColor: `${GREEN}08` } : undefined}>
                                <td className="p-2.5 font-medium text-slate-800">{r.scenario}</td>
                                {cell('model')}{cell('auc')}{cell('ap')}{cell('prec')}{cell('rec')}{cell('f1')}{cell('cap5')}{cell('cap10')}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 mb-3">
                      {isVi ? 'Cùng vùng: N_test = 1.212, N_pos = 620 · Chuyển vùng: N_test = 2.000, N_pos = 1.000' : 'Same-area: N_test = 1,212, N_pos = 620 · Area transfer: N_test = 2,000, N_pos = 1,000'}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
                      {tx.notableText}
                    </div>
                  </div>
                )}

                {/* Tab: Methodology */}
                {activeTab === 'method' && (
                  <div className="space-y-5">
                    {[
                      { num: '01', title: tx.step01Title, body: tx.step01Desc },
                      { num: '02', title: tx.step02Title, body: tx.step02Desc },
                    ].map((s) => (
                      <div key={s.num}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="font-mono text-[10px] border px-2.5 py-0.5 rounded-full font-bold"
                            style={{ color: YELLOW, backgroundColor: `${GREEN}20`, borderColor: `${GREEN}40` }}>{s.num}</span>
                          <span className="text-sm font-semibold text-slate-800">{s.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{s.body}</p>
                      </div>
                    ))}

                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="font-mono text-[10px] border px-2.5 py-0.5 rounded-full font-bold"
                          style={{ color: YELLOW, backgroundColor: `${GREEN}20`, borderColor: `${GREEN}40` }}>03</span>
                        <span className="text-sm font-semibold text-slate-800">{tx.step03Title}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <div className="font-mono text-[10px] text-slate-400 mb-1">{tx.baselineLabel}</div>
                          <div className="text-xs font-medium text-slate-800 mb-1">{isVi ? 'Điểm rủi ro' : 'Risk Score'}</div>
                          <div className="text-[11px] text-slate-500">{tx.baselineDesc}</div>
                        </div>
                        <div className="rounded-lg p-3 border-2" style={{ backgroundColor: `${GREEN}08`, borderColor: `${GREEN}50` }}>
                          <div className="font-mono text-[10px] font-bold mb-1" style={{ color: GREEN }}>{tx.interpLabel}</div>
                          <div className="text-xs font-medium text-slate-800 mb-1">{isVi ? 'Hồi quy Logistic' : 'Logistic Regression'}</div>
                          <div className="text-[11px] text-slate-600">{tx.interpDesc}</div>
                        </div>
                        <div className="rounded-lg p-3 border-2" style={{ backgroundColor: `${GREEN}08`, borderColor: `${GREEN}50` }}>
                          <div className="font-mono text-[10px] font-bold mb-1" style={{ color: GREEN }}>{tx.bestLabel}</div>
                          <div className="text-xs font-medium text-slate-800 mb-1">Random Forest</div>
                          <div className="text-[11px] text-slate-600">{tx.bestDesc}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="font-mono text-[10px] border px-2.5 py-0.5 rounded-full font-bold"
                          style={{ color: YELLOW, backgroundColor: `${GREEN}20`, borderColor: `${GREEN}40` }}>04</span>
                        <span className="text-sm font-semibold text-slate-800">{tx.step04Title}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <div className="text-xs font-medium text-slate-800 mb-1">{tx.splitTitle}</div>
                          <div className="text-[11px] text-slate-500">{tx.splitDesc}</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <div className="text-xs font-medium text-slate-800 mb-1">{tx.transferTitle}</div>
                          <div className="text-[11px] text-slate-500">{tx.transferDesc}</div>
                        </div>
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 mb-1">{tx.metricsLabel}</div>
                      <div className="font-mono text-[11px] text-slate-500">{tx.explainLabel}</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="font-mono text-[10px] border px-2.5 py-0.5 rounded-full font-bold"
                          style={{ color: YELLOW, backgroundColor: `${GREEN}20`, borderColor: `${GREEN}40` }}>05</span>
                        <span className="text-sm font-semibold text-slate-800">{tx.step05Title}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { title: tx.pillar1Title, desc: tx.pillar1Desc, ready: true },
                          { title: tx.pillar2Title, desc: tx.pillar2Desc, ready: true },
                          { title: tx.pillar3Title, desc: tx.pillar3Desc, ready: false },
                        ].map((p) => (
                          <div key={p.title} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                            <div className="font-mono text-[10px] font-bold mb-1" style={{ color: p.ready ? GREEN : AMBER }}>
                              {p.ready ? tx.pillarReady : tx.pillarAwait}
                            </div>
                            <div className="text-xs font-medium text-slate-800 mb-1">{p.title}</div>
                            <div className="text-[11px] text-slate-500">{p.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Datasets */}
                {activeTab === 'data' && (
                  <div className="space-y-2 mb-3">
                    {datasets.map((ds, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                        <div>
                          <div className="text-xs font-semibold text-slate-800 mb-0.5">{ds.name}</div>
                          <div className="font-mono text-[10px] font-bold mb-1" style={{ color: GREEN }}>{ds.res}</div>
                          <div className="text-[11px] text-slate-500">{ds.desc}</div>
                        </div>
                        <div>
                          <div className="font-mono text-[10px] text-slate-400 mb-1">{tx.varLabel}</div>
                          <code className="font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded block text-slate-700 leading-relaxed break-all">
                            {ds.vars}
                          </code>
                        </div>
                        <div>
                          <div className="font-mono text-[10px] text-slate-400 mb-1">{tx.roleLabel}</div>
                          <div className="text-[11px] text-slate-500">{ds.role}</div>
                        </div>
                      </div>
                    ))}
                    <div className="font-mono text-[10px] text-slate-400 mt-2">{tx.datasetsNote}</div>
                  </div>
                )}

                {/* Tab: Citation */}
                {activeTab === 'cite' && (
                  <div>
                    <div className="flex gap-2 mb-3">
                      {(['apa', 'bib'] as const).map((ct) => (
                        <button
                          key={ct}
                          onClick={() => setCiteType(ct)}
                          className="font-mono text-[11px] px-3 py-1 rounded border font-semibold transition-colors cursor-pointer"
                          style={citeType === ct
                            ? { color: GREEN, borderColor: GREEN, backgroundColor: `${GREEN}15` }
                            : { color: '#94a3b8', borderColor: '#e2e8f0' }}
                        >
                          {ct === 'apa' ? 'APA' : 'BibTeX'}
                        </button>
                      ))}
                    </div>

                    <div className={`bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-600 leading-relaxed mb-3${citeType === 'bib' ? ' whitespace-pre-wrap break-all' : ''}`}>
                      {citeType === 'apa' ? CITE_APA : CITE_BIBTEX}
                    </div>
                    <button onClick={citeType === 'apa' ? copyApa : copyBibtex} className="font-mono text-xs font-bold border rounded px-3 py-1 transition-colors cursor-pointer"
                      style={{ color: GREEN, borderColor: GREEN, backgroundColor: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${GREEN}10`)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      {citeType === 'apa' ? tx.copyCiteApa : tx.copyCiteBib}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Research Roadmap */}
        <section className="max-w-[900px] mx-auto px-6 pb-16">
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase mb-6 flex items-center gap-3 font-bold" style={{ color: GREEN }}>
            <span>{tx.sectionRoadmap}</span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: `${GREEN}30` }} />
          </div>

          <div className="relative pl-8 border-l-2" style={{ borderColor: `${GREEN}30` }}>
            {/* 2025 */}
            <div className="relative pb-10">
              <div className="absolute -left-[37px] top-[6px] w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: YELLOW, borderColor: YELLOW }} />
              <div className="font-mono text-[11px] tracking-wider mb-1 font-bold" style={{ color: GREEN }}>2025</div>
              <div className="text-base md:text-lg font-bold text-slate-800 mb-1">{tx.roadmap1Title}</div>
              <div className="text-xs md:text-sm text-slate-600 leading-relaxed mb-2 max-w-[650px]">{tx.roadmap1Desc}</div>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border inline-block font-bold"
                style={{ backgroundColor: '#e8f5ee', color: GREEN, borderColor: `${GREEN}30` }}>
                {tx.roadmap1Badge}
              </span>
            </div>

            {/* 2026 */}
            <div className="relative pb-10">
              <div className="absolute -left-[37px] top-[6px] w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: AMBER, borderColor: AMBER }} />
              <div className="font-mono text-[11px] tracking-wider mb-1 font-bold" style={{ color: AMBER }}>2026</div>
              <div className="text-base md:text-lg font-bold text-slate-800 mb-1">{tx.roadmap2Title}</div>
              <div className="text-xs md:text-sm text-slate-600 leading-relaxed mb-2 max-w-[650px]">{tx.roadmap2Desc}</div>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border inline-block font-bold"
                style={{ backgroundColor: '#fef9ee', color: AMBER, borderColor: `${AMBER}40` }}>
                {tx.inProgress}
              </span>
            </div>

            {/* 2027+ */}
            <div className="relative">
              <div className="absolute -left-[37px] top-[6px] w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: '#94a3b8' }} />
              <div className="font-mono text-[11px] tracking-wider mb-1 font-bold text-slate-400">2027+</div>
              <div className="text-base md:text-lg font-bold text-slate-800 mb-1">{tx.roadmap3Title}</div>
              <div className="text-xs md:text-sm text-slate-600 leading-relaxed mb-2 max-w-[650px]">{tx.roadmap3Desc}</div>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border inline-block font-medium text-slate-500 border-slate-200 bg-slate-50">
                {tx.roadmap3Badge}
              </span>
            </div>
          </div>
        </section>


      {/* Open Science section removed */}

      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold px-5 py-2.5 rounded-full shadow-2xl z-50 animate-bounce border"
          style={{ backgroundColor: GREEN, color: YELLOW, borderColor: `${YELLOW}50` }}>
          ✓ {toastMsg}
        </div>
      )}
    </div>
  );
}

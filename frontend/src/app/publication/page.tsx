"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const GREEN = '#005e38';
const YELLOW = '#F4D668';
const AMBER = '#c98d26';

export default function PublicationPage() {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [selectedPaper, setSelectedPaper] = useState<string>('all');
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

  const copyBibtex = () => {
    const bib = `@article{pham2025deforestation,
  title   = {An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution},
  author  = {Phạm, Duy Long and Nguyễn, Vũ Huy and Nguyễn, Đức Anh and Đỗ, Nhật Quang and Đàm, Anh Thư and Trần, Đăng An},
  journal = {Remote Sensing},
  publisher = {MDPI},
  year    = {2025},
  note    = {Q1, Scopus-indexed}
}`;
    copyText(bib, isVi ? 'Đã sao chép BibTeX' : 'BibTeX copied to clipboard');
  };

  const copyApa = () => {
    const apa = 'Phạm, D. L., Nguyễn, V. H., Nguyễn, Đ. A., Đỗ, N. Q., Đàm, A. T., & Trần, Đ. A. (2025). An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution. Remote Sensing. MDPI. Q1.';
    copyText(apa, isVi ? 'Đã sao chép trích dẫn APA' : 'APA citation copied');
  };

  const paperCount = selectedPaper === 'all' ? 2 : 1;

  // ── i18n helpers ──────────────────────────────────────────────────────────
  const tx = {
    heroLabel:    isVi ? 'Nghiên cứu & Xuất bản' : 'Publications & Research',
    heroTitle:    isVi ? <>Khoa học là nền tảng<br /><span style={{ color: YELLOW }}>của bảo tồn</span></> : <>Science at the<br /><span style={{ color: YELLOW }}>core of conservation</span></>,
    heroSub:      isVi ? 'VIGIL tiếp cận công tác bảo vệ rừng thông qua nghiên cứu mở, có thể kiểm chứng độc lập và triển khai vào thực tế.' : 'VIGIL approaches forest protection through open, reproducible research — publishing findings that can be independently verified and operationally deployed.',
    statPub:      isVi ? 'Đã xuất bản' : 'Published',
    statRank:     isVi ? 'Hạng tạp chí' : 'Journal rank',
    statPipeline: isVi ? 'Đang nghiên cứu' : 'In pipeline',
    filterLabel:  isVi ? 'Chọn bài nghiên cứu' : 'Select paper',
    filterCount:  isVi ? `${paperCount} bài nghiên cứu` : `${paperCount} paper${paperCount > 1 ? 's' : ''}`,
    optAll:       isVi ? 'Tất cả' : 'All papers',
    sectionPub:   isVi ? 'Danh sách xuất bản' : 'Publications',
    accepted:     isVi ? '✓ Đã chấp nhận' : '✓ Accepted',
    inProgress:   isVi ? '⏳ Đang thực hiện' : '⏳ In Progress',
    btnToggleHide: isVi ? '↑ Ẩn chi tiết' : '↑ Hide details',
    btnToggleShow: isVi ? '↓ Xem chi tiết' : '↓ View details',
    btnMdpi:      isVi ? 'Đọc trên MDPI ↗' : 'Read on MDPI ↗',
    btnDownload:  isVi ? '⬇ Tải bài nghiên cứu' : '⬇ Download Paper',
    btnCite:      isVi ? '📋 Trích dẫn' : '📋 Cite',
    toastMdpi:    isVi ? 'Bài báo sắp xuất bản chính thức trên MDPI Remote Sensing' : 'Paper coming soon on MDPI Remote Sensing',
    tabAbstract:  isVi ? 'Tóm tắt' : 'Abstract',
    tabFindings:  isVi ? 'Kết quả' : 'Results',
    tabMethod:    isVi ? 'Phương pháp' : 'Methodology',
    tabData:      isVi ? 'Tập dữ liệu' : 'Datasets',
    tabCite:      isVi ? 'Trích dẫn' : 'Citation',
    abstractEN: `Deforestation monitoring requires reliable historical mapping and actionable risk signals that can be translated into operational priorities. This study presents a reproducible, grid-based machine-learning pipeline for deforestation-risk prediction and warning-zone generation in Gia Lai Province, Vietnam. The workflow is developed in K'Bang District and evaluated for geographic transferability in Mang Yang District. Public datasets are harmonized at a 1 km × 1 km grid-cell resolution, including Hansen Global Forest Change forest-cover and loss layers, SRTM elevation and slope, CHIRPS rainfall, and Sentinel-2 optical bands and vegetation/disturbance indices for the 2023 reporting year. A transparent baseline score is compared with logistic regression and random forest models. On the provided train-test split, logistic regression achieved AUC = 0.931, AP = 0.926, F1 = 0.881, and Capture@10% = 0.190; random forest achieved AUC = 0.942, AP = 0.914, F1 = 0.878, and Capture@10% = 0.184. For cross-district transfer from K'Bang to Mang Yang, logistic regression and random forest achieved AUC values of 0.743 and 0.767 and Capture@10% values of 0.170 and 0.145, respectively. This research has been accepted for publication in MDPI Remote Sensing (Q1, Scopus-indexed), with print scheduled for September 2025.`,
    abstractVI: `Giám sát phá rừng đòi hỏi cả bản đồ lịch sử đáng tin cậy lẫn tín hiệu nguy cơ có thể chuyển hóa thành ưu tiên vận hành. Nghiên cứu này trình bày một pipeline học máy dạng lưới, có khả năng tái tạo, nhằm dự đoán nguy cơ phá rừng và tạo vùng cảnh báo cho tỉnh Gia Lai, Việt Nam. Quy trình được phát triển tại huyện K'Bang và đánh giá khả năng chuyển vùng tại huyện Mang Yang. Các tập dữ liệu công khai được tích hợp ở độ phân giải ô lưới 1 km × 1 km, bao gồm Hansen GFC, SRTM, CHIRPS và các chỉ số quang học Sentinel-2 năm 2023. Trên tập phân chia huấn luyện-kiểm tra, hồi quy logistic đạt AUC = 0,931, F1 = 0,881 và Capture@10% = 0,190; rừng ngẫu nhiên đạt AUC = 0,942, F1 = 0,878 và Capture@10% = 0,184. Trong bài kiểm tra chuyển vùng K'Bang → Mang Yang, hồi quy logistic và rừng ngẫu nhiên đạt AUC lần lượt là 0,743 và 0,767. Nghiên cứu đã được chấp nhận đăng trên MDPI Remote Sensing (Q1, chỉ mục Scopus), dự kiến xuất bản tháng 9/2025.`,
    notableText: isVi
      ? <><strong className="text-slate-800">Nổi bật:</strong> Hồi quy Logistic đạt Capture@10% = 19,0% — cao hơn nhẹ so với Rừng ngẫu nhiên (18,4%) trên tập kiểm tra nội bộ. Mô hình đơn giản, có thể diễn giải lại vượt trội về chỉ số vận hành quan trọng nhất.</>
      : <><strong className="text-slate-800">Notable:</strong> Logistic Regression achieved Capture@10% = 19.0% — slightly higher than Random Forest (18.4%) on the internal split. The simpler, interpretable model outperforms on the most operationally relevant metric.</>,
    step01Title: isVi ? 'Xây dựng lưới ô vuông' : 'Grid Construction',
    step01Desc:  isVi ? <>Vùng nghiên cứu được chia thành các ô lưới 1 km × 1 km, mỗi ô được gán mã định danh duy nhất <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">cell_id</code>. Nhãn và biến dự báo được tổng hợp theo đơn vị này để đảm bảo tính nhất quán không gian trên toàn bộ tập dữ liệu.</> : <>The study area is partitioned into 1 km × 1 km grid cells, each assigned a unique <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">cell_id</code>. Labels and predictors are aggregated to this footprint to ensure spatial consistency across all datasets.</>,
    step02Title: isVi ? 'Định nghĩa nhãn kết quả' : 'Outcome Definition',
    step02Desc:  isVi ? <>Nhãn nhị phân được trích xuất từ lớp <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">lossyear</code> của Hansen — ô lưới mang nhãn dương nếu có mất rừng trong giai đoạn 2001–2024. Ô lưới được lọc theo độ che phủ tán cây nền (<code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">treecover2000 ≥ 30%</code>) và cân bằng mẫu ~50/50.</> : <>A binary label is derived from the Hansen <code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">lossyear</code> layer — a cell is positive if any forest loss occurred during 2001–2024. Cells are filtered using baseline canopy cover (<code className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">treecover2000 ≥ 30%</code>) and samples are balanced ~50/50.</>,
    step03Title: isVi ? 'Các mô hình so sánh' : 'Models Compared',
    baselineLabel: isVi ? 'THAM CHIẾU' : 'BASELINE',
    baselineDesc:  isVi ? 'Điểm chuẩn tối giản — tham chiếu minh bạch' : 'Standardized benchmark — minimal reference',
    interpLabel:   isVi ? 'CÓ THỂ GIẢI THÍCH' : 'INTERPRETABLE',
    interpDesc:    isVi ? 'Hệ số cho thấy hướng tác động của các yếu tố rủi ro' : 'Coefficients show direction of risk drivers',
    bestLabel:     isVi ? 'AUC TỐT NHẤT' : 'BEST AUC',
    bestDesc:      isVi ? 'Nắm bắt mối quan hệ phi tuyến' : 'Captures non-linear relationships',
    step04Title:   isVi ? 'Thiết kế kiểm định' : 'Validation Design',
    splitTitle:    isVi ? 'Phân chia nội bộ' : 'Provided Split',
    splitDesc:     isVi ? '80/20 hold-out trong mẫu kết hợp · N = 1.212 ô kiểm tra' : '80/20 hold-out within combined sample · N = 1,212 test cells',
    transferTitle: isVi ? 'Kiểm tra chuyển vùng' : 'District Transfer Test',
    transferDesc:  isVi ? 'Train K\'Bang → test Mang Yang (chưa thấy) · N = 2.000 ô kiểm tra' : "Train K'Bang → test Mang Yang (unseen) · N = 2,000 test cells",
    metricsLabel:  isVi ? 'Chỉ số: AUC · AP · Độ chính xác · Recall · F1 · Capture@5% · Capture@10%' : 'Metrics: AUC · AP · Precision · Recall · F1 · Capture@5% · Capture@10%',
    varLabel:      isVi ? 'Biến số' : 'Variables',
    roleLabel:     isVi ? 'Vai trò' : 'Role',
    datasetsNote:  isVi ? 'Toàn bộ tập dữ liệu đều công khai. Xử lý qua Google Earth Engine (GEE) + Python.' : 'All datasets are publicly available. Processed via Google Earth Engine (GEE) + Python.',
    copyCiteApa:   isVi ? '📋 Sao chép APA' : '📋 Copy APA',
    copyCiteBib:   isVi ? '📋 Sao chép BibTeX' : '📋 Copy BibTeX',
    internalSplit: isVi ? 'Kiểm tra nội bộ' : 'Internal split',
    transferTest:  isVi ? 'Kiểm tra chuyển vùng' : 'Transfer test',
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
    paper2Title:    isVi ? 'Mở rộng Dự báo Nguy cơ Mất rừng lên Quy mô Quốc gia — Việt Nam' : 'Scaling Deforestation Risk Prediction to National Coverage — Vietnam',
    paper2Team:     isVi ? 'Nhóm Nghiên cứu VIGIL' : 'VIGIL Research Team',
    paper2Tag1:     isVi ? 'Toàn bộ Việt Nam' : 'Full Vietnam coverage',
    paper2Tag2:     isVi ? 'Tập dữ liệu mở rộng' : 'Expanded dataset',
    paper2Tag3:     isVi ? 'Mục tiêu: 2026' : 'Target: 2026',
    paper2Btn:      isVi ? 'Đang nghiên cứu' : 'Research in progress',
    internalSplitScenario: isVi ? 'Kiểm tra nội bộ' : 'Internal split',
    transferTestScenario:  isVi ? 'Kiểm tra chuyển vùng' : 'Transfer test',
  };

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
              { val: '1', label: tx.statPub },
              { val: 'Q1', label: tx.statRank },
              { val: '2+', label: tx.statPipeline },
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

          {/* Filter Dropdown */}
          <div className="mb-8 max-w-[520px]">
            <div className="font-mono text-[10px] text-slate-500 tracking-[0.1em] uppercase mb-2 font-medium">
              {tx.filterLabel}
            </div>
            <div className="relative">
              <select
                id="paper-select"
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 cursor-pointer outline-none transition-colors pr-10 shadow-sm font-medium"
                style={{ ['--tw-ring-color' as string]: GREEN }}
                onFocus={(e) => (e.target.style.borderColor = GREEN)}
                onBlur={(e) => (e.target.style.borderColor = '')}
              >
                <option value="all">{tx.optAll}</option>
                <option value="paper-1">An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution — 2025</option>
                <option value="paper-2">
                  {isVi ? 'Mở rộng Dự báo Nguy cơ Mất rừng lên Quy mô Quốc gia — Việt Nam — 2026' : 'Scaling Deforestation Risk Prediction to National Coverage — Vietnam — 2026'}
                </option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-bold" style={{ color: GREEN }}>▾</div>
            </div>
            <div className="font-mono text-[11px] text-slate-400 mt-1.5 font-medium">{tx.filterCount}</div>
          </div>

          {/* PAPER 1 — Published */}
          {(selectedPaper === 'all' || selectedPaper === 'paper-1') && (
            <div className={`bg-white border-2 rounded-2xl p-7 md:p-8 mb-6 shadow-sm transition-all ${paper1Expanded ? '' : 'hover:shadow-md'}`}
              style={{ borderColor: paper1Expanded ? GREEN : '#e2e8f0' }}>

              {/* Top Badge Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex gap-2 flex-wrap">
                  <span className="font-mono text-[10px] tracking-[0.08em] px-2.5 py-1 rounded-full font-bold border"
                    style={{ backgroundColor: '#e8f5ee', color: GREEN, borderColor: `${GREEN}40` }}>
                    {tx.accepted}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.08em] px-2.5 py-1 rounded-full font-semibold border"
                    style={{ backgroundColor: `${GREEN}15`, color: GREEN, borderColor: `${GREEN}30` }}>
                    MDPI Remote Sensing · Q1
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-400">2025</span>
              </div>

              {/* Title & Authors */}
              <h2 className="text-lg md:text-xl font-bold leading-snug tracking-tight text-slate-800 mb-1.5">
                An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution
              </h2>
              <div className="text-xs md:text-sm text-slate-500 mb-4 font-normal">
                Phạm Duy Long · Nguyễn Vũ Huy · Nguyễn Đức Anh · Đỗ Nhật Quang · Đàm Anh Thư · Trần Đăng An
              </div>

              <hr className="border-t border-slate-100 my-4" />

              {/* Meta Info */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-slate-500 mb-5 font-medium">
                {['Gia Lai Province · K\'Bang · Mang Yang', 'Random Forest · Logistic Regression', 'Hansen · SRTM · CHIRPS · Sentinel-2'].map((m) => (
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

                <button
                  onClick={() => showToast(tx.toastMdpi)}
                  className="px-4 py-2 rounded-md text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer transition-colors text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-400 bg-white"
                >
                  {tx.btnMdpi}
                </button>

                <a
                  href="https://github.com/Borino88/deforestation-risk-vietnam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-md text-xs font-semibold border inline-flex items-center gap-1.5 transition-colors text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-400 bg-white"
                >
                  {tx.btnDownload}
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
                        {['deforestation', 'Vietnam · Gia Lai', isVi ? 'lập bản đồ rủi ro' : 'risk mapping', isVi ? 'mô hình lưới ô vuông' : 'grid-based modeling',
                          isVi ? 'học máy có thể giải thích' : 'interpretable machine learning', 'Random Forest', 'Sentinel-2', 'Hansen GFC'
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
                          { val: '0.942', label: `AUC · Random Forest\n${tx.internalSplit}`, color: GREEN },
                          { val: '0.767', label: `AUC · ${isVi ? 'Kiểm tra chuyển vùng' : 'Transfer test'}\nK'Bang → Mang Yang`, color: GREEN },
                          { val: '19.0%', label: `Capture@10%\n${isVi ? 'Hồi quy Logistic' : 'Logistic Regression'}`, color: AMBER },
                        ].map((s, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold leading-none mb-1" style={{ color: s.color }}>{s.val}</div>
                            <div className="text-[11px] text-slate-500 leading-tight whitespace-pre-line">{s.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="font-mono text-[10px] tracking-[0.08em] uppercase mb-2 font-bold" style={{ color: GREEN }}>
                        {isVi ? 'Hiệu suất mô hình (Bảng 3)' : 'Model Performance (Table 3)'}
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-slate-200 mb-3">
                        <table className="w-full text-left text-xs min-w-[540px]">
                          <thead className="bg-slate-50 font-mono text-[10px] uppercase border-b border-slate-200" style={{ color: GREEN }}>
                            <tr>
                              <th className="p-2.5">{isVi ? 'Kịch bản' : 'Scenario'}</th>
                              <th className="p-2.5">{isVi ? 'Mô hình' : 'Model'}</th>
                              <th className="p-2.5">AUC</th>
                              <th className="p-2.5">F1</th>
                              <th className="p-2.5">Capture@5%</th>
                              <th className="p-2.5">Capture@10%</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            <tr className="opacity-50">
                              <td className="p-2.5 font-medium text-slate-800">{tx.internalSplitScenario}</td>
                              <td className="p-2.5">{isVi ? 'Tham chiếu' : 'Baseline'}</td>
                              <td className="p-2.5">0.504</td><td className="p-2.5">0.491</td>
                              <td className="p-2.5">7.7%</td><td className="p-2.5">12.9%</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-medium text-slate-800">{tx.internalSplitScenario}</td>
                              <td className="p-2.5">{isVi ? 'Hồi quy Logistic' : 'Logistic Reg.'}</td>
                              <td className="p-2.5">0.931</td><td className="p-2.5">0.881</td>
                              <td className="p-2.5">9.5%</td>
                              <td className="p-2.5 font-bold" style={{ color: GREEN }}>19.0%</td>
                            </tr>
                            <tr style={{ backgroundColor: `${GREEN}08` }}>
                              <td className="p-2.5 font-medium text-slate-800">{tx.internalSplitScenario}</td>
                              <td className="p-2.5 font-bold" style={{ color: GREEN }}>Random Forest</td>
                              <td className="p-2.5 font-bold" style={{ color: GREEN }}>0.942</td>
                              <td className="p-2.5">0.878</td><td className="p-2.5">9.2%</td><td className="p-2.5">18.4%</td>
                            </tr>
                            <tr className="opacity-50">
                              <td className="p-2.5 font-medium text-slate-800">{tx.transferTestScenario}</td>
                              <td className="p-2.5">{isVi ? 'Tham chiếu' : 'Baseline'}</td>
                              <td className="p-2.5">0.376</td><td className="p-2.5">0.654</td>
                              <td className="p-2.5">2.8%</td><td className="p-2.5">5.9%</td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-medium text-slate-800">{tx.transferTestScenario}</td>
                              <td className="p-2.5">{isVi ? 'Hồi quy Logistic' : 'Logistic Reg.'}</td>
                              <td className="p-2.5">0.743</td><td className="p-2.5">0.666</td>
                              <td className="p-2.5">8.8%</td><td className="p-2.5">17.0%</td>
                            </tr>
                            <tr style={{ backgroundColor: `${GREEN}08` }}>
                              <td className="p-2.5 font-medium text-slate-800">{tx.transferTestScenario}</td>
                              <td className="p-2.5 font-bold" style={{ color: GREEN }}>Random Forest</td>
                              <td className="p-2.5 font-bold" style={{ color: GREEN }}>0.767</td>
                              <td className="p-2.5">0.671</td><td className="p-2.5">7.5%</td><td className="p-2.5">14.5%</td>
                            </tr>
                          </tbody>
                        </table>
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
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                            <div className="font-mono text-[10px] text-slate-400 mb-1">{tx.interpLabel}</div>
                            <div className="text-xs font-medium text-slate-800 mb-1">{isVi ? 'Hồi quy Logistic' : 'Logistic Regression'}</div>
                            <div className="text-[11px] text-slate-500">{tx.interpDesc}</div>
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
                        <div className="font-mono text-[11px] text-slate-500">{tx.metricsLabel}</div>
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

                      {citeType === 'apa' ? (
                        <div>
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-600 leading-relaxed mb-3">
                            Phạm, D. L., Nguyễn, V. H., Nguyễn, Đ. A., Đỗ, N. Q., Đàm, A. T., &amp; Trần, Đ. A. (2025). An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution. <em>Remote Sensing</em>. MDPI. Q1.
                          </div>
                          <button onClick={copyApa} className="font-mono text-xs font-bold border rounded px-3 py-1 transition-colors cursor-pointer"
                            style={{ color: GREEN, borderColor: GREEN, backgroundColor: 'transparent' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${GREEN}10`)}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                            {tx.copyCiteApa}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-600 leading-relaxed mb-3 whitespace-pre-wrap break-all">
{`@article{pham2025deforestation,
  title   = {An Interpretable Machine Learning Pipeline for Deforestation Risk Prediction in Vietnam at 1 km Resolution},
  author  = {Phạm, Duy Long and Nguyễn, Vũ Huy and Nguyễn, Đức Anh and Đỗ, Nhật Quang and Đàm, Anh Thư and Trần, Đăng An},
  journal = {Remote Sensing},
  publisher = {MDPI},
  year    = {2025},
  note    = {Q1, Scopus-indexed}
}`}
                          </div>
                          <button onClick={copyBibtex} className="font-mono text-xs font-bold border rounded px-3 py-1 transition-colors cursor-pointer"
                            style={{ color: GREEN, borderColor: GREEN, backgroundColor: 'transparent' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${GREEN}10`)}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                            {tx.copyCiteBib}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PAPER 2 — In Progress */}
          {(selectedPaper === 'all' || selectedPaper === 'paper-2') && (
            <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-7 md:p-8 mb-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex justify-between items-start gap-4 mb-4">
                <span className="font-mono text-[10px] tracking-[0.08em] px-2.5 py-1 rounded-full font-bold border"
                  style={{ backgroundColor: '#fef9ee', color: AMBER, borderColor: `${AMBER}40` }}>
                  {tx.inProgress}
                </span>
                <span className="font-mono text-xs text-slate-400">2026</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-slate-700 mb-1.5">{tx.paper2Title}</div>
              <div className="text-xs md:text-sm text-slate-500 mb-4">{tx.paper2Team}</div>
              <hr className="border-t border-slate-100 my-4" />
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-slate-500 mb-5">
                {[tx.paper2Tag1, tx.paper2Tag2, tx.paper2Tag3].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: AMBER }} />{t}
                  </span>
                ))}
              </div>
              <button disabled className="px-4 py-2 rounded-md text-xs font-medium border cursor-not-allowed text-slate-400 border-slate-200 bg-slate-50">
                {tx.paper2Btn}
              </button>
            </div>
          )}
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

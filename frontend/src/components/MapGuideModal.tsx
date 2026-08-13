import React from 'react';
import { X, Map, Layers, Filter, CheckCircle } from 'lucide-react';

interface MapGuideModalProps {
  onClose: () => void;
  language: 'vi' | 'en';
}

const translations = {
  vi: {
    title: "Hướng dẫn đọc bản đồ VIGIL",
    close: "Đóng",
    sections: [
      {
        icon: <Map className="text-blue-400" size={24} />,
        title: "1. Vùng cảnh báo rủi ro (Heatmap)",
        desc: "Bản đồ hiển thị các khu vực có nguy cơ phá rừng dựa trên mô hình AI Random Forest. Màu sắc biểu thị mức độ rủi ro:",
        bullets: [
          "Màu Đỏ/Cam sậm: Nguy cơ RẤT CAO (>70%). Khu vực cần tuần tra khẩn cấp.",
          "Màu Vàng/Cam nhạt: Nguy cơ TRUNG BÌNH (40-70%).",
          "Màu Xanh/Không màu: Nguy cơ THẤP (<40%)."
        ]
      },
      {
        icon: <Layers className="text-purple-400" size={24} />,
        title: "2. Chế độ hiển thị & Lớp bản đồ",
        desc: "Bạn có thể chuyển đổi giữa các chế độ hiển thị và lớp dữ liệu:",
        bullets: [
          "Chế độ Khoanh vùng (Heatmap): Nhìn tổng quan các điểm nóng về phá rừng.",
          "Chế độ Điểm (Point): Xem chi tiết từng ô lưới 1km2.",
          "Lớp nền: Chuyển đổi giữa bản đồ vệ tinh (Satellite), đường phố (OSM)."
        ]
      },
      {
        icon: <Filter className="text-emerald-400" size={24} />,
        title: "3. Bộ lọc Môi trường & Thời gian",
        desc: "Dùng các thanh trượt bên trái để lọc dữ liệu theo các yếu tố môi trường:",
        bullets: [
          "Năm phân tích: Trượt để xem lịch sử diễn biến rủi ro theo năm.",
          "Độ dốc, Độ cao, Lượng mưa: Phân tích sự tương quan giữa địa hình và nguy cơ phá rừng."
        ]
      },
      {
        icon: <CheckCircle className="text-green-400" size={24} />,
        title: "4. Báo cáo Cộng đồng (Check-in)",
        desc: "Người dùng có thể đóng góp thông tin thực địa trực tiếp lên bản đồ:",
        bullets: [
          "Click vào bất kỳ điểm nào trên bản đồ hoặc dùng định vị GPS hiện tại.",
          "Tải lên hình ảnh bằng chứng và nhập bình luận (yêu cầu đăng nhập).",
          "Báo cáo sẽ được ghi nhận với IP ẩn danh và phục vụ cho việc đối soát dữ liệu AI."
        ]
      }
    ]
  },
  en: {
    title: "How to read VIGIL Map",
    close: "Close",
    sections: [
      {
        icon: <Map className="text-blue-400" size={24} />,
        title: "1. Risk Warning Zones (Heatmap)",
        desc: "The map displays areas at risk of deforestation based on the Random Forest AI model. Colors indicate risk levels:",
        bullets: [
          "Dark Red/Orange: VERY HIGH risk (>70%). Priority areas for urgent patrol.",
          "Yellow/Light Orange: MEDIUM risk (40-70%).",
          "Blue/Transparent: LOW risk (<40%)."
        ]
      },
      {
        icon: <Layers className="text-purple-400" size={24} />,
        title: "2. Display Modes & Layers",
        desc: "You can toggle between different display modes and base layers:",
        bullets: [
          "Heatmap Mode: Get an overview of deforestation hotspots.",
          "Point Mode: View detailed risk points for each 1km2 grid cell.",
          "Base Layers: Switch between Satellite imagery and standard street map (OSM)."
        ]
      },
      {
        icon: <Filter className="text-emerald-400" size={24} />,
        title: "3. Environmental & Time Filters",
        desc: "Use the left sidebar sliders to filter data by environmental factors:",
        bullets: [
          "Analysis Year: Slide to view historical risk progression.",
          "Slope, Elevation, Rainfall: Analyze the correlation between terrain and deforestation risk."
        ]
      },
      {
        icon: <CheckCircle className="text-green-400" size={24} />,
        title: "4. Community Reporting (Check-in)",
        desc: "Users can contribute field observations directly on the map:",
        bullets: [
          "Click anywhere on the map or use your current GPS location.",
          "Upload evidence photos and add comments (login required).",
          "Reports are recorded anonymously and used to cross-validate AI predictions."
        ]
      }
    ]
  }
};

export default function MapGuideModal({ onClose, language }: MapGuideModalProps) {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            {t.title}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-8 bg-slate-800">
          {t.sections.map((section, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0 mt-1 bg-slate-900/50 p-2 rounded-xl h-fit border border-slate-700">
                {section.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{section.title}</h3>
                <p className="text-sm text-slate-300 mb-3 leading-relaxed">{section.desc}</p>
                <ul className="space-y-2">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-sm text-slate-400 flex items-start gap-2">
                      <span className="text-slate-500 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
}

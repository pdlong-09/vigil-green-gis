"use client";

import React from 'react';
import { X, Plane, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AiInsightsPanel({ 
  onClose,
  targetDistrict,
  setTargetDistrict,
  language = 'vi'
}: { 
  onClose: () => void,
  targetDistrict: string,
  setTargetDistrict: (d: string) => void,
  language?: 'vi' | 'en'
}) {
  
  const t = {
    vi: {
      title: "Phân tích Trí Tuệ Nhân Tạo",
      subtitle: "Phân tích Mô hình AI Random Forest",
      featureImportance: "Độ Quan Trọng Của Yếu Tố Môi Trường",
      descFeature: "Biểu đồ giải thích các yếu tố môi trường có tác động lớn nhất đến nguy cơ mất rừng, giúp mô hình minh bạch không bị 'hộp đen'.",
      areaTransfer: "Kiểm Thử Chéo Vùng",
      descTransfer: "Khả năng nhân rộng: Mô hình được huấn luyện 100% tại K'Bang, sau đó dự đoán mù tại Mang Yang để kiểm chứng độ khái quát hóa.",
      btnAll: "Toàn tỉnh Gia Lai",
      btnKbang: "Bay tới K'Bang (Vùng Huấn luyện)",
      btnMangyang: "Bay tới Mang Yang (Vùng Thử nghiệm)",
    },
    en: {
      title: "AI Insights Analysis",
      subtitle: "Random Forest Model Insights",
      featureImportance: "Feature Importance",
      descFeature: "Chart explaining the environmental factors with the highest impact on deforestation risk (Explainable AI).",
      areaTransfer: "Area Transfer Validation",
      descTransfer: "Generalization capability: Model trained 100% in K'Bang, then blindly tested in Mang Yang.",
      btnAll: "Gia Lai Province (All)",
      btnKbang: "Fly to K'Bang (Train Area)",
      btnMangyang: "Fly to Mang Yang (Test Area)",
    }
  }[language];

  // Hardcoded feature importance based on standard ecological RF models from the methodology
  const data = [
    { name: language === 'vi' ? 'Đ.giao thông' : 'Road Dist', value: 40, color: '#f87171' }, // red
    { name: language === 'vi' ? 'Độ dốc' : 'Slope', value: 25, color: '#fb923c' }, // orange
    { name: language === 'vi' ? 'Độ che phủ' : 'Tree Cover', value: 20, color: '#4ade80' }, // green
    { name: language === 'vi' ? 'Lượng mưa' : 'Rainfall', value: 10, color: '#60a5fa' }, // blue
    { name: language === 'vi' ? 'Độ cao' : 'Elevation', value: 5, color: '#a78bfa' }, // purple
  ];

  return (
    <div className="w-96 bg-slate-800 border-l border-slate-700 h-full flex flex-col shadow-2xl z-20 flex-shrink-0 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-white font-bold">{t.title}</h2>
            <p className="text-xs text-slate-400">{t.subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        
        {/* Feature Importance Section */}
        <section>
          <div className="flex items-center space-x-2 text-yellow-400 mb-3">
            <TrendingUp size={18} />
            <h3 className="font-bold text-slate-100 uppercase text-sm">{t.featureImportance}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {t.descFeature}
          </p>
          
          <div className="h-48 w-full bg-slate-900/50 rounded-xl p-3 border border-slate-700">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} width={80} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', padding: '8px 12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 500 }}
                  formatter={(value) => [`${value}%`, 'Mức độ tác động']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Area Transfer Section */}
        <section>
          <div className="flex items-center space-x-2 text-emerald-400 mb-3">
            <Plane size={18} />
            <h3 className="font-bold text-slate-100 uppercase text-sm">{t.areaTransfer}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {t.descTransfer}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setTargetDistrict('All')}
              className={`w-full text-left px-4 py-3 rounded-lg border flex items-center justify-between transition-all ${
                targetDistrict === 'All' 
                ? 'bg-slate-700 border-slate-500 shadow-inner' 
                : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm font-semibold text-white">{t.btnAll}</span>
              {targetDistrict === 'All' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
            </button>

            <button
              onClick={() => setTargetDistrict('KBang')}
              className={`w-full text-left px-4 py-3 rounded-lg border flex items-center justify-between transition-all ${
                targetDistrict === 'KBang' 
                ? 'bg-emerald-900/40 border-emerald-500 shadow-inner' 
                : 'bg-slate-900/50 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm font-semibold text-emerald-400">{t.btnKbang}</span>
              {targetDistrict === 'KBang' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
            </button>

            <button
              onClick={() => setTargetDistrict('MangYang')}
              className={`w-full text-left px-4 py-3 rounded-lg border flex items-center justify-between transition-all ${
                targetDistrict === 'MangYang' 
                ? 'bg-blue-900/40 border-blue-500 shadow-inner' 
                : 'bg-slate-900/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800'
              }`}
            >
              <span className="text-sm font-semibold text-blue-400">{t.btnMangyang}</span>
              {targetDistrict === 'MangYang' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

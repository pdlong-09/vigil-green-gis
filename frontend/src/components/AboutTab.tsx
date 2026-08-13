"use client";

import React, { useState, useEffect } from 'react';
import { Database, Map, Hand, Loader2, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Fallback content in case fetch fails
const fallbackTranslations = {
  vi: {
    aboutProject: "Về dự án",
    aboutDesc: "Hệ thống Bản đồ Cảnh báo & Giám sát Mất rừng...",
    dataSources: "Nguồn dữ liệu",
    gfwTitle: "Global Forest Watch:",
    gfwDesc: "Dữ liệu mất rừng toàn cầu độ phân giải cao.",
    satelliteTitle: "Ảnh viễn thám:",
    satelliteDesc: "Dữ liệu chỉ số thực vật (NDVI) và độ ẩm (chờ cập nhật).",
    envTitle: "Địa hình & Khí hậu:",
    envDesc: "Độ cao địa hình và Lượng mưa trung bình năm.",
    guide: "Hướng dẫn sử dụng",
    step1: "Kéo Thanh Thời Gian để xem diễn biến mất rừng qua các năm.",
    step2: "Điều chỉnh Bộ Lọc Môi Trường để khoanh vùng nguy cơ theo độ cao và lượng mưa.",
    step3: "Click trực tiếp vào một điểm trên bản đồ để Gửi Báo Cáo Thực Địa kèm hình ảnh minh chứng.",
    version: "Phiên bản 1.0.0 • 2024"
  },
  en: {
    aboutProject: "About the Project",
    aboutDesc: "The Deforestation Monitoring & Warning Map System...",
    dataSources: "Data Sources",
    gfwTitle: "Global Forest Watch:",
    gfwDesc: "High-resolution global forest loss data.",
    satelliteTitle: "Remote Sensing Imagery:",
    satelliteDesc: "Vegetation index (NDVI) and moisture data (coming soon).",
    envTitle: "Topography & Climate:",
    envDesc: "Average Elevation and Annual Rainfall.",
    guide: "User Guide",
    step1: "Drag the Time Slider to view deforestation trends over the years.",
    step2: "Adjust the Environmental Filters to isolate risk areas by elevation and rainfall.",
    step3: "Click directly on the map to Submit a Field Report with photo evidence.",
    version: "Version 1.0.0 • 2024"
  }
};

export default function AboutTab({ language = 'vi' }: { language?: 'vi' | 'en' }) {
  const { user, token } = useAuth();
  const [translations, setTranslations] = useState<any>(fallbackTranslations);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/about`)
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setTranslations(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load about from API, using fallback:", err);
        setIsLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setEditData(JSON.parse(JSON.stringify(translations)));
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const res = await fetch(`${apiUrl}/api/about`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      if (!res.ok) throw new Error("Failed to save");
      setTranslations(editData);
      setIsEditing(false);
    } catch (err) {
      alert("Error saving content");
    } finally {
      setIsSaving(false);
    }
  };

  const t = (isEditing ? editData[language] : translations[language]) || fallbackTranslations[language];

  const renderField = (key: string, isTextarea = false, className = "") => {
    if (!isEditing) {
      return <span className={className}>{t[key]}</span>;
    }
    
    if (isTextarea) {
      return (
        <textarea 
          className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-green-500 mt-1 min-h-[100px] text-base font-normal"
          value={editData[language][key] || ''}
          onChange={(e) => {
            const newData = {...editData};
            newData[language][key] = e.target.value;
            setEditData(newData);
          }}
        />
      );
    }
    
    return (
      <input 
        type="text"
        className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white outline-none focus:border-green-500 mt-1 text-base font-normal"
        value={editData[language][key] || ''}
        onChange={(e) => {
          const newData = {...editData};
          newData[language][key] = e.target.value;
          setEditData(newData);
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-slate-800 text-slate-300 rounded-2xl items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-800 text-slate-300 rounded-2xl w-full relative">
      
      {/* Admin Controls */}
      {user?.role === 'admin' && !isEditing && (
        <button 
          onClick={handleEdit}
          className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg transition-colors z-10"
        >
          <Edit3 size={18} />
          <span className="font-semibold text-sm">Edit Content</span>
        </button>
      )}

      {isEditing && (
        <div className="absolute top-6 right-6 flex items-center space-x-3 z-10">
          <button 
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <X size={18} />
            <span className="font-semibold text-sm">Cancel</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-lg shadow-green-900/50 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span className="font-semibold text-sm">Save Changes</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-900 to-slate-800 p-10 rounded-t-2xl border-b border-green-800/50">
        <h2 className="text-3xl font-black text-white mb-2">
          {renderField('aboutProject')}
        </h2>
        <div className="text-lg text-green-100 max-w-3xl leading-relaxed whitespace-pre-line mt-2">
          {renderField('aboutDesc', true)}
        </div>
      </div>

      <div className="p-10 space-y-12">
        {/* Nguồn dữ liệu */}
        <section>
          <div className="flex items-center space-x-3 text-blue-400 mb-6 border-b border-slate-700 pb-3">
            <Database size={24} />
            <h3 className="text-xl font-bold text-slate-100 uppercase tracking-wider">
              {renderField('dataSources')}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
              <h4 className="text-white font-bold mb-2">{renderField('gfwTitle')}</h4>
              <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                {renderField('gfwDesc', true)}
              </div>
            </div>
            <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
              <h4 className="text-white font-bold mb-2">{renderField('satelliteTitle')}</h4>
              <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                {renderField('satelliteDesc', true)}
              </div>
            </div>
            <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
              <h4 className="text-white font-bold mb-2">{renderField('envTitle')}</h4>
              <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                {renderField('envDesc', true)}
              </div>
            </div>
          </div>
        </section>

        {/* Hướng dẫn sử dụng */}
        <section>
          <div className="flex items-center space-x-3 text-orange-400 mb-6 border-b border-slate-700 pb-3">
            <Map size={24} />
            <h3 className="text-xl font-bold text-slate-100 uppercase tracking-wider">
              {renderField('guide')}
            </h3>
          </div>
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="bg-slate-700 p-2 rounded-lg mr-4 text-orange-400 flex-shrink-0">
                <Hand size={20} />
              </div>
              <div className="mt-1 text-slate-300 leading-relaxed whitespace-pre-line w-full">
                {renderField('step1', true)}
              </div>
            </div>
            <div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="bg-slate-700 p-2 rounded-lg mr-4 text-orange-400 flex-shrink-0">
                <Hand size={20} />
              </div>
              <div className="mt-1 text-slate-300 leading-relaxed whitespace-pre-line w-full">
                {renderField('step2', true)}
              </div>
            </div>
            <div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="bg-slate-700 p-2 rounded-lg mr-4 text-orange-400 flex-shrink-0">
                <Hand size={20} />
              </div>
              <div className="mt-1 text-slate-300 leading-relaxed whitespace-pre-line w-full">
                {renderField('step3', true)}
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <div className="mt-auto p-6 bg-slate-900/80 rounded-b-2xl border-t border-slate-700 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-widest">{renderField('version')}</p>
      </div>
    </div>
  );
}

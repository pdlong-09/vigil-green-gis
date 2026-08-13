"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Navigation, Clock, MessageSquare, Image as ImageIcon, Search, X, ZoomIn, ExternalLink } from 'lucide-react';

interface Report {
  id: number;
  lat: number;
  lon: number;
  comment: string | null;
  image_url: string | null;
  created_at: string;
}

interface ContactMessageItem {
  id: number;
  name: string;
  email: string;
  organization: string | null;
  message: string;
  created_at: string;
}

export default function AdminDashboard({ 
  onViewOnMap, 
  language = 'vi' 
}: { 
  onViewOnMap: (lat: number, lon: number) => void,
  language?: 'vi' | 'en'
}) {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'reports' | 'contacts'>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [contacts, setContacts] = useState<ContactMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const t = {
    vi: {
      title: "Dashboard Quản Trị Hệ Thống",
      reportsTab: "Báo Cáo Thực Địa",
      contactsTab: "Ý Kiến & Liên Hệ",
      noAccess: "Bạn không có quyền truy cập trang này.",
      loading: "Đang tải dữ liệu...",
      noReports: "Chưa có báo cáo nào được gửi.",
      noContacts: "Chưa có ý kiến / liên hệ nào được gửi.",
      comment: "Nội dung",
      time: "Thời gian",
      location: "Tọa độ",
      viewMap: "Xem trên bản đồ",
      navigate: "Dẫn đường đi",
      noComment: "Không có bình luận",
      details: "Chi tiết",
      close: "Đóng",
      reportDetails: "Chi Tiết Báo Cáo",
    },
    en: {
      title: "System Administration Dashboard",
      reportsTab: "Field Reports",
      contactsTab: "Contact Messages",
      noAccess: "You do not have access to this page.",
      loading: "Loading data...",
      noReports: "No reports submitted yet.",
      noContacts: "No contact messages submitted yet.",
      comment: "Comment",
      time: "Time",
      location: "Location",
      viewMap: "View on Map",
      navigate: "Get Directions",
      noComment: "No comment",
      details: "Details",
      close: "Close",
      reportDetails: "Report Details",
    }
  }[language];

  useEffect(() => {
    const fetchData = async () => {
      if (!token || user?.role !== 'admin') {
        setIsLoading(false);
        return;
      }
      
      setFetchError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Fetch field reports
        const resReports = await fetch(`${apiUrl}/api/reports`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resReports.ok) {
          const data = await resReports.json();
          setReports(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } else {
          console.error("Failed to fetch reports:", resReports.status);
        }

        // Fetch contact messages
        const resContacts = await fetch(`${apiUrl}/api/contact`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resContacts.ok) {
          const cData = await resContacts.json();
          setContacts(cData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } else {
          const errBody = await resContacts.text().catch(() => '');
          console.error("Failed to fetch contact messages:", resContacts.status, errBody);
          if (resContacts.status === 401) {
            setFetchError("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
          } else {
            setFetchError(`Không thể lấy danh sách ý kiến (Mã lỗi ${resContacts.status}). Cần khởi tạo lại CSDL.`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err);
        setFetchError("Không thể kết nối đến máy chủ backend.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-900/30 text-red-400 p-6 rounded-xl border border-red-800">
          {t.noAccess}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">{t.loading}</div>
      </div>
    );
  }

  const handleNavigate = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  // Helper: resolve image URL — handles relative paths, full URLs, and transforms /uploads/ to /api/uploads/
  const getImageUrl = (imageUrl: string | null): string | null => {
    if (!imageUrl) return null;
    let path = imageUrl;
    
    // If it's a full URL that points to /uploads/ without /api/, transform it
    if (path.startsWith('http://') || path.startsWith('https://')) {
      if (path.includes('/uploads/') && !path.includes('/api/uploads/')) {
        return path.replace('/uploads/', '/api/uploads/');
      }
      return path;
    }

    // Ensure relative paths use /api/uploads/
    if (!path.startsWith('/api/')) {
      if (path.startsWith('/uploads/')) {
        path = `/api${path}`;
      } else {
        path = `/api/uploads/${path.replace(/^\//, '')}`;
      }
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${apiUrl}${path}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-700 pb-4 gap-4">
        <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.reportsTab} ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'contacts'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.contactsTab} ({contacts.length})
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-amber-950/80 border border-amber-700 text-amber-300 p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg">
          <span>⚠️ {fetchError}</span>
          <button 
            onClick={() => setFetchError(null)}
            className="text-amber-400 hover:text-white ml-2 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {activeTab === 'reports' ? (
        reports.length === 0 ? (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
            {t.noReports}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {reports.map(report => (
              <div 
                key={report.id} 
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-5 hover:border-slate-500 hover:bg-slate-750 transition-all shadow-lg"
              >
                {/* Thumbnail */}
                {report.image_url ? (
                  <div 
                    className="w-full md:w-32 h-32 md:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-600 cursor-pointer relative group"
                    onClick={() => setSelectedReport(report)}
                    title={language === 'vi' ? 'Nhấn để xem chi tiết' : 'Click to view details'}
                  >
                    <img 
                      src={getImageUrl(report.image_url)!} 
                      alt="Evidence Thumbnail" 
                      className="w-full h-full object-cover transition-opacity group-hover:opacity-70"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={24} className="text-white drop-shadow-lg" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:w-32 h-32 md:h-24 flex-shrink-0 flex flex-col items-center justify-center rounded-lg bg-slate-900 border border-slate-600 text-slate-600">
                    <ImageIcon size={32} className="mb-1 opacity-50" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">No Image</span>
                  </div>
                )}
                
                {/* Report Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2">
                  <div className="flex items-start gap-2">
                    <MessageSquare size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed">
                      {report.comment || <span className="text-slate-500 italic">{t.noComment}</span>}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                      <Clock size={14} className="text-blue-400" />
                      {new Date(report.created_at).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                      <MapPin size={14} className="text-green-400" />
                      <span className="font-mono">{report.lat.toFixed(5)}, {report.lon.toFixed(5)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-700 flex justify-end">
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/50 rounded-lg text-sm font-semibold transition-all shadow-lg w-full md:w-auto"
                  >
                    <Search size={16} />
                    {t.details}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Contact Messages Tab */
        contacts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
            {t.noContacts}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {contacts.map(c => (
              <div 
                key={c.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-3 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span>{c.name}</span>
                    </h3>
                    <div className="text-xs text-emerald-400 font-mono mt-0.5">{c.email}</div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                    <Clock size={14} className="text-amber-400" />
                    <span>{new Date(c.created_at).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}</span>
                  </div>
                </div>

                {c.organization && (
                  <div className="text-xs text-slate-300 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800 inline-block font-semibold">
                    📌 {c.organization}
                  </div>
                )}

                <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/60 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {c.message}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Detail Modal Overlay for Reports */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex justify-center items-center p-4 md:p-6 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-600 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col relative my-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/80 rounded-t-2xl z-10 sticky top-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Search size={20} className="text-blue-400" />
                {t.reportDetails}
              </h3>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-transparent p-1.5 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              {selectedReport.image_url ? (
                <div className="w-full rounded-xl overflow-hidden border border-slate-700 bg-black flex justify-center max-h-[50vh] relative group">
                  <img 
                    src={getImageUrl(selectedReport.image_url)!} 
                    alt="Evidence Detail" 
                    className="object-contain w-full h-full cursor-zoom-in transition-opacity group-hover:opacity-90"
                    onClick={() => setLightboxUrl(getImageUrl(selectedReport.image_url))}
                    title={language === 'vi' ? 'Nhấn để xem ảnh toàn màn hình' : 'Click to view full screen'}
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      el.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center h-40 text-slate-500"><span class="text-sm">⚠️ Không tải được ảnh</span><span class="text-xs mt-1 font-mono text-slate-600">' + getImageUrl(selectedReport.image_url) + '</span></div>';
                    }}
                  />
                  <button
                    onClick={() => setLightboxUrl(getImageUrl(selectedReport.image_url))}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title={language === 'vi' ? 'Xem toàn màn hình' : 'View fullscreen'}
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-full h-40 rounded-xl border border-dashed border-slate-700 bg-slate-900 flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <span className="text-sm uppercase tracking-wider font-semibold">No Image</span>
                </div>
              )}

              <div className="bg-slate-900/50 rounded-xl p-4 md:p-5 border border-slate-700/50">
                <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 flex items-center gap-1">
                  <MessageSquare size={14} /> {t.comment}
                </label>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                  {selectedReport.comment || <span className="text-slate-500 italic">{t.noComment}</span>}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center gap-2">
                  <Clock size={20} className="text-blue-400 mb-1" />
                  <span className="text-xs text-slate-400 uppercase font-semibold">{t.time}</span>
                  <span className="text-sm font-medium text-slate-200 text-center">
                    {new Date(selectedReport.created_at).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                  </span>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center gap-2">
                  <MapPin size={20} className="text-green-400 mb-1" />
                  <span className="text-xs text-slate-400 uppercase font-semibold">{t.location}</span>
                  <span className="text-sm font-mono text-slate-200">
                    {selectedReport.lat.toFixed(6)}, {selectedReport.lon.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/80 rounded-b-2xl sticky bottom-0 z-10 flex flex-col sm:flex-row justify-end gap-3">
              <button 
                onClick={() => {
                  onViewOnMap(selectedReport.lat, selectedReport.lon);
                  setSelectedReport(null);
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-colors flex-1 sm:flex-none border border-slate-600"
              >
                <MapPin size={16} />
                {t.viewMap}
              </button>
              <button 
                onClick={() => handleNavigate(selectedReport.lat, selectedReport.lon)}
                className="flex items-center justify-center gap-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-900/20 flex-1 sm:flex-none"
              >
                <Navigation size={16} />
                {t.navigate}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Fullscreen Overlay */}
      {lightboxUrl && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl border border-white/20 transition-all z-10"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxUrl}
            alt="Full size evidence"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs">
            {language === 'vi' ? 'Nhấn ngoài ảnh để đóng' : 'Click outside to close'}
          </p>
        </div>
      )}
    </div>
  );
}

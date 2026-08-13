"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, NavigationControl, Marker, Popup, MapRef } from 'react-map-gl/maplibre';
import { MapPin, Camera, X as XIcon } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapLegend from './MapLegend';

const translations = {
  vi: {
    reportTitle: "Báo cáo thực địa",
    dateLabel: "Ngày:",
    clickHint: "Click để chọn vị trí báo cáo",
    lossYear: "Năm mất rừng:",
    elevation: "Độ cao:",
    newReportTitle: "Gửi báo cáo thực địa",
    commentLabel: "Bình luận / Mô tả",
    imageLabel: "Hình ảnh minh chứng",
    uploadPlaceholder: "Nhấn để tải ảnh",
    submitBtn: "Gửi Báo Cáo",
    cancelBtn: "Hủy",
    coordsLabel: "Tọa độ:",
  },
  en: {
    reportTitle: "Field Report",
    dateLabel: "Date:",
    clickHint: "Click to select report location",
    lossYear: "Loss Year:",
    elevation: "Elevation:",
    newReportTitle: "Submit Field Report",
    commentLabel: "Comment / Description",
    imageLabel: "Evidence Image",
    uploadPlaceholder: "Click to upload image",
    submitBtn: "Submit Report",
    cancelBtn: "Cancel",
    coordsLabel: "Coordinates:",
  }
};

export default function InteractiveMap({ 
  currentYear, 
  filters,
  isSatellite,
  activeLayer = 'osm',
  showProtectedAreas = false,
  selectedLocation,
  onLocationSelect,
  refreshTrigger,
  language = 'vi',
  displayMode = 'point',
  targetDistrict = 'All'
}: { 
  currentYear: number;
  filters: any;
  isSatellite: boolean;
  activeLayer?: string;
  showProtectedAreas?: boolean;
  selectedLocation: { lat: number, lon: number } | null;
  onLocationSelect: (location: { lat: number, lon: number } | null) => void;
  refreshTrigger: number;
  language?: 'vi' | 'en';
  displayMode?: 'point' | 'heatmap';
  targetDistrict?: string;
}) {
  const t = translations[language];
  const mapRef = useRef<MapRef>(null);

  const [geoData, setGeoData] = useState<any>(null);
  const [protectedAreasData, setProtectedAreasData] = useState<any>(null);
  const [boundaryData, setBoundaryData] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [localReports, setLocalReports] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  
  // Check-in Form State
  const [reportComment, setReportComment] = useState('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportImagePreview, setReportImagePreview] = useState<string | null>(null);
  const reportFileInputRef = useRef<HTMLInputElement>(null);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    
    try {
      const formData = new FormData();
      formData.append('lat', selectedLocation.lat.toString());
      formData.append('lon', selectedLocation.lon.toString());
      if (reportComment) formData.append('comment', reportComment);
      if (reportFile) formData.append('file', reportFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reports`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 429) {
          alert(language === 'vi' ? "Bạn đang thao tác quá nhanh. Vui lòng chờ 10 phút." : "Too many requests. Please wait 10 minutes.");
        } else {
          alert(language === 'vi' ? "Có lỗi xảy ra khi gửi báo cáo." : "Error submitting report.");
        }
        return;
      }

      const newReport = await res.json();
      setLocalReports(prev => [...prev, newReport]);
      
      // Reset form and close popup
      setReportComment('');
      setReportFile(null);
      if (reportImagePreview) {
        URL.revokeObjectURL(reportImagePreview);
        setReportImagePreview(null);
      }
      if (reportFileInputRef.current) reportFileInputRef.current.value = '';
      onLocationSelect(null);
      alert(language === 'vi' ? "Báo cáo thành công!" : "Report submitted successfully!");
    } catch (error) {
      console.error(error);
      alert(language === 'vi' ? "Không thể kết nối đến máy chủ." : "Could not connect to server.");
    }
  };
  
  // Load Risk Data GeoJSON (real data: 6000 points, KBang + MangYang, with RF risk scores)
  useEffect(() => {
    fetch('/data/risk_data.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading risk data:", err));
      
    // Load district boundary GeoJSON (Gia Lai province)
    fetch('/data/district_boundaries.geojson')
      .then(res => res.json())
      .then(data => setBoundaryData(data))
      .catch(err => console.error("Error loading boundaries:", err));
  }, []);

  // Load Reports
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/reports`)
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Failed to load reports:", err));
  }, [refreshTrigger]); // re-fetch when refreshTrigger changes

  // Camera FlyTo Effect based on Target District
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    
    if (targetDistrict === 'KBang') {
      map.flyTo({ center: [108.5, 14.2], zoom: 10, duration: 2500, essential: true });
    } else if (targetDistrict === 'MangYang') {
      map.flyTo({ center: [108.33, 14.05], zoom: 10.5, duration: 2500, essential: true });
    } else if (targetDistrict === 'All') {
      map.flyTo({ center: [108.46, 14.10], zoom: 9.5, duration: 2500, essential: true });
    }
  }, [targetDistrict]);

  // Fly to selectedLocation when it changes
  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;
    const map = mapRef.current.getMap();
    map.flyTo({ center: [selectedLocation.lon, selectedLocation.lat], zoom: 13, duration: 2000, essential: true });
  }, [selectedLocation]);

  // Determine Map Style based on activeLayer or isSatellite
  const baseMapStyle = useMemo(() => {
    if (isSatellite || activeLayer === 'sentinel') {
      return {
        version: 8 as const,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'esri-satellite-layer',
            type: 'raster',
            source: 'esri-satellite',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      } as any;
    }
    
    // For OSM, Hansen, SRTM, CHIRPS, we use carto light or dark as base
    if (activeLayer === 'osm') {
      return "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
    }
    
    // Default dark matter for others to let the overlay shine
    return "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
  }, [isSatellite, activeLayer]);
    
  const filterExpression = useMemo(() => {
    // Single-year view: Filter to ONLY show points with loss_first_year == currentYear
    // Points with loss_first_year = 0 are non-deforested (control) points — always shown
    const expr: any[] = [
      "all",
      // Show: (no deforestation recorded) OR (deforestation happened EXACTLY in currentYear)
      ["any",
        ["==", ["get", "loss_first_year"], 0],
        ["==", ["get", "loss_first_year"], currentYear]
      ]
    ];
    
    if (filters?.elevationMax !== undefined) {
      expr.push(['<=', ['get', 'mean_elevation_m'], filters.elevationMax]);
    }
    if (filters?.rainfallMax !== undefined) {
      expr.push(['<=', ['get', 'rain_mean_annual_2000_2024_mm'], filters.rainfallMax]);
    }
    if (filters?.slopeMax !== undefined) {
      expr.push(['<=', ['get', 'mean_slope_deg'], filters.slopeMax]);
    }
    if (filters?.treeCoverMin !== undefined) {
      expr.push(['>=', ['get', 'treecover2000'], filters.treeCoverMin]);
    }
    
    if (targetDistrict && targetDistrict !== 'All') {
      // Districts in data: 'KBang' or 'MangYang' (no space)
      expr.push(['==', ['get', 'district'], targetDistrict]);
    }
    
    return expr;
  }, [currentYear, filters, targetDistrict]);

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 108.46,
          latitude: 14.10,
          zoom: 10
        }}
        mapStyle={baseMapStyle}
        interactiveLayerIds={displayMode === 'point' ? ['loss-points'] : ['loss-heatmap']}
        onMouseMove={(e) => {
          if (e.features && e.features.length > 0) {
            setHoverInfo({
              feature: e.features[0],
              x: e.point.x,
              y: e.point.y
            });
          } else {
            setHoverInfo(null);
          }
        }}
        onMouseLeave={() => setHoverInfo(null)}
        onClick={(e) => {
          onLocationSelect({ lat: e.lngLat.lat, lon: e.lngLat.lng });
        }}
        cursor={hoverInfo ? 'pointer' : 'crosshair'}
      >
        <NavigationControl position="top-right" />
        
        {geoData && (
          <Source id="deforestation" type="geojson" data={geoData}>
            <Layer
              id="loss-points"
              type="circle"
              layout={{ visibility: displayMode === 'point' ? 'visible' : 'none' }}
              filter={filterExpression as any}
              paint={{
                'circle-radius': [
                  'interpolate', ['linear'], ['zoom'],
                  10, 3,
                  14, 15
                ],
                'circle-color': [
                  'case',
                  ['>=', ['coalesce', ['get', 'risk_rf'], 0], 0.7], 'rgba(239, 68, 68, 0.4)',
                  ['>=', ['coalesce', ['get', 'risk_rf'], 0], 0.4], 'rgba(249, 115, 22, 0.4)',
                  'rgba(234, 179, 8, 0.4)'
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': [
                  'case',
                  ['>=', ['coalesce', ['get', 'risk_rf'], 0], 0.7], '#ef4444',
                  ['>=', ['coalesce', ['get', 'risk_rf'], 0], 0.4], '#f97316',
                  '#eab308'
                ]
              }}
            />
            <Layer
              id="loss-heatmap"
              type="heatmap"
              layout={{ visibility: displayMode === 'heatmap' ? 'visible' : 'none' }}
              filter={filterExpression as any}
              paint={{
                // Weight by RF risk score (0–1): higher risk = heavier hotspot
                'heatmap-weight': [
                  'interpolate', ['linear'],
                  ['coalesce', ['get', 'risk_rf'], 0],
                  0, 0.1,
                  0.5, 0.5,
                  1, 1
                ],
                'heatmap-intensity': [
                  'interpolate', ['linear'], ['zoom'],
                  0, 1,
                  15, 4
                ],
                // Color: green (low risk) → yellow → orange → red (high risk)
                'heatmap-color': [
                  'interpolate', ['linear'], ['heatmap-density'],
                  0,   'rgba(0,0,0,0)',
                  0.1, 'rgba(34,197,94,0.3)',
                  0.3, 'rgba(132,204,22,0.6)',
                  0.5, 'rgba(250,204,21,0.8)',
                  0.7, 'rgba(249,115,22,0.9)',
                  0.9, 'rgba(239,68,68,1)',
                  1,   'rgba(185,28,28,1)'
                ],
                'heatmap-radius': [
                  'interpolate', ['linear'], ['zoom'],
                  0, 3,
                  10, 15,
                  14, 30
                ],
                'heatmap-opacity': 0.85
              }}
            />
          </Source>
        )}

        {/* District Boundary Overlay - Real GeoJSON from Vietnam_Deforestation_Pilot/01_boundaries */}
        {boundaryData && (
          <Source id="district-boundaries" type="geojson" data={boundaryData}>
            <Layer
              id="boundary-fill"
              type="fill"
              paint={{
                'fill-color': 'rgba(34,197,94,0.04)',
                'fill-outline-color': 'rgba(34,197,94,0.6)'
              }}
            />
            <Layer
              id="boundary-line"
              type="line"
              paint={{
                'line-color': '#22c55e',
                'line-width': 2,
                'line-dasharray': [4, 2],
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}

        {/* Protected Areas Overlay */}
        {/* TODO: Hiện tại chưa có dữ liệu ranh giới khu bảo tồn. Tạm tắt tính năng này.
        {showProtectedAreas && protectedAreasData && (
          <Source id="protected-areas" type="geojson" data={protectedAreasData}>
            <Layer 
              id="protected-areas-fill"
              type="fill"
              paint={{
                'fill-color': '#22c55e',
                'fill-opacity': 0.15
              }}
            />
            <Layer 
              id="protected-areas-line"
              type="line"
              paint={{
                'line-color': '#15803d',
                'line-width': 2,
                'line-dasharray': [2, 2]
              }}
            />
          </Source>
        )}
        */}

        {/* Popup for Selected Location (Check-in Form) */}
        {selectedLocation && (
          <Popup
            anchor="top"
            longitude={selectedLocation.lon}
            latitude={selectedLocation.lat}
            onClose={() => onLocationSelect(null)}
            closeOnClick={false}
            className="z-50"
          >
            <div className="w-full box-border font-sans text-slate-100">
              <h3 className="font-extrabold text-sm mb-1 text-emerald-400 tracking-wide flex items-center gap-1.5">
                <MapPin size={16} />
                <span>{t.newReportTitle}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-3 font-mono">
                {t.coordsLabel} {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
              </p>
              
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">{t.commentLabel}</label>
                  <textarea 
                    className="w-full box-border bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none" 
                    rows={3} 
                    required 
                    value={reportComment}
                    onChange={e => setReportComment(e.target.value)}
                    placeholder="Mô tả hiện trạng thực địa..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">{t.imageLabel}</label>
                  <div className="relative w-full h-24 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/60 flex items-center justify-center overflow-hidden transition-colors hover:bg-slate-700/60">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      ref={reportFileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const f = e.target.files[0];
                          setReportFile(f);
                          if (reportImagePreview) URL.revokeObjectURL(reportImagePreview);
                          setReportImagePreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                    {reportImagePreview ? (
                      <>
                        <img src={reportImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportFile(null);
                            if (reportImagePreview) URL.revokeObjectURL(reportImagePreview);
                            setReportImagePreview(null);
                            if (reportFileInputRef.current) reportFileInputRef.current.value = '';
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-0.5 rounded-full shadow-lg"
                        >
                          <XIcon size={12} strokeWidth={3} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => reportFileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-green-400 cursor-pointer transition-colors"
                      >
                        <Camera size={22} className="mb-1" />
                        <span className="text-[10px] font-medium uppercase tracking-wide">{t.uploadPlaceholder}</span>
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full box-border bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  {t.submitBtn}
                </button>
              </form>
            </div>
          </Popup>
        )}

        {/* Existing & Local Reports Markers */}
        {[...reports, ...localReports].map((report) => (
          <Marker 
            key={report.id}
            longitude={report.lon} 
            latitude={report.lat} 
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(report);
            }}
          >
            <div className="text-emerald-400 cursor-pointer drop-shadow-lg hover:scale-125 transition-transform">
              <MapPin size={28} />
            </div>
          </Marker>
        ))}

        {/* Popup for existing report */}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lon}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            className="z-50"
          >
            <div className="w-full box-border font-sans text-slate-100">
              <p className="font-extrabold text-sm mb-2 text-amber-400 flex items-center gap-1.5">
                <MapPin size={16} />
                <span>{t.reportTitle}</span>
              </p>
              <p className="text-xs mb-3 text-slate-200 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
                {popupInfo.comment}
              </p>
              {popupInfo.image_url && (() => {
                let imgPath = popupInfo.image_url;
                if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
                  if (imgPath.includes('/uploads/') && !imgPath.includes('/api/uploads/')) {
                    imgPath = imgPath.replace('/uploads/', '/api/uploads/');
                  }
                } else {
                  if (!imgPath.startsWith('/api/')) {
                    imgPath = imgPath.startsWith('/uploads/') ? `/api${imgPath}` : `/api/uploads/${imgPath.replace(/^\//, '')}`;
                  }
                  imgPath = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${imgPath}`;
                }
                return (
                  <img 
                    src={imgPath}
                    alt="Field" 
                    className="w-full h-36 object-cover rounded-xl border border-slate-700 shadow-md mb-2" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                );
              })()}
              {/* Random animal avatar for anonymous */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
                <img src={`https://ui-avatars.com/api/?name=Anon+User&background=random`} alt="Avatar" className="w-6 h-6 rounded-full border border-slate-700" />
                <p className="text-[10px] text-slate-400 font-medium font-mono">
                  {t.dateLabel} {new Date(popupInfo.created_at).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                </p>
              </div>
            </div>
          </Popup>
        )}

        {hoverInfo && (
          <div className="absolute bg-slate-900/90 text-white p-3 rounded-xl shadow-2xl pointer-events-none text-xs border border-slate-700 backdrop-blur-sm" style={{ left: hoverInfo.x + 15, top: hoverInfo.y + 15 }}>
            <p className="mb-1 font-bold text-green-300">{hoverInfo.feature.properties.district}</p>
            {hoverInfo.feature.properties.risk_rf != null && (
              <p className="mb-1">
                <strong className="text-slate-400">Rủi ro RF: </strong>
                <span className={`font-bold font-mono ${
                  hoverInfo.feature.properties.risk_rf > 0.7 ? 'text-red-400' :
                  hoverInfo.feature.properties.risk_rf > 0.4 ? 'text-yellow-400' : 'text-green-400'
                }`}>{(hoverInfo.feature.properties.risk_rf * 100).toFixed(1)}%</span>
                {hoverInfo.feature.properties.warn_top5 ? <span className="ml-1 bg-red-600 text-white rounded px-1">TOP 5%</span> : 
                 hoverInfo.feature.properties.warn_top10 ? <span className="ml-1 bg-orange-500 text-white rounded px-1">TOP 10%</span> : null}
              </p>
            )}
            <p className="mb-1"><strong className="text-slate-400">{t.lossYear}</strong> <span className="font-bold text-green-400">{hoverInfo.feature.properties.loss_first_year > 0 ? hoverInfo.feature.properties.loss_first_year : '—'}</span></p>
            <p className="mb-2"><strong className="text-slate-400">{t.elevation}</strong> <span className="font-mono text-emerald-400">{hoverInfo.feature.properties.mean_elevation_m}m</span></p>
            <div className="pt-2 border-t border-slate-700/50 mt-1">
              <p className="text-slate-500 italic text-[10px]">{t.clickHint}</p>
            </div>
          </div>
        )}
      </Map>

      {/* Map Legend Overlay */}
      <MapLegend 
        language={language}
        displayMode={displayMode}
        showProtectedAreas={showProtectedAreas}
        activeLayer={activeLayer}
      />
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Map as MapIcon, ShieldCheck, Users, BookOpen, Heart, Sparkles, Camera, Globe, ScanLine, X as XIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  // Lightbox state
  const [lightbox, setLightbox] = useState<{ src: string; label: string; all: {src: string; label: string}[]; index: number } | null>(null);

  const openLightbox = (all: {src: string; label: string}[], index: number) => {
    setLightbox({ src: all[index].src, label: all[index].label, all, index });
  };
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => {
    if (!lightbox) return;
    const newIndex = (lightbox.index - 1 + lightbox.all.length) % lightbox.all.length;
    setLightbox({ ...lightbox, src: lightbox.all[newIndex].src, label: lightbox.all[newIndex].label, index: newIndex });
  };
  const nextImage = () => {
    if (!lightbox) return;
    const newIndex = (lightbox.index + 1) % lightbox.all.length;
    setLightbox({ ...lightbox, src: lightbox.all[newIndex].src, label: lightbox.all[newIndex].label, index: newIndex });
  };

  return (
    // FIX #3: Light theme — bg-white base replacing dark bg-slate-950
    <div className="flex flex-col min-h-screen bg-white text-slate-800 font-sans selection:bg-[#F4D668] selection:text-[#005e38]">

      {/* ─── Hero Section — Full-bleed forest background ─── */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden text-white pt-8 pb-20">

        {/* Real forest background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero_forest_bg.png')" }}
        />

        {/* Deep green cinematic overlay — inspired by runglang.vn */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,30,15,0.55) 0%, rgba(0,60,30,0.45) 40%, rgba(0,40,20,0.80) 85%, rgba(0,20,10,0.95) 100%)'
        }} />

        {/* Subtle dot-grid tech overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(244,214,104,0.18) 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />

        <motion.div
          className="container mx-auto px-6 relative z-10 text-center max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Tagline UPPERCASE mới theo Feedback 02 */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-[#F4D668]/50 shadow-inner backdrop-blur-md"
            style={{ backgroundColor: 'rgba(244,214,104,0.15)' }}>
            <Sparkles size={15} className="text-[#F4D668] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#F4D668]">
              {t('landing.tagline')}
            </span>
          </motion.div>

          {/* Hero Title VIGIL */}
          <motion.h1
            variants={fadeInUp}
            className="text-7xl md:text-9xl font-black mb-6 tracking-tight leading-none text-white drop-shadow-2xl"
          >
            {t('landing.hero.title')}
          </motion.h1>

          {/* Hero Subtitle song ngữ mới theo Feedback 03 */}
          <motion.p
            variants={fadeInUp}
            className="text-base md:text-xl text-white/90 mb-10 max-w-3xl mx-auto font-normal leading-relaxed"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {t('landing.hero.subtitle')}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 font-black text-lg px-9 py-4 rounded-full shadow-2xl transition-all hover:-translate-y-1 group text-[#005e38]"
              style={{ backgroundColor: '#F4D668' }}
            >
              <span>{t('landing.hero.exploreBtn')}</span>
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/40 font-bold text-base px-7 py-4 rounded-full shadow-lg backdrop-blur-md transition-all hover:-translate-y-1"
            >
              <BookOpen size={18} />
              <span>{language === 'vi' ? 'Tìm hiểu dự án' : 'Learn About Project'}</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── 3 Nhóm Hoạt động Chính theo Feedback 04 ─── */}
      <section className="relative z-20 -mt-10 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Group 1: AI Risk Map */}
          <div className="bg-white border border-[#005e38]/15 p-7 rounded-3xl shadow-xl flex flex-col gap-4 hover:shadow-2xl hover:border-[#005e38]/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-colors group-hover:scale-105"
                style={{ backgroundColor: '#e8f5ee', color: '#005e38' }}>
                <ScanLine size={28} />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight" style={{ color: '#005e38' }}>
                  {t('landing.activities.group1_title')}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  {t('landing.activities.group1_subtitle')}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('landing.activities.group1_desc')}
            </p>
          </div>

          {/* Group 2: Community Network */}
          <div className="bg-white border border-[#c98d26]/20 p-7 rounded-3xl shadow-xl flex flex-col gap-4 hover:shadow-2xl hover:border-[#c98d26]/50 hover:-translate-y-1 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-colors group-hover:scale-105"
                style={{ backgroundColor: '#fef3e0', color: '#c98d26' }}>
                <Users size={28} />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight" style={{ color: '#c98d26' }}>
                  {t('landing.activities.group2_title')}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  {t('landing.activities.group2_subtitle')}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('landing.activities.group2_desc')}
            </p>
          </div>

          {/* Group 3: Media & Awareness */}
          <div className="bg-white border border-[#005e38]/15 p-7 rounded-3xl shadow-xl flex flex-col gap-4 hover:shadow-2xl hover:border-[#005e38]/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-colors group-hover:scale-105"
                style={{ backgroundColor: '#e8f5ee', color: '#005e38' }}>
                <Globe size={28} />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight" style={{ color: '#005e38' }}>
                  {t('landing.activities.group3_title')}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  {t('landing.activities.group3_subtitle')}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('landing.activities.group3_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Community Action & Field Report Section ─── */}
      <section className="py-20 bg-white relative overflow-hidden" id="pledge">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl border p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ background: 'linear-gradient(135deg, #003d25 0%, #005e38 60%, #007a48 100%)', borderColor: 'rgba(244,214,104,0.3)' }}>
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold border"
                style={{ backgroundColor: 'rgba(244,214,104,0.15)', color: '#F4D668', borderColor: 'rgba(244,214,104,0.4)' }}>
                <Heart size={14} style={{ fill: '#F4D668' }} />
                <span>{language === 'vi' ? 'Hành Động Cùng VIGIL' : 'Action With VIGIL'}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {t('landing.cta_section.title')}
              </h2>
              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                {t('landing.cta_section.subtitle')}
              </p>
            </div>

            <div className="flex-shrink-0 text-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl min-w-[280px]">
              <div className="text-xl font-bold text-white mb-2">
                {t('landing.cta_section.title')}
              </div>
              <p className="text-xs text-white/70 mb-5">
                {isVi ? 'Định vị GPS & Tải ảnh thực địa' : 'GPS location & field photo upload'}
              </p>

              <Link
                href="/map"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg text-[#005e38]"
                style={{ backgroundColor: '#F4D668' }}
              >
                <MapIcon size={18} />
                <span>{t('landing.cta_section.btn')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Field Photography Gallery ─── */}
      <section className="py-24 bg-[#f9fafb]" id="activities">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold mb-4 border"
              style={{ backgroundColor: '#e8f5ee', color: '#005e38', borderColor: 'rgba(0,94,56,0.3)' }}>
              <Camera size={14} />
              <span>{language === 'vi' ? 'Hình Ảnh Thực Địa 2025 - 2026' : 'Field Expeditions 2025 - 2026'}</span>
            </div>
            <h2 className="text-4xl font-black mb-4" style={{ color: '#005e38' }}>{t('landing.activities.title')}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto" style={{ textWrap: 'balance' } as React.CSSProperties}>
              {t('landing.activities.desc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Expedition Card 1 - Gia Lai */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:border-[#005e38]/40 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#005e38' }}>
                  <span className="w-3 h-3 rounded-full bg-[#005e38]"></span>
                  <span>Gia Lai 2026</span>
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold border"
                  style={{ color: '#005e38', backgroundColor: '#e8f5ee', borderColor: 'rgba(0,94,56,0.3)' }}>
                  K'Bang & Mang Yang
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { src: '/images/gialai_2026/thuc_dia_1.JPG', alt: 'Gia Lai Field 1', label: language === 'vi' ? "Khảo sát hiện trạng rừng K'Bang" : "K'Bang Forest Canopy Survey" },
                  { src: '/images/gialai_2026/thuc_dia_3.JPG', alt: 'Gia Lai Field 3', label: language === 'vi' ? 'Khảo sát điểm mất rừng thực địa' : 'Field Deforestation Inspection' },
                  { src: '/images/gialai_2026/thuc_dia_6.JPG', alt: 'Gia Lai Field 6', label: language === 'vi' ? 'Đối chiếu dữ liệu tại Mang Yang' : 'Mang Yang Field Data Verification' },
                  { src: '/images/gialai_2026/thuc_dia_8.JPG', alt: 'Gia Lai Field 8', label: language === 'vi' ? 'Làm việc cùng kiểm lâm địa phương' : 'Ranger & Field Team Collaboration' },
                 ].map((img, idx, arr) => (
                   <div
                     key={img.alt}
                     className="relative rounded-2xl overflow-hidden group h-44 cursor-pointer"
                     onClick={() => openLightbox(arr.map(i => ({ src: i.src, label: i.label })), idx)}
                   >
                     <img src={img.src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={img.alt} />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#003d25] via-[#005e38]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-end p-3 text-xs text-white font-semibold leading-snug">
                       {img.label}
                     </div>
                     {/* View icon overlay on hover */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
                         <Camera size={18} className="text-white" />
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Expedition Card 2 - Ninh Bình */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:border-[#005e38]/40 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                  <span>Ninh Bình 2025</span>
                </h3>
                <span className="text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full font-bold border border-teal-200">
                  {language === 'vi' ? 'Vườn QG Cúc Phương' : 'Cuc Phuong Nat. Park'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { src: '/images/ninhbinh_2025/nb_1.jpg', alt: 'Ninh Binh Field 1', label: language === 'vi' ? 'Hệ sinh thái rừng đá vôi Cúc Phương' : 'Cuc Phuong Karst Ecosystem' },
                  { src: '/images/ninhbinh_2025/nb_2.jpg', alt: 'Ninh Binh Field 2', label: language === 'vi' ? 'Khảo sát thảm thực vật & độ che phủ' : 'Vegetation & Canopy Cover Audit' },
                  { src: '/images/ninhbinh_2025/nb_3.jpg', alt: 'Ninh Binh Field 3', label: language === 'vi' ? 'Thu thập mẫu đối chứng chỉ số thực vật' : 'Vegetation Index Field Calibration' },
                  { src: '/images/ninhbinh_2025/nb_4.jpg', alt: 'Ninh Binh Field 4', label: language === 'vi' ? 'Đội ngũ nghiên cứu VIGIL tại thực địa' : 'VIGIL Research Team Fieldwork' },
                ].map((img, idx, arr) => (
                  <div
                    key={img.alt}
                    className="relative rounded-2xl overflow-hidden group h-44 cursor-pointer"
                    onClick={() => openLightbox(arr.map(i => ({ src: i.src, label: i.label })), idx)}
                  >
                    <img src={img.src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={img.alt} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-end p-3 text-xs text-white font-semibold leading-snug">
                      {img.label}
                    </div>
                    {/* View icon overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
                        <Camera size={18} className="text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Community Hub Cards ─── */}
      <section className="py-24 bg-white" id="community">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold mb-4 border"
              style={{ backgroundColor: '#e8f5ee', color: '#005e38', borderColor: 'rgba(0,94,56,0.3)' }}>
              <Globe size={14} />
              <span>{language === 'vi' ? 'Kết Nối & Cộng Đồng' : 'Community & Social Hub'}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: '#005e38' }}>
              {language === 'vi' ? 'KẾT NỐI VỚI VIGIL' : 'CONNECT WITH VIGIL'}
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto" style={{ textWrap: 'balance' } as React.CSSProperties}>
              {language === 'vi'
                ? 'Theo dõi các bài viết, chuyến khảo sát thực địa và kết quả nghiên cứu mới nhất của dự án VIGIL.'
                : 'Stay updated on our field expeditions, research findings, and latest news from the VIGIL project.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Facebook Card */}
            <div className="bg-[#f9fafb] p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between hover:border-blue-400/60 hover:shadow-xl transition-all group">
              <div>
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Globe size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">Facebook Fanpage</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {language === 'vi'
                    ? 'Cập nhật tin tức, hình ảnh thực địa và các chiến dịch truyền thông bảo vệ rừng tự nhiên.'
                    : 'Get official news, field photos, and forest protection campaigns.'}
                </p>
              </div>
              <a
                href="https://www.facebook.com/share/18yn8UxqPE/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2 text-sm"
              >
                <span>{language === 'vi' ? 'Ghé thăm Fanpage Facebook' : 'Visit Facebook Page'}</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Email Contact Card */}
            <div className="bg-[#f9fafb] p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-xl transition-all group"
              style={{ '--hover-border': 'rgba(0,94,56,0.4)' } as React.CSSProperties}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,94,56,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '')}>
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:text-white"
                  style={{ backgroundColor: '#e8f5ee', color: '#005e38' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#005e38'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#e8f5ee'; (e.currentTarget as HTMLElement).style.color = '#005e38'; }}>
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">
                  {language === 'vi' ? 'Email Hợp Tác' : 'Collaboration Email'}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-1 font-mono">
                  vigil.greenorg@gmail.com
                </p>
                <p className="text-xs text-slate-400 mb-6">
                  {language === 'vi'
                    ? 'Liên hệ trao đổi chuyên môn, hợp tác dữ liệu viễn thám và đóng góp dự án.'
                    : 'Contact us for academic collaboration and remote sensing data sharing.'}
                </p>
              </div>
              <Link
                href="/contact"
                className="w-full py-3.5 px-5 font-bold rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2 text-sm text-white"
                style={{ backgroundColor: '#005e38' }}
              >
                <span>{language === 'vi' ? 'Đến Trang Liên Hệ' : 'Go to Contact Page'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Publication Card */}
            <div className="bg-[#f9fafb] p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between hover:border-[#c98d26]/50 hover:shadow-xl transition-all group">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:text-slate-900 transition-colors"
                  style={{ backgroundColor: '#fef3e0', color: '#c98d26' }}>
                  <BookOpen size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">
                  {language === 'vi' ? 'Công Bố Khoa Học' : 'Scientific Publications'}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {language === 'vi'
                    ? 'Xem báo cáo phương pháp luận mô hình Random Forest và tập dữ liệu vệ tinh.'
                    : 'Explore Random Forest methodology reports and satellite datasets.'}
                </p>
              </div>
              <Link
                href="/publication"
                className="w-full py-3.5 px-5 font-bold rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2 text-sm text-slate-900"
                style={{ backgroundColor: '#F4D668' }}
              >
                <span>{language === 'vi' ? 'Xem Trang Xuất Bản' : 'View Publication Page'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Lightbox Modal ─── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-2 z-10 transition-colors"
            >
              <XIcon size={22} />
            </button>

            {/* Prev button */}
            {lightbox.all.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3 z-10 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightbox.src}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
            >
              <img
                src={lightbox.src}
                alt={lightbox.label}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-semibold text-sm px-4">{lightbox.label}</p>
                {lightbox.all.length > 1 && (
                  <p className="text-white/50 text-xs mt-1">{lightbox.index + 1} / {lightbox.all.length}</p>
                )}
              </div>
            </motion.div>

            {/* Next button */}
            {lightbox.all.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3 z-10 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

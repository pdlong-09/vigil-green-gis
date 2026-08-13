"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.2 } },
  viewport: { once: true, margin: "-100px" }
};

// Unified brand colors
const GREEN = '#005e38';
const AMBER = '#c98d26';
const YELLOW = '#F4D668';

export default function AboutPage() {
  const { t, language } = useLanguage();

  const trips = [
    {
      key: 'trip_1',
      image: '/images/gialai_2026/thuc_dia_8.JPG',
      reverse: false,
    },
    {
      key: 'trip_2',
      image: '/images/vigil_map_preview.png',
      reverse: true,
    },
    {
      key: 'trip_3',
      image: '/images/gialai_2026/thuc_dia_6.JPG',
      reverse: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ─── Hero — Full-bleed forest background ─── */}
      <section className="relative w-full h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/about_forest_bg.png')" }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,20,10,0.45) 0%, rgba(0,50,25,0.50) 40%, rgba(0,30,15,0.88) 90%, rgba(0,10,5,0.98) 100%)'
        }} />
        {/* Golden light ray */}
        <div className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(244,214,104,0.35) 0%, transparent 70%)` }} />

        <motion.div className="relative z-10 text-center px-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          {/* Badge VIGIL với logo nổi bật phóng to */}
          <div className="inline-flex items-center mb-5 px-4 py-2 rounded-2xl border shadow-lg backdrop-blur-md transition-all hover:scale-105"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(244,214,104,0.6)', boxShadow: '0 0 20px rgba(244,214,104,0.35)' }}>
            <img src="/images/logo_cropped.png" alt="VIGIL Logo" className="h-8 md:h-10 w-auto object-contain drop-shadow-sm" />
          </div>
          {/* FIX: extrabold + tracking-normal + leading-snug for Vietnamese */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-5 drop-shadow-2xl leading-snug tracking-normal">
            {t('about.hero_title')}
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: YELLOW }} />
        </motion.div>
      </section>

      {/* ─── Brand Story ─── */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <motion.div className="max-w-5xl mx-auto"
          variants={staggerContainer} initial="initial" whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}>

          <motion.div variants={fadeInUp} className="text-center mb-14">
            {/* Section label — unified style */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold mb-4 border"
              style={{ backgroundColor: '#e8f5ee', color: GREEN, borderColor: 'rgba(0,94,56,0.3)' }}>
              {language === 'vi' ? '📖 Câu Chuyện Thương Hiệu' : '📖 Brand Story'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: GREEN }}>
              {t('about.brand_story_title')}
            </h2>
            <p className="text-base md:text-lg font-medium" style={{ color: AMBER }}>
              {t('about.brand_story_subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
            <motion.div variants={fadeInUp} className="space-y-5 text-gray-600 text-base md:text-lg leading-relaxed">
              <p>{t('about.brand_story_p1')}</p>
              <p>{t('about.brand_story_p2')}</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-5 text-gray-600 text-base md:text-lg leading-relaxed">
              <p>{t('about.brand_story_p3')}</p>
            </motion.div>
          </div>

          {/* ─── Vision & Mission Section (Feedback 02) ─── */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            {/* Vision */}
            <div className="bg-[#e8f5ee]/60 border border-[#005e38]/20 p-8 rounded-3xl shadow-md relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4"
                style={{ backgroundColor: GREEN, color: '#white' }}>
                👁️
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: GREEN }}>
                {t('about.vision_title')}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {t('about.vision_desc')}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-[#fef3e0]/70 border border-[#c98d26]/30 p-8 rounded-3xl shadow-md relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4"
                style={{ backgroundColor: AMBER, color: 'white' }}>
                🚀
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: AMBER }}>
                {t('about.mission_title')}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {t('about.mission_desc')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="mx-auto w-24 h-1 rounded-full" style={{ backgroundColor: YELLOW }} />

      {/* ─── Field Trips — unified bg + colors ─── */}
      <section className="py-20 px-4 md:px-8 bg-[#f9fafb]">
        <motion.div className="max-w-6xl mx-auto"
          variants={staggerContainer} initial="initial" whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}>

          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold mb-4 border"
              style={{ backgroundColor: '#e8f5ee', color: GREEN, borderColor: 'rgba(0,94,56,0.3)' }}>
              🌿 {language === 'vi' ? 'Thực Địa & Nghiên Cứu' : 'Fieldwork & Research'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: GREEN }}>
              {t('about.activities_title')}
            </h2>
          </motion.div>

          <div className="space-y-20">
            {trips.map(({ key, image, reverse }) => {
              const displayImg = key === 'trip_1' ? '/images/IMG_1431 (edited).jpg' : image;
              return (
                <motion.div key={key} variants={fadeInUp}
                  className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center`}>
                  {/* Image */}
                  <div className="w-full md:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-xl aspect-video relative border bg-gray-100"
                      style={{ borderColor: 'rgba(0,94,56,0.15)' }}>
                      <img
                        src={displayImg}
                        alt={t(`about.${key}_title`)}
                        onError={(e) => {
                          // Fallback to existing image if IMG_1431 (edited).jpg is not found
                          (e.currentTarget as HTMLImageElement).src = image;
                        }}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="w-full md:w-1/2 space-y-4">
                    {/* Yellow accent bar + title — unified */}
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: YELLOW }} />
                      <h3 className="text-2xl font-bold" style={{ color: GREEN }}>
                        {t(`about.${key}_title`)}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                      {t(`about.${key}_desc`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

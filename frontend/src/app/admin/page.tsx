"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import AdminDashboard from '@/components/AdminDashboard';
import { Shield, Lock, User as UserIcon, LogOut, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, token, login, logout } = useAuth();
  const { language } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      if (res.ok) {
        const data = await res.json();
        login(data.access_token, data.user);
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Tên đăng nhập hoặc mật khẩu không đúng.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Không thể kết nối tới máy chủ backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('Admin@123');
  };

  // Logged in as Admin
  if (user && user.role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-24 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          
          {/* Top Admin Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 shadow-2xl gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {language === 'vi' ? 'CỔNG QUẢN TRỊ VIÊN VIGIL' : 'VIGIL ADMIN PORTAL'}
                </h1>
                <p className="text-xs text-slate-400">
                  {language === 'vi' ? `Xin chào, ${user.username} (Quyền Quản Trị)` : `Welcome, ${user.username} (Administrator)`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/map"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-all"
              >
                {language === 'vi' ? 'Về Bản Đồ Map' : 'Go to Map'}
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 rounded-xl text-sm font-bold transition-all"
              >
                <LogOut size={16} />
                <span>{language === 'vi' ? 'Đăng Xuất' : 'Logout'}</span>
              </button>
            </div>
          </div>

          {/* Admin Dashboard Component */}
          <AdminDashboard 
            onViewOnMap={(lat, lon) => {
              window.location.href = `/map?lat=${lat}&lon=${lon}`;
            }} 
            language={language}
          />
        </div>
      </div>
    );
  }

  // Not Logged in or Not Admin -> Show Admin Login Screen
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            {language === 'vi' ? 'CỔNG QUẢN TRỊ ADMIN' : 'VIGIL ADMIN PORTAL'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi' 
              ? 'Đăng nhập tài khoản Quản trị để xem báo cáo thực địa và ý kiến phản hồi.'
              : 'Sign in to manage field reports and user feedback.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/80 border border-red-800 text-red-300 p-4 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-300 mb-2">
              {language === 'vi' ? 'Tên đăng nhập' : 'Username'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-300 mb-2">
              {language === 'vi' ? 'Mật khẩu' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
          >
            <span>{loading ? 'Đang xử lý...' : (language === 'vi' ? 'Đăng Nhập Quản Trị' : 'Sign In as Admin')}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Fill Preset Hint */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <button
            onClick={handleQuickFill}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40 transition-colors"
          >
            <Sparkles size={14} />
            <span>{language === 'vi' ? 'Điền nhanh tài khoản Admin mẫu' : 'Auto-fill default Admin account'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

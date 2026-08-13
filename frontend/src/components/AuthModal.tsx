"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

export default function AuthModal({ onClose, language = 'vi' }: { onClose: () => void, language?: 'vi' | 'en' }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    vi: {
      loginTitle: "Đăng nhập",
      registerTitle: "Đăng ký",
      userLabel: "Tên đăng nhập (*)",
      passLabel: "Mật khẩu (*)",
      emailLabel: "Email (*)",
      fullNameLabel: "Họ và tên",
      orgLabel: "Đơn vị công tác",
      submitLogin: "Đăng nhập",
      submitRegister: "Đăng ký tài khoản",
      switchReg: "Chưa có tài khoản? Đăng ký ngay",
      switchLog: "Đã có tài khoản? Đăng nhập",
      loading: "Đang xử lý...",
      errRequired: "Vui lòng nhập đủ các trường bắt buộc (*)",
    },
    en: {
      loginTitle: "Login",
      registerTitle: "Register",
      userLabel: "Username (*)",
      passLabel: "Password (*)",
      emailLabel: "Email (*)",
      fullNameLabel: "Full Name",
      orgLabel: "Organization",
      submitLogin: "Sign In",
      submitRegister: "Sign Up",
      switchReg: "No account? Register here",
      switchLog: "Already have an account? Login",
      loading: "Processing...",
      errRequired: "Please fill all required fields (*)",
    }
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password || (!isLogin && !email)) {
      setError(t.errRequired);
      return;
    }
    
    if (!isLogin && !email.includes('@')) {
      setError(language === 'vi' ? 'Email không hợp lệ' : 'Invalid email');
      return;
    }
    
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
      if (isLogin) {
        // Login requires form data (OAuth2PasswordRequestForm)
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const res = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Login failed');
        
        login(data.access_token, data.user);
        onClose();
      } else {
        // Register requires JSON
        const res = await fetch(`${apiUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username, 
            password, 
            email, 
            full_name: fullName || null, 
            organization: organization || null 
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Registration failed');
        
        // Auto login after register
        setIsLogin(true);
        setError(language === 'vi' ? 'Đăng ký thành công! Đang tự động...' : 'Success! Logging in...');
        
        const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ username, password }).toString()
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          login(loginData.access_token, loginData.user);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{isLogin ? t.loginTitle : t.registerTitle}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">{t.userLabel}</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          
          {!isLogin && (
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">{t.emailLabel}</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          )}

          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">{t.fullNameLabel}</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">{t.orgLabel}</label>
                <input 
                  type="text" 
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">{t.passLabel}</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50"
          >
            {isLoading ? t.loading : (isLogin ? t.submitLogin : t.submitRegister)}
          </button>
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs text-green-400 hover:underline"
            >
              {isLogin ? t.switchReg : t.switchLog}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

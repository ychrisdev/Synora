"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L14 5.5V12.5L9 16L4 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" fill="none" />
              <circle cx="9" cy="9" r="2" fill="white" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Synora</h1>
          <p className="text-sm text-text-secondary mt-1">Nền tảng học tập cộng đồng</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-1">Đăng nhập</h2>
          <p className="text-sm text-text-secondary mb-5">Chào mừng bạn trở lại!</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" className="accent-primary" /> Ghi nhớ đăng nhập
              </label>
              <button className="text-sm text-primary hover:underline">Quên mật khẩu?</button>
            </div>
            <Link
              href="/main/feed"
              className="block w-full text-center py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>

          <p className="text-center text-sm text-text-secondary mt-4">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

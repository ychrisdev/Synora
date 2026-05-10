"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <h2 className="text-lg font-bold text-text-primary mb-1">Tạo tài khoản</h2>
          <p className="text-sm text-text-secondary mb-5">Bắt đầu hành trình học tập của bạn</p>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Họ</label>
                <input type="text" placeholder="Nguyễn" className="w-full px-4 py-2.5 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Tên</label>
                <input type="text" placeholder="Văn An" className="w-full px-4 py-2.5 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <input type="email" placeholder="email@example.com" className="w-full px-4 py-2.5 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Mật khẩu</label>
              <input type="password" placeholder="Ít nhất 8 ký tự" className="w-full px-4 py-2.5 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Vai trò</label>
              <select className="w-full px-4 py-2.5 border border-surface-200 rounded-lg text-sm focus:outline-none focus:border-primary bg-white">
                <option>Học sinh</option>
                <option>Sinh viên</option>
                <option>Giáo viên</option>
              </select>
            </div>
            <Link
              href="/main/feed"
              className="block w-full text-center py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Tạo tài khoản
            </Link>
          </div>

          <p className="text-center text-sm text-text-secondary mt-4">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

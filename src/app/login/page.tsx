"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "#e8eaf6" }}
    >
      <div className="flex w-full max-w-[960px] rounded-2xl overflow-hidden shadow-2xl">

        {/* ── Left: form panel ─────────────────────────────────────────────── */}
        <div className="w-[45%] bg-white relative flex flex-col min-h-[580px]">

          {/* Form content */}
          <div className="flex flex-col flex-1 justify-center px-12 py-10">
            <h1 className="text-[26px] font-bold text-slate-800 mb-2 leading-tight">
              Welcome to{" "}
              <span style={{ color: "#884D70" }}>EXIM</span>
            </h1>
            <p className="text-[13px] text-slate-500 mb-8 leading-relaxed max-w-[280px]">
              Manage your export-import operations, purchase orders, and shipments with complete visibility into your pipeline.
            </p>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="off"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#884D70] focus:ring-2 focus:ring-[#884D70]/10 transition-all"
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#884D70] focus:ring-2 focus:ring-[#884D70]/10 transition-all"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#884D70] transition-colors"
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex justify-end -mt-1">
                <Link href="#" className="text-[12px] text-slate-400 hover:text-[#884D70] transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white text-[14px] font-semibold active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
                style={{ background: "#884D70" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in…
                  </>
                ) : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"/>
              </div>
              <span className="relative bg-white px-3 text-[11px] text-slate-400">or</span>
            </div>

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-3 border border-slate-200 py-2.5 rounded-lg text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <svg width="17" height="17" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          {/* Footer */}
          <div className="text-center py-5 text-[11px] text-slate-400">
            Designed &amp; Developed by{" "}
            <span className="font-semibold" style={{ color: "#884D70" }}>TechieBears Pvt Ltd</span>
          </div>
        </div>

        {/* ── Right: brand / testimonial panel ─────────────────────────────── */}
        <div
          className="w-[55%] relative overflow-hidden flex flex-col items-center justify-center p-12"
          style={{ background: "linear-gradient(135deg, #884D70 0%, #6B3A5A 55%, #3d1b28 100%)" }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "36px 36px" }}
          />
          {/* Glow blobs */}
          <div className="absolute top-1/4 -right-24 w-64 h-64 rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(255,219,203,0.25)" }} />
          <div className="absolute bottom-1/4 -left-24 w-80 h-80 rounded-full blur-[140px] pointer-events-none" style={{ background: "rgba(136,77,112,0.40)" }} />

          {/* Glass testimonial card */}
          <div
            className="rounded-2xl p-10 w-full max-w-[420px] relative z-10 shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.10)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.20)",
            }}
          >
            <div className="flex items-center gap-3 mb-8 text-white">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.20)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7h18M3 12h12M3 17h8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[18px] font-bold tracking-tight">EXIM Dashboard</span>
            </div>

            <blockquote className="mb-8">
              <p className="text-white text-xl leading-relaxed italic font-light">
                "EXIM Dashboard gives our team a{" "}
                <span className="font-bold not-italic" style={{ color: "rgba(255,219,203,0.95)" }}>
                  single source of truth
                </span>{" "}
                for purchase orders, shipments, and vendor management — all in one place."
              </p>
            </blockquote>

            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[15px] font-bold flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.35)" }}
              >
                RK
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">Rajesh Kumar</div>
                <div className="text-[12px] font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Head of Supply Chain Operations
                </div>
              </div>
            </div>
          </div>

          {/* Need help */}
          <div className="absolute bottom-8 right-8">
            <button
              className="backdrop-blur-md text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-[13px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Need help?
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}

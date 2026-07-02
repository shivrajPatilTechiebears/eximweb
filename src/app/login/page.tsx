"use client";

import { useState } from "react";
import Link from "next/link";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";

const GLASS_INPUT = "w-full px-4 py-3 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all";
const GLASS_STYLE = { background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.75)", backdropFilter: "blur(8px)" };

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-0 sm:p-4 md:p-8">

      <div className="flex flex-col md:flex-row w-full md:max-w-[960px] md:rounded-2xl overflow-hidden shadow-none md:shadow-2xl min-h-screen md:min-h-0">

        {/* ── Left: glass form panel ───────────────────────────────────────── */}
        <div
          className="w-full md:w-[45%] flex flex-col flex-1 md:flex-none"
          style={{
            background: "rgba(255,255,255,0.38)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            borderRight: "1px solid rgba(255,255,255,0.50)",
          }}
        >
          {/* Form area */}
          <div className="flex flex-col flex-1 justify-center px-6 py-10 sm:px-8 md:px-10 md:py-12 max-w-md mx-auto w-full md:max-w-none md:mx-0">

            {/* Logo — visible on mobile only */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #884D70, #6B3A5A)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7h18M3 12h12M3 17h8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[18px] font-bold text-slate-800">EXIM</span>
            </div>

            <h1 className="text-[22px] sm:text-[26px] font-bold text-slate-800 mb-2 leading-tight">
              Welcome to <span style={{ color: "#884D70" }}>EXIM</span>
            </h1>
            <p className="text-[13px] text-slate-700 mb-6 md:mb-8 leading-relaxed">
              Manage your export-import operations, purchase orders, and shipments with complete visibility into your pipeline.
            </p>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">

              {/* Email */}
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Email"
                autoComplete="off"
                inputClassName={GLASS_INPUT}
                inputStyle={GLASS_STYLE}
              />

              {/* Password */}
              <div>
                <label className="block text-[9px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="new-password"
                    className={`${GLASS_INPUT} pr-11`}
                    style={GLASS_STYLE}
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
                <div className="flex justify-end mt-1.5">
                  <Link href="#" className="text-[11px] text-slate-600 hover:text-[#884D70] transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Sign in */}
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full h-auto py-3 text-[14px] justify-center rounded-lg shadow-md"
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
              </Button>

              {/* OR divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.12)" }} />
                <span className="text-[11px] font-medium text-slate-400">or</span>
                <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.12)" }} />
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-700 hover:bg-white/60 transition-colors"
                style={{ background: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.75)" }}
              >
                <svg width="17" height="17" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                  <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                  <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
                </svg>
                Sign up with Google
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center py-4 text-[11px] text-slate-600 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            Designed &amp; Developed by{" "}
            <span className="font-semibold" style={{ color: "#884D70" }}>TechieBears Pvt Ltd</span>
          </div>
        </div>

        {/* ── Right: brand / testimonial panel — hidden on mobile ───────────── */}
        <div
          className="hidden md:flex md:w-[55%] relative overflow-hidden flex-col items-center justify-center p-8 lg:p-12"
          style={{
            background: "linear-gradient(135deg, rgba(136,77,112,0.88) 0%, rgba(107,58,90,0.84) 50%, rgba(61,27,40,0.92) 100%)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 30% 20%, rgba(255,200,220,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(61,27,40,0.50) 0%, transparent 60%)"
          }} />
          <div
            className="absolute inset-0 opacity-[0.09] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] opacity-30 pointer-events-none" style={{ background: "rgba(255,180,200,0.6)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[120px] opacity-25 pointer-events-none" style={{ background: "rgba(80,20,50,0.8)", transform: "translate(-30%, 30%)" }} />

          <div
            className="rounded-2xl p-6 lg:p-7 w-full max-w-[320px] lg:max-w-[340px] relative z-10"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-5 text-white">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.20)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7h18M3 12h12M3 17h8" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[15px] font-bold tracking-tight">EXIM Dashboard</span>
            </div>

            <blockquote className="mb-5">
              <p className="text-white text-[14px] lg:text-[15px] leading-relaxed italic font-light">
                "EXIM Dashboard gives our team a{" "}
                <span className="font-bold not-italic" style={{ color: "rgba(255,219,203,0.95)" }}>
                  single source of truth
                </span>{" "}
                for purchase orders, shipments, and vendor management — all in one place."
              </p>
            </blockquote>

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.35)" }}
              >
                RK
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">Rajesh Kumar</div>
                <div className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Head of Supply Chain Operations
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

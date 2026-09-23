import React, { useState } from 'react';
import { UserRole } from '../types';
import { sound } from '../utils/sound';

interface WelcomeScreenProps {
  onLoginSuccess: (role: UserRole, identifier: string) => void;
  initialRole?: UserRole;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginSuccess,
  initialRole = 'hire',
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [inputValue, setInputValue] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['4', '8', '2', '9']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Background and logo assets served locally
  const BG_IMAGE_URL = '/bg-crowd.jpg';
  const LOGO_IMAGE_URL = '/logo.png';

  const digitsOnly = inputValue.replace(/\D/g, '');
  const isValid =
    digitsOnly.length === 10 || (inputValue.includes('@') && inputValue.includes('.'));

  const handleRoleToggle = (selectedRole: UserRole) => {
    sound.playPop();
    setRole(selectedRole);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playPop();

    if (!inputValue.trim()) {
      // Default to standard demo phone if left empty
      setInputValue('9820144892');
    }
    setShowOtpModal(true);
  };

  const handleVerifyOtp = () => {
    setIsSubmitting(true);
    sound.playSuccess();
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOtpModal(false);
      onLoginSuccess(role, inputValue || '9820144892');
    }, 600);
  };

  const handleFastSSO = (provider: 'google' | 'digilocker') => {
    sound.playSuccess();
    onLoginSuccess(role, provider === 'google' ? 'organizer@eventmate.com' : 'DIGILOCKER_AADHAAR_9041');
  };

  return (
    <div className="bg-stone-900 text-[#1b1c1c] min-h-screen relative flex items-center justify-center p-4 sm:p-6 selection:bg-[#58CC02]/20 overflow-x-hidden">
      {/* Background with Authentic Indian Event Production Crowd & Ambient Warm Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img
          alt="Vibrant music festival crowd"
          className="ken-burns-bg w-full h-full object-cover object-center scale-105 filter brightness-[0.88] saturate-[1.12]"
          src={BG_IMAGE_URL}
        />
        {/* Dark radial ambient overlay for readability */}
        <div className="absolute inset-0 bg-black/40 bg-radial-[at_center] from-black/20 via-black/45 to-black/70"></div>
        <div className="absolute inset-0 backdrop-blur-[1.5px]"></div>

        {/* Ambient Floating Confetti Particles */}
        <div
          className="particle w-2.5 h-2.5 bg-[#58CC02]/70 left-[10%] bottom-8"
          style={{ animationDuration: '9s', animationDelay: '0s' }}
        ></div>
        <div
          className="particle w-2 h-2 bg-[#FFC800]/80 left-[22%] bottom-16 rounded-sm"
          style={{ animationDuration: '11s', animationDelay: '2.5s' }}
        ></div>
        <div
          className="particle w-3 h-3 bg-[#1CB0F6]/75 left-[82%] bottom-12"
          style={{ animationDuration: '10s', animationDelay: '1.2s' }}
        ></div>
        <div
          className="particle w-2 h-2 bg-[#FF4B4B]/70 left-[75%] bottom-20 rounded-sm"
          style={{ animationDuration: '12.5s', animationDelay: '4.2s' }}
        ></div>
        <div
          className="particle w-2.5 h-2.5 bg-[#87FE45]/80 left-[15%] bottom-32"
          style={{ animationDuration: '8.5s', animationDelay: '5.5s' }}
        ></div>
        <div
          className="particle w-1.5 h-1.5 bg-[#FFDF92]/90 left-[88%] bottom-4"
          style={{ animationDuration: '7.8s', animationDelay: '3s' }}
        ></div>
        <div
          className="particle w-3 h-3 bg-[#58CC02]/60 left-[48%] bottom-2"
          style={{ animationDuration: '13s', animationDelay: '6s' }}
        ></div>
      </div>

      {/* Main Centered Login Container */}
      <div className="relative z-10 w-full max-w-[450px] my-auto">
        {/* Floating Centered Modal Card with Spring Entrance */}
        <div className="animate-card-spring bg-white rounded-[28px] border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 sm:p-8 relative backdrop-filter">
          
          {/* Top Brand Logo */}
          <div className="reveal-item delay-1 flex flex-col items-center justify-center mb-5">
            <div className="flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-105">
              <img
                src={LOGO_IMAGE_URL}
                alt="EventMate Logo"
                className="h-10 sm:h-11 object-contain drop-shadow-sm"
                onError={(e) => {
                  // Fallback in case of external image access restriction
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Welcoming Heading & Subtitle */}
            <h1 className="text-2xl sm:text-[26px] font-black text-[#1b1c1c] tracking-tight text-center leading-snug">
              Welcome to EventMate!{' '}
              <span className="animate-party-popper inline-block" title="Celebration!">
                🎉
              </span>
            </h1>
            <p className="text-xs sm:text-[13px] font-semibold text-[#57534E] mt-1 text-center">
              India's #1 on-demand event crew &amp; reputation platform
            </p>
          </div>

          {/* Segmented Toggle: Hire Crew vs Find Work with Smooth Sliding Pill Indicator */}
          <div
            className="reveal-item delay-2 relative bg-[#F4F4F5] p-1.5 rounded-2xl flex items-center mb-5 border border-zinc-200/80 select-none overflow-hidden"
            id="role-toggle-container"
          >
            {/* Animated Sliding Pill Indicator */}
            <div
              className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] pointer-events-none ${
                role === 'hire'
                  ? 'translate-x-0 border-[#58CC02]/30 ring-1 ring-[#58CC02]/20'
                  : 'translate-x-full border-amber-500/40 ring-1 ring-amber-500/20'
              }`}
            />

            <button
              id="btn-hire"
              type="button"
              onClick={() => handleRoleToggle('hire')}
              className={`relative z-10 flex-1 py-2.5 px-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-colors duration-200 ${
                role === 'hire' ? 'text-[#1b1c1c]' : 'text-[#71717A] hover:text-[#1b1c1c]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[19px] transition-transform duration-200 ${
                  role === 'hire' ? 'text-[#58CC02] scale-105' : 'text-zinc-400'
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                groups
              </span>
              <span>Hire Crew</span>
            </button>

            <button
              id="btn-work"
              type="button"
              onClick={() => handleRoleToggle('work')}
              className={`relative z-10 flex-1 py-2.5 px-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-colors duration-200 ${
                role === 'work' ? 'text-[#1b1c1c]' : 'text-[#71717A] hover:text-[#1b1c1c]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[19px] transition-transform duration-200 ${
                  role === 'work' ? 'text-amber-500 scale-105' : 'text-zinc-400'
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>Find Work</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleContinue}>
            {/* Input Field with Enhanced Focus Ring & Responsive Micro-Interactions */}
            <div className="reveal-item delay-3 mb-4 group/input">
              <label
                htmlFor="login-input"
                className="block text-[11px] font-extrabold uppercase tracking-wider text-[#52525B] mb-2 px-1 transition-colors group-focus-within/input:text-[#2b6c00]"
              >
                Mobile Number or Email
              </label>

              <div
                className="relative flex items-center transition-all duration-200 rounded-2xl focus-within:ring-4 focus-within:ring-[#58CC02]/20 focus-within:shadow-[0_0_16px_rgba(88,204,2,0.18)]"
                id="input-wrapper"
              >
                <div
                  className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[#3F3F46] font-bold text-sm select-none transition-transform duration-200 group-focus-within/input:scale-105"
                  id="flag-badge"
                >
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="font-extrabold text-xs tracking-tight text-zinc-600">+91</span>
                  <span className="w-px h-4 bg-zinc-300 ml-1"></span>
                </div>

                <input
                  id="login-input"
                  type="text"
                  autoComplete="tel"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="w-full h-12 pl-20 pr-10 bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-300 focus:border-[#58CC02] focus:bg-white text-[#1b1c1c] font-bold text-[15px] rounded-2xl outline-none transition-all duration-200 placeholder:text-zinc-400 placeholder:font-medium"
                />

                {isValid && (
                  <span
                    id="input-check"
                    className="absolute right-3.5 material-symbols-outlined text-[#58CC02] text-xl font-bold transition-transform duration-200 scale-100"
                  >
                    check_circle
                  </span>
                )}
              </div>
            </div>

            {/* Primary Action Button: Signature tactile 3D Duolingo-style button */}
            <div className="reveal-item delay-4">
              <button
                id="btn-continue"
                type="submit"
                className="tactile-btn w-full h-12 bg-[#58CC02] hover:bg-[#52be02] text-white font-black text-sm sm:text-base rounded-2xl border-b-4 border-[#46A302] shadow-[0_4px_0_#46A302] flex items-center justify-center gap-2 uppercase tracking-wider mb-4 cursor-pointer select-none"
              >
                <span>CONTINUE →</span>
              </button>
            </div>
          </form>

          {/* Friendly Divider */}
          <div className="reveal-item delay-5 relative flex items-center justify-center my-4">
            <div className="border-t border-zinc-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              or
            </span>
            <div className="border-t border-zinc-200 w-full"></div>
          </div>

          {/* Alternative SSO Options: Google & DigiLocker */}
          <div className="reveal-item delay-6 grid grid-cols-2 gap-3 mb-5">
            <button
              id="btn-sso-google"
              type="button"
              onClick={() => handleFastSSO('google')}
              className="tactile-btn-secondary h-11 px-3 bg-white hover:bg-zinc-50 text-zinc-800 font-extrabold text-xs rounded-2xl border-2 border-zinc-200 border-b-4 border-b-zinc-300 flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  d="M12 5c1.5 0 2.8.5 3.9 1.4l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.6 2.8C6.4 7.1 8.9 5 12 5z"
                  fill="#EA4335"
                />
                <path
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.6 2.8c2.1-2 3.8-5 3.8-8.8z"
                  fill="#4285F4"
                />
                <path
                  d="M5.5 14.9c-.2-.7-.4-1.5-.4-2.9 0-1.4.2-2.2.4-2.9L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.6-2.8z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 23c3.2 0 6-1.1 8-3l-3.6-2.8c-1.1.7-2.5 1.2-4.4 1.2-3.1 0-5.6-2.1-6.5-5.1L1.9 16.1C3.7 19.8 7.5 23 12 23z"
                  fill="#34A853"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              id="btn-sso-digilocker"
              type="button"
              onClick={() => handleFastSSO('digilocker')}
              className="tactile-btn-secondary h-11 px-3 bg-white hover:bg-zinc-50 text-zinc-800 font-extrabold text-xs rounded-2xl border-2 border-zinc-200 border-b-4 border-b-zinc-300 flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-[#0284c7] text-[18px]">
                verified
              </span>
              <span>DigiLocker ID</span>
            </button>
          </div>

          {/* Mini Guarantee Strip with interactive subtle micro-lift */}
          <div className="reveal-item delay-7 pt-3 border-t border-zinc-100 flex items-center justify-between text-center gap-1 mb-2">
            <div className="flex-1 flex flex-col items-center group cursor-default transition-transform duration-200 hover:-translate-y-0.5">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#58CC02] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
              </div>
              <span className="text-[10.5px] font-extrabold text-zinc-800 leading-tight">
                100% Verified
              </span>
              <span className="text-[9.5px] font-medium text-zinc-400">Crew Background</span>
            </div>

            <div className="w-px h-6 bg-zinc-200"></div>

            <div className="flex-1 flex flex-col items-center group cursor-default transition-transform duration-200 hover:-translate-y-0.5">
              <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[15px]">shield_with_heart</span>
              </div>
              <span className="text-[10.5px] font-extrabold text-zinc-800 leading-tight">
                Protected
              </span>
              <span className="text-[9.5px] font-medium text-zinc-400">Escrow Payouts</span>
            </div>

            <div className="w-px h-6 bg-zinc-200"></div>

            <div className="flex-1 flex flex-col items-center group cursor-default transition-transform duration-200 hover:-translate-y-0.5">
              <div className="w-7 h-7 rounded-full bg-sky-50 text-[#1CB0F6] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
              </div>
              <span className="text-[10.5px] font-extrabold text-zinc-800 leading-tight">
                Instant
              </span>
              <span className="text-[9.5px] font-medium text-zinc-400">Geo Attendance</span>
            </div>
          </div>

          {/* Trust Badge Inside Card Footer */}
          <div className="reveal-item delay-7 mt-3.5 pt-3 border-t border-zinc-100 text-center">
            <p className="text-[11px] font-bold text-zinc-600 tracking-tight flex items-center justify-center gap-1 transition-colors hover:text-zinc-800">
              <span>🔒 100% Aadhaar &amp; DigiLocker Verified Crew • Instant Escrow Protection</span>
            </p>
          </div>
        </div>

        {/* Bottom Terms & Policy Note */}
        <div className="reveal-item delay-7 text-center mt-3.5">
          <p className="text-xs font-semibold text-white/90 drop-shadow-sm">
            By continuing, you agree to EventFlex's{' '}
            <button
              onClick={() => alert("EventFlex guarantees 100% Escrow security and Aadhaar KYC verification.")}
              className="underline text-white font-bold hover:text-[#87fe45] transition-colors cursor-pointer"
            >
              Terms
            </button>{' '}
            &amp;{' '}
            <button
              onClick={() => alert("EventMate protects your data and Aadhaar credentials via certified DigiLocker integration.")}
              className="underline text-white font-bold hover:text-[#87fe45] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Interactive OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border-2 border-zinc-200 border-b-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-[#58CC02] flex items-center justify-center font-bold">
                  🔒
                </span>
                <h3 className="text-lg font-black text-zinc-900">Enter OTP Code</h3>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-zinc-400 hover:text-zinc-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600 font-medium mb-4">
              We sent a 4-digit verification code to{' '}
              <span className="font-bold text-zinc-900">
                +91 {inputValue || '98201 44892'}
              </span>
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-12 h-14 text-center font-black text-2xl text-zinc-900 bg-zinc-50 border-2 border-zinc-300 focus:border-[#58CC02] focus:bg-white rounded-xl outline-none"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isSubmitting}
              className="tactile-btn w-full h-12 bg-[#58CC02] hover:bg-[#52be02] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#46A302] shadow-[0_4px_0_#46A302] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-lg">⏳</span> Verifying...
                </span>
              ) : (
                <span>VERIFY &amp; ENTER EVENTMATE 🚀</span>
              )}
            </button>

            <p className="text-center text-[11px] text-zinc-400 font-semibold mt-3">
              Didn't receive code? <button onClick={() => alert("New OTP sent: 4829")} className="text-[#58CC02] font-bold underline">Resend OTP</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

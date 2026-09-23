import React from 'react';
import { UserRole } from '../types';
import { sound } from '../utils/sound';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenWelcome: () => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  walletBalance: number;
  onOpenWallet: () => void;
  userIdentifier: string;
  onOpenAntigravity: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenWelcome,
  selectedCity,
  onCityChange,
  walletBalance,
  onOpenWallet,
  userIdentifier,
  onOpenAntigravity,
}) => {
  const LOGO_IMAGE_URL = '/logo.png';

  const cities = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune', 'Goa', 'Udaipur', 'Hyderabad'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWelcome}
            className="flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer text-left"
            title="Return to Welcome Screen"
          >
            <img
              src={LOGO_IMAGE_URL}
              alt="EventMate Logo"
              className="h-8 sm:h-9 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tight text-[#1b1c1c] flex items-center gap-1">
                Event<span className="text-[#58CC02]">Mate</span>
                <span className="text-xs bg-[#58CC02]/15 text-[#2b6c00] font-black px-1.5 py-0.5 rounded-md border border-[#58CC02]/30">
                  LIVE
                </span>
              </span>
              <p className="text-[10px] font-bold text-zinc-500 -mt-1">
                India's #1 Event Crew Platform
              </p>
            </div>
          </button>

          {/* City Selector */}
          <div className="hidden md:flex items-center bg-zinc-100 rounded-xl px-2.5 py-1.5 border border-zinc-200 text-xs font-extrabold text-zinc-700">
            <span className="material-symbols-outlined text-base text-[#58CC02] mr-1">
              location_on
            </span>
            <select
              value={selectedCity}
              onChange={(e) => {
                sound.playPop();
                onCityChange(e.target.value);
              }}
              className="bg-transparent outline-none cursor-pointer pr-1 font-black text-zinc-800"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center Role Switcher (Tactile Tab Control) */}
        <div className="flex items-center bg-zinc-100 p-1 rounded-2xl border-2 border-zinc-200 shadow-inner">
          <button
            onClick={() => {
              sound.playPop();
              onRoleChange('work');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              currentRole === 'work'
                ? 'bg-[#58CC02] text-white shadow-sm border-b-2 border-[#46A302]'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span>Find Work</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onRoleChange('hire');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              currentRole === 'hire'
                ? 'bg-[#1CB0F6] text-white shadow-sm border-b-2 border-[#1899D6]'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              groups
            </span>
            <span>Hire Crew</span>
          </button>
        </div>

        {/* Right Actions: Antigravity Agent, Escrow Wallet & User Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Antigravity Agent Trigger */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenAntigravity();
            }}
            id="nav-antigravity-btn"
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-2 border-purple-300 border-b-4 border-b-purple-400 rounded-xl px-2.5 sm:px-3 py-1.5 text-purple-950 font-black text-xs transition-transform active:translate-y-0.5 cursor-pointer shadow-sm"
            title="Open Antigravity Autonomous Event Agent"
          >
            <span className="text-purple-600 text-sm">⚡</span>
            <span className="hidden md:inline">Antigravity</span>
          </button>

          {/* Escrow Wallet Pill */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenWallet();
            }}
            className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 border-b-4 border-b-amber-400 rounded-xl px-2.5 sm:px-3 py-1.5 text-zinc-900 font-extrabold text-xs transition-transform active:translate-y-0.5 cursor-pointer"
            title="EventMate Protected Escrow Balance"
          >
            <span className="text-amber-500 font-black text-sm">🔒</span>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800 leading-none">
                Escrow Wallet
              </span>
              <span className="text-xs sm:text-sm font-black text-zinc-900">
                ₹{walletBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </button>

          {/* User Profile Pill / Welcome return */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            <button
              onClick={onOpenWelcome}
              className="flex items-center gap-1.5 p-1.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white transition-colors"
              title="Return to Welcome Screen"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-black text-xs">
                {currentRole === 'work' ? 'RS' : 'RC'}
              </div>
              <div className="hidden lg:block text-left text-xs pr-1">
                <p className="font-extrabold text-zinc-900 leading-tight">
                  {currentRole === 'work' ? 'Rohan Sharma' : 'Red Carpet Prods'}
                </p>
                <p className="text-[10px] font-bold text-[#58CC02] flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  {currentRole === 'work' ? 'Level 4 Diamond' : 'Verified Organizer'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Shift, ShiftCategory, ActiveShiftState, CrewMember } from '../types';
import { sound } from '../utils/sound';

interface FindWorkViewProps {
  shifts: Shift[];
  activeShift: ActiveShiftState;
  bookedShiftIds: string[];
  onSelectShift: (shift: Shift) => void;
  onOpenClockIn: (shift: Shift) => void;
  onOpenWallet: () => void;
  selectedCity: string;
  onViewMyReputation: () => void;
  myProfile: CrewMember;
}

export const FindWorkView: React.FC<FindWorkViewProps> = ({
  shifts,
  activeShift,
  bookedShiftIds,
  onSelectShift,
  onOpenClockIn,
  onOpenWallet,
  selectedCity,
  onViewMyReputation,
  myProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ShiftCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'pay' | 'distance' | 'time'>('pay');

  const categories: { id: ShiftCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Gigs', icon: 'apps' },
    { id: 'concerts', label: 'Concerts & Festivals 🎸', icon: 'music_note' },
    { id: 'corporate', label: 'Corporate Summits 💼', icon: 'business_center' },
    { id: 'weddings', label: 'Weddings & Banquets 🎊', icon: 'celebration' },
    { id: 'vip', label: 'VIP & Hospitality 🍸', icon: 'local_bar' },
    { id: 'av', label: 'Sound & Lighting 💡', icon: 'lightbulb' },
  ];

  // Find currently active shift if clocked in or booked
  const currentActiveShift = shifts.find(
    (s) => s.id === activeShift.shiftId || bookedShiftIds.includes(s.id)
  );

  const filteredShifts = shifts.filter((s) => {
    const matchesCategory =
      selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedShifts = [...filteredShifts].sort((a, b) => {
    if (sortBy === 'pay') return b.totalPay - a.totalPay;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Welcome / Profile Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-zinc-200 border-b-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <img
              src={myProfile.avatar}
              alt={myProfile.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#58CC02]"
            />
            <span
              className="absolute -bottom-1 -right-1 bg-[#58CC02] text-white p-1 rounded-full text-xs flex items-center justify-center border-2 border-white shadow-sm"
              title="DigiLocker Aadhaar Verified"
            >
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Hey {myProfile.name.split(' ')[0]}! 👋
              </h1>
              <span className="bg-emerald-100 text-[#2b6c00] border border-emerald-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                Aadhaar &amp; DigiLocker Verified
              </span>
            </div>
            <p className="text-xs font-semibold text-zinc-500 mt-0.5">
              {myProfile.level} • {myProfile.completedGigs} Gigs Completed • ★ {myProfile.rating.toFixed(1)} Rating
            </p>
          </div>
        </div>

        {/* Quick Crew Metrics & Trust Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Reputation Passport Button */}
          <button
            onClick={() => {
              sound.playPop();
              onViewMyReputation();
            }}
            id="view-my-reputation-btn"
            className="tactile-btn px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 border-b-4 border-b-amber-400 text-amber-900 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:translate-y-0.5"
            title="View your verified organizer ratings and reviews"
          >
            <span>★</span>
            <span>My Reviews ({myProfile.reviews?.length || 0})</span>
          </button>

          <div className="bg-zinc-50 px-3.5 py-2 rounded-2xl border border-zinc-200 flex-1 sm:flex-none">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">
              Attendance
            </span>
            <span className="text-sm font-black text-emerald-600">100% On-Time</span>
          </div>

          <div className="bg-zinc-50 px-3.5 py-2 rounded-2xl border border-zinc-200 flex-1 sm:flex-none">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">
              City
            </span>
            <span className="text-sm font-black text-zinc-800">{selectedCity}</span>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onOpenWallet();
            }}
            className="tactile-btn-secondary px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 border-2 border-zinc-300 border-b-4 text-zinc-900 font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>💰 Escrow Vault</span>
          </button>
        </div>
      </div>

      {/* Active Shift Clock-In Banner (If Booked or Clocked In) */}
      {currentActiveShift && (
        <div className="bg-gradient-to-r from-emerald-600 via-[#58CC02] to-emerald-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border-2 border-emerald-500 border-b-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="bg-white/20 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  {activeShift.isClockedIn ? 'SHIFT IN PROGRESS' : 'CONFIRMED UPCOMING GIG'}
                </span>
                <span className="bg-black/20 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                  {currentActiveShift.venue}
                </span>
                <span className="bg-amber-400 text-zinc-900 font-black text-[10px] px-2 py-0.5 rounded-full">
                  ★ Earn Verified Review
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {currentActiveShift.title}
              </h3>
              <p className="text-xs font-semibold text-emerald-100 mt-1">
                {currentActiveShift.date} • {currentActiveShift.startTime} - {currentActiveShift.endTime} • Pay: ₹{currentActiveShift.totalPay.toLocaleString('en-IN')} (Escrow Locked)
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeShift.isClockedIn ? (
                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 block">
                    Earned So Far
                  </span>
                  <span className="text-xl font-black text-white">
                    ₹{activeShift.earnedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              ) : null}

              <button
                onClick={() => {
                  sound.playPop();
                  onOpenClockIn(currentActiveShift);
                }}
                className="tactile-btn px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs uppercase border-b-4 border-emerald-200 shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
              >
                <span className="material-symbols-outlined text-base">
                  {activeShift.isClockedIn ? 'timer' : 'location_on'}
                </span>
                <span>
                  {activeShift.isClockedIn
                    ? 'VIEW CLOCK-IN RADAR'
                    : 'GEO CLOCK-IN TURNSTILE →'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playPop();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs whitespace-nowrap border-2 border-b-4 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#58CC02] border-[#46A302] text-white shadow-[0_3px_0_#46A302]'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white rounded-3xl p-4 border-2 border-zinc-200 border-b-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-zinc-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search gigs, artists, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border-2 border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 outline-none focus:border-[#58CC02] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-extrabold text-zinc-500">Sort by:</span>
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-extrabold">
            <button
              onClick={() => setSortBy('pay')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                sortBy === 'pay' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
              }`}
            >
              Highest Pay
            </button>
            <button
              onClick={() => setSortBy('distance')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                sortBy === 'distance' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
              }`}
            >
              Nearest
            </button>
          </div>
        </div>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {sortedShifts.map((shift) => {
          const isBooked = bookedShiftIds.includes(shift.id);

          return (
            <div
              key={shift.id}
              className="tactile-card bg-white rounded-3xl p-5 border-2 border-zinc-200 border-b-5 hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      shift.isSurge
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        : 'bg-emerald-100 text-[#2b6c00] border border-emerald-300'
                    }`}
                  >
                    {shift.badge}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">near_me</span>
                    {shift.distanceKm} km away
                  </span>
                </div>

                {/* Title & Client */}
                <h3 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight leading-snug line-clamp-2">
                  {shift.title}
                </h3>
                <p className="text-xs font-semibold text-zinc-500 mt-1">{shift.client}</p>

                {/* Venue & Schedule */}
                <div className="my-3 py-2.5 px-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-700 font-bold">
                    <span className="material-symbols-outlined text-zinc-400 text-[16px]">
                      calendar_today
                    </span>
                    <span>
                      {shift.date} • {shift.startTime} - {shift.endTime} ({shift.durationHours} hrs)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
                    <span className="material-symbols-outlined text-zinc-400 text-[16px]">
                      location_on
                    </span>
                    <span className="truncate">{shift.venue}</span>
                  </div>
                </div>

                {/* Spot progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-extrabold mb-1">
                    <span className="text-zinc-500">Crew Spots</span>
                    <span className="text-amber-600 font-black">
                      {shift.spotsFilled} of {shift.spotsTotal} filled
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                    <div
                      className="h-full bg-[#58CC02] rounded-full transition-all duration-300"
                      style={{
                        width: `${(shift.spotsFilled / shift.spotsTotal) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bottom Pay & Booking CTA */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">
                    Total Payout
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[#2b6c00]">
                      ₹{shift.totalPay.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-bold text-zinc-400">
                      (₹{shift.hourlyRate}/h)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playPop();
                    onSelectShift(shift);
                  }}
                  className={`tactile-btn px-4 py-2.5 text-white font-black text-xs uppercase rounded-xl border-b-4 flex items-center gap-1 cursor-pointer transition-transform active:translate-y-0.5 ${
                    isBooked
                      ? 'bg-zinc-500 border-zinc-600'
                      : 'bg-[#58CC02] hover:bg-[#52be02] border-[#46A302] shadow-[0_4px_0_#46A302]'
                  }`}
                >
                  {isBooked ? <span>BOOKED ✓</span> : <span>BOOK NOW →</span>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

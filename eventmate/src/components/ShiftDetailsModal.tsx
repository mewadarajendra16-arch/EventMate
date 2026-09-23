import React from 'react';
import { Shift } from '../types';
import { sound } from '../utils/sound';

interface ShiftDetailsModalProps {
  shift: Shift;
  onClose: () => void;
  onBookShift: (shift: Shift) => void;
  isBooked: boolean;
}

export const ShiftDetailsModal: React.FC<ShiftDetailsModalProps> = ({
  shift,
  onClose,
  onBookShift,
  isBooked,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border-2 border-zinc-200 border-b-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                {shift.badge}
              </span>
              <span className="bg-emerald-100 text-[#2b6c00] border border-emerald-300 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">lock</span>
                100% Escrow Protected
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-snug">
              {shift.title}
            </h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">{shift.client}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Highlight Grid: Pay, Timing, Venue */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-zinc-50 rounded-2xl border-2 border-zinc-200 mb-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
              Shift Pay
            </span>
            <span className="text-lg font-black text-[#2b6c00]">
              ₹{shift.totalPay.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-bold text-zinc-500">₹{shift.hourlyRate}/hr</span>
          </div>

          <div className="flex flex-col border-l border-zinc-200 pl-3">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
              Timing
            </span>
            <span className="text-sm font-black text-zinc-900">{shift.startTime}</span>
            <span className="text-[10px] font-bold text-zinc-500">{shift.durationHours} hrs shift</span>
          </div>

          <div className="flex flex-col border-l border-zinc-200 pl-3">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
              Spots Left
            </span>
            <span className="text-sm font-black text-amber-600">
              {shift.spotsTotal - shift.spotsFilled} of {shift.spotsTotal}
            </span>
            <span className="text-[10px] font-bold text-zinc-500">Filling fast</span>
          </div>
        </div>

        {/* Location & Geo-Fence Info */}
        <div className="mb-4 p-3 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
          </div>
          <div>
            <h4 className="text-xs font-black text-blue-950 uppercase tracking-wider">
              Venue &amp; Geo-Attendance Zone
            </h4>
            <p className="text-xs font-bold text-zinc-800 mt-0.5">{shift.venue}, {shift.city}</p>
            <p className="text-[11px] font-medium text-blue-900 mt-1">
              📍 Geo-fence: Clock-in unlocks within <strong>{shift.geoFenceMeters} meters</strong> of entry gate. You are approx <strong>{shift.distanceKm} km</strong> away.
            </p>
          </div>
        </div>

        {/* Shift Details & Requirements */}
        <div className="space-y-3 mb-6 text-xs text-zinc-700">
          <div>
            <span className="font-extrabold uppercase text-[10px] text-zinc-400 tracking-wider block mb-1">
              Job Description
            </span>
            <p className="font-semibold text-zinc-800 bg-zinc-50 p-3 rounded-xl border border-zinc-200 leading-relaxed">
              {shift.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50">
              <span className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">
                Dress Code
              </span>
              <span className="font-extrabold text-zinc-800 text-[11px]">{shift.dressCode}</span>
            </div>
            <div className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50">
              <span className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">
                Supervisor
              </span>
              <span className="font-extrabold text-zinc-800 text-[11px]">{shift.supervisorName}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#58CC02] text-xl">
              verified_user
            </span>
            <p className="text-[11px] font-bold text-emerald-900 leading-snug">
              Instant UPI Escrow: Payment of ₹{shift.totalPay} is held in EventFlex Escrow Vault and automatically credited to your UPI ID upon manager sign-off.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="tactile-btn-secondary px-5 py-3 font-black text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-2xl border-2 border-zinc-200 cursor-pointer"
          >
            BACK
          </button>

          <button
            disabled={isBooked}
            onClick={() => {
              sound.playSuccess();
              onBookShift(shift);
            }}
            className={`tactile-btn flex-1 py-3 text-white font-black text-sm uppercase rounded-2xl border-b-4 flex items-center justify-center gap-2 cursor-pointer ${
              isBooked
                ? 'bg-zinc-400 border-zinc-500 cursor-not-allowed'
                : 'bg-[#58CC02] hover:bg-[#52be02] border-[#46A302] shadow-[0_4px_0_#46A302]'
            }`}
          >
            {isBooked ? (
              <span>✓ SHIFT CONFIRMED</span>
            ) : (
              <span>INSTANT BOOK SHIFT (₹{shift.totalPay}) →</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

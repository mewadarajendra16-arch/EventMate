import React, { useState, useEffect } from 'react';
import { Shift, ActiveShiftState } from '../types';
import { sound } from '../utils/sound';

interface GeoClockInModalProps {
  shift: Shift;
  activeShift: ActiveShiftState;
  onClose: () => void;
  onClockIn: (shiftId: string) => void;
  onClockOut: (shiftId: string, earnedAmount: number) => void;
}

export const GeoClockInModal: React.FC<GeoClockInModalProps> = ({
  shift,
  activeShift,
  onClose,
  onClockIn,
  onClockOut,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [gpsSimulatedDistance, setGpsSimulatedDistance] = useState(38); // within 150m geofence
  const [isClockingOut, setIsClockingOut] = useState(false);

  // Time format helper
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSimulateScan = () => {
    sound.playPop();
    setIsScanning(true);
    setTimeout(() => {
      sound.playSuccess();
      setIsScanning(false);
      onClockIn(shift.id);
    }, 1200);
  };

  const handleConfirmClockOut = () => {
    sound.playPop();
    setIsClockingOut(true);
    setTimeout(() => {
      sound.playSuccess();
      setIsClockingOut(false);
      onClockOut(shift.id, activeShift.earnedAmount || shift.totalPay);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-zinc-200 border-b-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1CB0F6] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-900 leading-tight">
                Geo-Attendance Radar
              </h3>
              <p className="text-[11px] font-bold text-zinc-500">{shift.venue}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* GPS Geo-Fence Radar Graphic */}
        <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden mb-4 border border-slate-800">
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            GPS LOCKED
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-500/10 flex items-center justify-center flex-shrink-0 animate-pulse">
              <span className="material-symbols-outlined text-emerald-400 text-2xl">
                near_me
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Distance
              </p>
              <h4 className="text-lg font-black text-white flex items-center gap-1.5">
                {gpsSimulatedDistance} meters away
                <span className="text-xs bg-emerald-900/60 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                  Inside {shift.geoFenceMeters}m Zone
                </span>
              </h4>
              <p className="text-[10px] font-medium text-slate-300 mt-0.5">
                Accuracy: High (Aadhaar GPS Beacon Authenticated)
              </p>
            </div>
          </div>
        </div>

        {/* Clocked In Live State vs Ready to Clock In */}
        {activeShift.isClockedIn ? (
          <div className="space-y-4">
            {/* Live Timer & Accrued Cash */}
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center">
              <span className="inline-block bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                ● SHIFT ACTIVE NOW
              </span>
              <div className="text-3xl font-black text-zinc-900 tracking-tight font-mono mt-1">
                {formatTime(activeShift.elapsedSeconds)}
              </div>
              <p className="text-xs font-bold text-zinc-600 mt-1">
                Clocked in at {activeShift.clockInTime || '04:00 PM'}
              </p>

              <div className="mt-3 pt-3 border-t border-emerald-200 flex justify-around">
                <div>
                  <span className="text-[10px] font-extrabold text-zinc-500 uppercase">
                    Hourly Rate
                  </span>
                  <p className="text-sm font-black text-zinc-900">₹{shift.hourlyRate}/hr</p>
                </div>
                <div className="border-r border-emerald-200"></div>
                <div>
                  <span className="text-[10px] font-extrabold text-zinc-500 uppercase">
                    Escrow Locked
                  </span>
                  <p className="text-sm font-black text-[#2b6c00]">
                    ₹{shift.totalPay.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Shift Rules Reminders */}
            <div className="text-xs font-semibold text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
              <p className="flex items-center gap-1.5 text-zinc-800 font-bold mb-1">
                <span className="material-symbols-outlined text-[15px] text-[#58CC02]">
                  task_alt
                </span>
                On-duty Instructions
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-zinc-600">
                <li>Stay within stadium perimeter for continuous geo-attendance</li>
                <li>Report to supervisor {shift.supervisorName} for station duty</li>
                <li>Dinner break is 30 mins between 07:30 PM - 08:30 PM</li>
              </ul>
            </div>

            {/* Clock Out Action */}
            <button
              onClick={handleConfirmClockOut}
              disabled={isClockingOut}
              className="tactile-btn w-full h-12 bg-[#FF4B4B] hover:bg-[#eb3b3b] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#D33131] shadow-[0_4px_0_#D33131] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isClockingOut ? (
                <span>PROCESSING ESCROW DISBURSAL...</span>
              ) : (
                <span>CLOCK OUT &amp; CLAIM ESCROW (₹{shift.totalPay}) →</span>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Camera Viewfinder Simulation */}
            <div className="relative h-48 bg-zinc-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-zinc-700">
              {isScanning ? (
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 border-2 border-[#58CC02] rounded-xl relative flex items-center justify-center">
                    <div className="w-full h-0.5 bg-[#58CC02] absolute top-1/2 -translate-y-1/2 animate-bounce shadow-[0_0_8px_#58CC02]"></div>
                    <span className="text-white text-xs font-bold animate-pulse">
                      Scanning Gate QR...
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-300 mt-2">
                    Validating Aadhaar Token &amp; GPS coordinates...
                  </span>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-zinc-400 text-3xl">
                      qr_code_2
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    Scan Supervisor or Turnstile QR
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Gate 4 Steward Check-in Desk
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="tactile-btn w-full h-12 bg-[#58CC02] hover:bg-[#52be02] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#46A302] shadow-[0_4px_0_#46A302] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">center_focus_strong</span>
              <span>{isScanning ? 'SCANNING & VERIFYING...' : 'CLOCK IN WITH GEO-QR NOW'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Shift, ShiftCategory } from '../types';
import { sound } from '../utils/sound';

interface PostShiftModalProps {
  onClose: () => void;
  onPostShift: (newShift: Shift) => void;
  defaultCity: string;
}

export const PostShiftModal: React.FC<PostShiftModalProps> = ({
  onClose,
  onPostShift,
  defaultCity,
}) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('Red Carpet Event Productions');
  const [category, setCategory] = useState<ShiftCategory>('concerts');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState(defaultCity || 'Mumbai');
  const [date, setDate] = useState('Today, 22 Sep');
  const [startTime, setStartTime] = useState('04:00 PM');
  const [endTime, setEndTime] = useState('12:00 AM');
  const [durationHours, setDurationHours] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(450);
  const [spotsTotal, setSpotsTotal] = useState(6);
  const [dressCode, setDressCode] = useState('Black crew t-shirt & work pants');
  const [description, setDescription] = useState(
    'Stage setup, crowd access line management, and artist dressing room coordination.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalBudget = spotsTotal * durationHours * hourlyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      alert('Please fill out the shift title and venue.');
      return;
    }

    sound.playPop();
    setIsSubmitting(true);

    setTimeout(() => {
      sound.playSuccess();
      const newShift: Shift = {
        id: `shift-${Date.now()}`,
        title,
        client,
        category,
        venue,
        city,
        date,
        startTime,
        endTime,
        durationHours: Number(durationHours),
        hourlyRate: Number(hourlyRate),
        totalPay: Number(durationHours) * Number(hourlyRate),
        isSurge: hourlyRate >= 450,
        spotsTotal: Number(spotsTotal),
        spotsFilled: 0,
        dressCode,
        mealsIncluded: true,
        aadhaarRequired: true,
        escrowStatus: 'locked',
        description,
        supervisorName: 'Karan Mehra (Operations)',
        supervisorPhone: '+91 98200 11984',
        distanceKm: 2.4,
        geoFenceMeters: 150,
        badge: '⚡ INSTANT MATCH',
      };

      setIsSubmitting(false);
      onPostShift(newShift);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border-2 border-zinc-200 border-b-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1CB0F6] flex items-center justify-center font-bold">
              📢
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 leading-tight">
                Post Crew Requirement
              </h3>
              <p className="text-[11px] font-bold text-zinc-500">
                Instantly broadcast to verified Aadhaar crew in {city}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1">
              Event Shift Title
            </label>
            <input
              type="text"
              placeholder="e.g. Sunburn Festival VIP Stewards"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 bg-zinc-50 border-2 border-zinc-200 focus:border-[#1CB0F6] focus:bg-white text-zinc-900 font-bold text-sm rounded-xl outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1">
                Role Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShiftCategory)}
                className="w-full h-11 px-3 bg-zinc-50 border-2 border-zinc-200 focus:border-[#1CB0F6] focus:bg-white text-zinc-900 font-bold text-xs rounded-xl outline-none"
              >
                <option value="concerts">Concerts &amp; Music Festivals 🎸</option>
                <option value="corporate">Corporate Summits 💼</option>
                <option value="weddings">Weddings &amp; Banquets 🎊</option>
                <option value="vip">VIP &amp; Hospitality 🍸</option>
                <option value="av">Sound &amp; Lighting AV 💡</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-3 bg-zinc-50 border-2 border-zinc-200 focus:border-[#1CB0F6] focus:bg-white text-zinc-900 font-bold text-xs rounded-xl outline-none"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Pune">Pune</option>
                <option value="Goa">Goa</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1">
              Venue / Gate Details
            </label>
            <input
              type="text"
              placeholder="e.g. DY Patil Stadium Gate 4 / Taj West End Ball Room"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full h-11 px-3.5 bg-zinc-50 border-2 border-zinc-200 focus:border-[#1CB0F6] focus:bg-white text-zinc-900 font-bold text-sm rounded-xl outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1">
                Crew Needed
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={spotsTotal}
                onChange={(e) => setSpotsTotal(parseInt(e.target.value) || 1)}
                className="w-full h-11 px-3 bg-zinc-50 border-2 border-zinc-200 focus:border-[#1CB0F6] focus:bg-white text-zinc-900 font-bold text-sm rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1">
                Duration (Hrs)
              </label>
              <input
                type="number"
                min={2}
                max={16}
                value={durationHours}
                onChange={(e) => setDurationHours(parseInt(e.target.value) || 4)}
                className="w-full h-11 px-3 bg-zinc-50 border-2 border-zinc-200 focus:border-[#1CB0F6] focus:bg-white text-zinc-900 font-bold text-sm rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1">
                Rate (₹/hr)
              </label>
              <input
                type="number"
                min={250}
                max={2500}
                step={25}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseInt(e.target.value) || 350)}
                className="w-full h-11 px-3 bg-zinc-50 border-2 border-zinc-200 focus:border-[#1CB0F6] focus:bg-white text-zinc-900 font-bold text-sm rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1">
              Dress Code &amp; Briefing
            </label>
            <input
              type="text"
              value={dressCode}
              onChange={(e) => setDressCode(e.target.value)}
              className="w-full h-11 px-3.5 bg-zinc-50 border-2 border-zinc-200 focus:border-[#1CB0F6] focus:bg-white text-zinc-900 font-bold text-xs rounded-xl outline-none"
            />
          </div>

          {/* Escrow Lock Preview Card */}
          <div className="p-3.5 bg-blue-50/80 border-2 border-blue-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block">
                Required Escrow Deposit
              </span>
              <p className="text-xs font-semibold text-blue-950 mt-0.5">
                {spotsTotal} Crew × {durationHours} hrs @ ₹{hourlyRate}/hr
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-blue-900">
                ₹{totalBudget.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-blue-700 block">🔒 Smart Escrow</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="tactile-btn-blue w-full h-12 bg-[#1CB0F6] hover:bg-[#159edb] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#1899D6] shadow-[0_4px_0_#1899D6] flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <span>LOCKING ESCROW &amp; DISPATCHING GIG...</span>
            ) : (
              <span>DEPOSIT ESCROW &amp; BROADCAST SHIFT 🚀</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

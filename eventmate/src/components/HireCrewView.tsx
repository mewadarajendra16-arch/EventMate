import React, { useState } from 'react';
import { Shift, CrewMember } from '../types';
import { sound } from '../utils/sound';

interface HireCrewViewProps {
  shifts: Shift[];
  crewRoster: CrewMember[];
  onOpenPostShift: () => void;
  onApproveEscrow: (crewId: string, amount: number) => void;
  onOpenWallet: () => void;
  selectedCity: string;
  onOpenRateCrew: (crew: CrewMember) => void;
  onViewCrewReviews: (crew: CrewMember) => void;
}

export const HireCrewView: React.FC<HireCrewViewProps> = ({
  shifts,
  crewRoster,
  onOpenPostShift,
  onApproveEscrow,
  selectedCity,
  onOpenRateCrew,
  onViewCrewReviews,
}) => {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [rosterFilter, setRosterFilter] = useState<'all' | 'clocked_in' | 'en_route' | 'completed'>('all');
  const [searchRoster, setSearchRoster] = useState('');

  const totalCrewOnDuty = crewRoster.filter((c) => c.status === 'clocked_in').length;
  const totalEscrowLocked = shifts.reduce((sum, s) => sum + s.totalPay * s.spotsFilled, 0) || 48000;
  const totalReviewsCount = crewRoster.reduce((sum, c) => sum + (c.reviews?.length || 0), 0);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    sound.playSuccess();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMsg('');
    }, 2500);
  };

  const filteredRoster = crewRoster.filter((c) => {
    if (rosterFilter === 'clocked_in') return c.status === 'clocked_in';
    if (rosterFilter === 'en_route') return c.status === 'en_route';
    if (rosterFilter === 'completed') return c.payoutStatus === 'released';
    return true;
  }).filter((c) => {
    if (!searchRoster) return true;
    return (
      c.name.toLowerCase().includes(searchRoster.toLowerCase()) ||
      c.role.toLowerCase().includes(searchRoster.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Organizer Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-zinc-200 border-b-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              EventMate Organizer Command Center 🎪
            </h1>
            <span className="bg-blue-100 text-[#006590] border border-blue-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Verified Enterprise Organizer
            </span>
          </div>
          <p className="text-xs font-semibold text-zinc-500 mt-0.5">
            Red Carpet Productions • 4 Active Venues in {selectedCity} • Sunburn Arena Tour
          </p>
        </div>

        {/* Post Shift Action Button */}
        <button
          onClick={() => {
            sound.playPop();
            onOpenPostShift();
          }}
          id="post-crew-shift-btn"
          className="tactile-btn-blue px-5 py-3 bg-[#1CB0F6] hover:bg-[#159edb] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#1899D6] shadow-[0_4px_0_#1899D6] flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          <span>POST CREW SHIFT NOW +</span>
        </button>
      </div>

      {/* Organizer Key Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="tactile-card bg-white p-4 rounded-2xl border-2 border-zinc-200 border-b-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              Crew On Duty
            </span>
            <span className="text-[#58CC02] text-sm font-black">● LIVE</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-900">{totalCrewOnDuty}</h3>
          <p className="text-[11px] font-bold text-zinc-500 mt-0.5">
            100% Geo-fence verified
          </p>
        </div>

        <div className="tactile-card bg-white p-4 rounded-2xl border-2 border-zinc-200 border-b-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              Escrow Locked
            </span>
            <span className="text-amber-500 text-sm">🔒</span>
          </div>
          <h3 className="text-2xl font-black text-amber-600">
            ₹{totalEscrowLocked.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] font-bold text-zinc-500 mt-0.5">
            Auto-disbursed on approval
          </p>
        </div>

        <div className="tactile-card bg-white p-4 rounded-2xl border-2 border-zinc-200 border-b-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              Reputation &amp; Trust
            </span>
            <span className="text-amber-500 text-sm">★</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-900">
            {totalReviewsCount} <span className="text-sm font-bold text-zinc-400">Reviews</span>
          </h3>
          <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
            4.9 Avg Crew Rating
          </p>
        </div>

        <div className="tactile-card bg-white p-4 rounded-2xl border-2 border-zinc-200 border-b-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">
              KYC Compliance
            </span>
            <span className="text-blue-500 text-sm">🛡️</span>
          </div>
          <h3 className="text-2xl font-black text-blue-600">100%</h3>
          <p className="text-[11px] font-bold text-zinc-500 mt-0.5">
            DigiLocker Verified
          </p>
        </div>
      </div>

      {/* Urgent Stage Broadcast Bar */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5">
        <form onSubmit={handleSendBroadcast} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black text-sm">
              📢
            </span>
            <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
              Broadcast to All Crew:
            </span>
          </div>

          <input
            type="text"
            placeholder="e.g. Soundcheck delayed by 15 mins. All stage hands report to Gate 4 catering."
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            className="flex-1 w-full h-10 px-3.5 bg-white border-2 border-amber-200 focus:border-amber-400 rounded-xl text-xs font-bold text-zinc-800 outline-none"
          />

          <button
            type="submit"
            className="tactile-btn-yellow px-4 py-2 bg-[#FFC800] hover:bg-[#f5be00] text-zinc-900 font-extrabold text-xs uppercase rounded-xl border-b-4 border-[#E5A100] shadow-[0_4px_0_#E5A100] whitespace-nowrap cursor-pointer transition-transform active:translate-y-0.5"
          >
            {broadcastSent ? 'BROADCAST SENT ✓' : 'DISPATCH ALERT 🔔'}
          </button>
        </form>
      </div>

      {/* Live Crew Roster & Review System */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-zinc-200 border-b-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <span>EventMate Crew Roster &amp; Rating System</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </h2>
            <p className="text-xs font-semibold text-zinc-500">
              Geo-verified check-ins, instant escrow disbursals, and post-shift reputation reviews
            </p>
          </div>

          {/* Roster Controls: Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search crew name or skill..."
              value={searchRoster}
              onChange={(e) => setSearchRoster(e.target.value)}
              className="px-3 py-1.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 outline-none focus:bg-white"
            />

            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-extrabold">
              <button
                onClick={() => setRosterFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  rosterFilter === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
                }`}
              >
                All ({crewRoster.length})
              </button>
              <button
                onClick={() => setRosterFilter('clocked_in')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  rosterFilter === 'clocked_in'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-zinc-500'
                }`}
              >
                On-Site ({totalCrewOnDuty})
              </button>
              <button
                onClick={() => setRosterFilter('en_route')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  rosterFilter === 'en_route' ? 'bg-white text-amber-700 shadow-sm' : 'text-zinc-500'
                }`}
              >
                En Route
              </button>
              <button
                onClick={() => setRosterFilter('completed')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  rosterFilter === 'completed' ? 'bg-white text-blue-700 shadow-sm' : 'text-zinc-500'
                }`}
              >
                Completed &amp; Paid
              </button>
            </div>
          </div>
        </div>

        {/* Crew Member Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredRoster.map((crew) => {
            const isClockedIn = crew.status === 'clocked_in';
            const isReleased = crew.payoutStatus === 'released';
            const reviewsCount = crew.reviews?.length || 0;
            const hasBeenReviewed = crew.reviewedByOrganizer;

            return (
              <div
                key={crew.id}
                id={`crew-card-${crew.id}`}
                className="p-4 rounded-2xl border-2 border-zinc-200 border-b-4 bg-zinc-50/70 hover:bg-white transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Profile Strip */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={crew.avatar}
                        alt={crew.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-zinc-300"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-black text-sm text-zinc-900 leading-tight">
                            {crew.name}
                          </h4>
                          <span
                            className="text-[#58CC02] text-xs font-bold"
                            title="DigiLocker Verified"
                          >
                            ✓
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-zinc-500">{crew.role}</p>

                        {/* Interactive Rating Badge - Opens Reviews */}
                        <button
                          type="button"
                          onClick={() => {
                            sound.playPop();
                            onViewCrewReviews(crew);
                          }}
                          className="flex items-center gap-1 mt-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-lg cursor-pointer transition-colors"
                          title="View verified reviews for this crew member"
                        >
                          <span className="text-amber-500">★</span>
                          <span>{crew.rating.toFixed(1)}</span>
                          <span className="text-zinc-500 font-semibold">
                            ({crew.totalRatingsCount || reviewsCount} reviews)
                          </span>
                          <span className="text-zinc-400">→</span>
                        </button>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isReleased
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : isClockedIn
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isReleased ? 'PAID OUT ✓' : isClockedIn ? 'ON-SITE ●' : 'EN ROUTE'}
                    </span>
                  </div>

                  {/* GPS Proximity / Attendance Info */}
                  <div className="p-2.5 bg-white rounded-xl border border-zinc-200/80 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-zinc-700">
                      <span>Turnstile GPS:</span>
                      <span className="font-extrabold text-zinc-900">
                        {crew.distanceMeters}m from Stage Gate
                      </span>
                    </div>
                    {crew.clockInTime && (
                      <div className="flex justify-between text-zinc-500 font-semibold">
                        <span>Clocked in:</span>
                        <span className="font-bold text-zinc-800">{crew.clockInTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Top Endorsements snippet */}
                  {crew.topSkills && crew.topSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {crew.topSkills.slice(0, 2).map((skill, i) => (
                        <span
                          key={i}
                          className="bg-zinc-200/60 text-zinc-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Latest Review Snippet if available */}
                  {crew.reviews && crew.reviews[0] && (
                    <div className="p-2 bg-amber-50/50 rounded-xl border border-amber-200/60 text-[10px] space-y-0.5">
                      <div className="flex justify-between text-amber-900 font-extrabold">
                        <span>Verified Organizer Review:</span>
                        <span>★ {crew.reviews[0].rating}</span>
                      </div>
                      <p className="text-zinc-600 line-clamp-2 italic">
                        "{crew.reviews[0].comment}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Escrow Disbursal & Post-Shift Rating */}
                <div className="pt-2 border-t border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500">
                    <span>
                      Escrow: <strong className="text-zinc-900">₹4,000</strong>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-extrabold">
                      {isReleased ? 'Escrow Released' : 'Held in Escrow'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Disburse Escrow Button */}
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        onApproveEscrow(crew.id, 4000);
                      }}
                      disabled={isReleased}
                      className={`flex-1 tactile-btn px-2.5 py-1.5 text-white font-extrabold text-[11px] uppercase rounded-xl border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        isReleased
                          ? 'bg-zinc-300 border-zinc-400 text-zinc-600 cursor-default'
                          : 'bg-[#58CC02] hover:bg-[#52be02] border-[#46A302] shadow-[0_2px_0_#46A302] active:translate-y-0.5'
                      }`}
                    >
                      {isReleased ? 'PAID ✓' : 'APPROVE ESCROW →'}
                    </button>

                    {/* Rate & Review Button */}
                    <button
                      onClick={() => {
                        sound.playPop();
                        onOpenRateCrew(crew);
                      }}
                      id={`rate-crew-btn-${crew.id}`}
                      className={`tactile-btn px-2.5 py-1.5 font-black text-[11px] uppercase rounded-xl border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        hasBeenReviewed
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                          : 'bg-white hover:bg-amber-50 text-amber-700 border-amber-300 shadow-[0_2px_0_#d97706]'
                      }`}
                      title="Rate and review crew member performance"
                    >
                      <span>★</span>
                      <span>{hasBeenReviewed ? 'EDIT REVIEW' : 'RATE CREW'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

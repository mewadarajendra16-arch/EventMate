import React from 'react';
import { CrewMember } from '../types';

interface CrewReviewsListModalProps {
  crew: CrewMember;
  onClose: () => void;
  onOpenAddReview: (crew: CrewMember) => void;
}

export const CrewReviewsListModal: React.FC<CrewReviewsListModalProps> = ({
  crew,
  onClose,
  onOpenAddReview,
}) => {
  const reviews = crew.reviews || [];

  return (
    <div
      id="crew-reviews-list-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="crew-reviews-list-card"
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full border-2 border-zinc-200 border-b-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <img
              src={crew.avatar}
              alt={crew.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#58CC02]"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                  {crew.name}
                </h3>
                <span className="text-[#58CC02] text-xs font-bold" title="Aadhaar Verified">
                  ✓
                </span>
                <span className="bg-emerald-100 text-[#2b6c00] border border-emerald-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Verified EventMate Crew
                </span>
              </div>
              <p className="text-xs font-bold text-zinc-500">
                {crew.role} • {crew.level}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-amber-500 font-black text-sm flex items-center gap-0.5">
                  ★ {crew.rating.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  ({crew.totalRatingsCount || reviews.length} verified ratings)
                </span>
                <span className="text-xs font-bold text-zinc-400">•</span>
                <span className="text-xs font-bold text-zinc-600">
                  {crew.completedGigs} Completed Gigs
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Top Reputation Highlights */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-50 rounded-2xl border-2 border-zinc-200 text-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">
              Punctuality
            </span>
            <span className="text-sm font-black text-emerald-600">4.9 / 5.0 ⏱️</span>
          </div>
          <div className="border-x border-zinc-200">
            <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">
              Work Ethic
            </span>
            <span className="text-sm font-black text-blue-600">5.0 / 5.0 ⚡</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">
              Attendance
            </span>
            <span className="text-sm font-black text-amber-600">100% Geo-Verified</span>
          </div>
        </div>

        {/* Endorsed Skills Badges */}
        {crew.topSkills && crew.topSkills.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase text-zinc-500 tracking-wider">
              Top Endorsed Skills by Organizers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {crew.topSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-zinc-100 text-zinc-800 text-xs font-extrabold px-2.5 py-1 rounded-xl border border-zinc-200"
                >
                  ⭐ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black uppercase tracking-wider text-zinc-800">
              Verified Organizer Reviews ({reviews.length})
            </h4>

            <button
              onClick={() => onOpenAddReview(crew)}
              className="text-xs font-black text-[#006590] hover:text-[#004e70] flex items-center gap-1 cursor-pointer"
            >
              <span>+ Write a Review</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="p-6 text-center bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400">
              <p className="text-xs font-bold">No written reviews yet for this crew member.</p>
              <button
                onClick={() => onOpenAddReview(crew)}
                className="mt-2 text-xs font-extrabold text-[#58CC02] hover:underline"
              >
                Be the first organizer to leave a review →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2 hover:bg-white transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs text-zinc-900">
                          {rev.organizerName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold">
                          • {rev.organizerCompany}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-zinc-500">
                        {rev.eventName} • {rev.shiftDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg text-xs font-black">
                      <span>★</span>
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-zinc-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {/* Sub metrics & tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-200/60 text-[10px] font-bold text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span>Punctuality: {rev.punctualityScore}/5</span>
                      <span>•</span>
                      <span>Work Ethic: {rev.workEthicScore}/5</span>
                    </div>

                    {rev.verifiedEscrowPayout && (
                      <span className="text-[#2b6c00] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px]">verified</span>
                        Verified Escrow Payout
                      </span>
                    )}
                  </div>

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rev.tags.map((t, i) => (
                        <span
                          key={i}
                          className="bg-white text-zinc-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-zinc-200"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-2">
          <button
            onClick={() => onOpenAddReview(crew)}
            className="w-full py-3 bg-[#1CB0F6] hover:bg-[#159edb] text-white font-black text-xs uppercase rounded-2xl border-b-4 border-[#1899D6] shadow-[0_4px_0_#1899D6] transition-transform active:translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">rate_review</span>
            <span>Rate This Crew Member Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

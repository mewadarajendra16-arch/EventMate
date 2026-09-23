import React, { useState } from 'react';
import { CrewMember, CrewReview } from '../types';
import { sound } from '../utils/sound';

interface ReviewCrewModalProps {
  crew: CrewMember;
  onClose: () => void;
  onSubmitReview: (crewId: string, review: Omit<CrewReview, 'id' | 'createdAt'>) => void;
}

export const ReviewCrewModal: React.FC<ReviewCrewModalProps> = ({
  crew,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [punctualityScore, setPunctualityScore] = useState<number>(5);
  const [workEthicScore, setWorkEthicScore] = useState<number>(5);
  const [communicationScore, setCommunicationScore] = useState<number>(5);

  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual', 'Stage Hero']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'Punctual & Ready',
    'Stage Hero',
    'Never Slacks',
    'Fast Setup',
    'VIP Etiquette',
    'Safety First',
    'Calm Under Pressure',
    'Problem Solver',
    'Heavy Lifter',
    'Bilingual Host',
  ];

  const toggleTag = (tag: string) => {
    sound.playPop();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playPop();
    setIsSubmitting(true);

    setTimeout(() => {
      sound.playSuccess();
      onSubmitReview(crew.id, {
        organizerName: 'Red Carpet Productions',
        organizerCompany: 'Enterprise Events India',
        eventName: 'Sunburn Arena Tour 2026',
        shiftDate: 'Today, 22 Sep',
        rating,
        punctualityScore,
        workEthicScore,
        communicationScore,
        comment:
          comment.trim() ||
          `${crew.name} was exceptional on site! Flawless execution and highly dependable crew partner.`,
        tags: selectedTags,
        verifiedEscrowPayout: true,
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const getRatingFeedback = (val: number) => {
    switch (val) {
      case 5:
        return '🌟 Outstanding! Top 1% Event Professional';
      case 4:
        return '👍 Very Good! Dependable & Solid Execution';
      case 3:
        return '👌 Average! Met Minimum Requirements';
      case 2:
        return '⚠️ Below Expectations! Needed Constant Supervision';
      case 1:
        return '❌ Poor Performance! Did Not Follow Event Protocol';
      default:
        return 'Select a star rating';
    }
  };

  return (
    <div
      id="review-crew-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="review-crew-modal-card"
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border-2 border-zinc-200 border-b-6 shadow-2xl relative max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <img
              src={crew.avatar}
              alt={crew.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-zinc-300"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight leading-snug">
                  Rate &amp; Review {crew.name}
                </h3>
                <span className="text-[#58CC02] text-xs font-bold" title="Aadhaar Verified">
                  ✓
                </span>
              </div>
              <p className="text-xs font-bold text-zinc-500">
                {crew.role} • {crew.level}
              </p>
              <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                Verified Shift Completion
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-review-modal-btn"
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Overall Star Rating Section */}
          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 text-center space-y-2">
            <label className="block text-xs font-black uppercase text-amber-900 tracking-wider">
              Overall Performance Rating
            </label>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    id={`rate-star-${star}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                      sound.playPop();
                      setRating(star);
                    }}
                    className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-3xl sm:text-4xl transition-colors ${
                        isActive
                          ? 'text-amber-400 font-fill'
                          : 'text-zinc-300 hover:text-amber-200'
                      }`}
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-extrabold text-amber-800 min-h-[1.25rem]">
              {getRatingFeedback(hoverRating || rating)}
            </p>
          </div>

          {/* Sub-Dimension Criteria (Punctuality, Work Ethic, Communication) */}
          <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border-2 border-zinc-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-600">
              Detailed Work Metrics (1 - 5)
            </h4>

            {/* Punctuality */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-1">
                  <span>⏱️</span> Punctuality &amp; Gate Turnstile:
                </span>
                <span className="font-black text-zinc-900 bg-white px-2 py-0.5 rounded-lg border border-zinc-200">
                  {punctualityScore} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={punctualityScore}
                onChange={(e) => setPunctualityScore(parseFloat(e.target.value))}
                className="w-full accent-[#58CC02] cursor-pointer"
              />
            </div>

            {/* Work Ethic */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-1">
                  <span>⚡</span> Work Ethic &amp; Endurance:
                </span>
                <span className="font-black text-zinc-900 bg-white px-2 py-0.5 rounded-lg border border-zinc-200">
                  {workEthicScore} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={workEthicScore}
                onChange={(e) => setWorkEthicScore(parseFloat(e.target.value))}
                className="w-full accent-[#1CB0F6] cursor-pointer"
              />
            </div>

            {/* Communication */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
                <span className="flex items-center gap-1">
                  <span>💬</span> Crew Coordination &amp; Comms:
                </span>
                <span className="font-black text-zinc-900 bg-white px-2 py-0.5 rounded-lg border border-zinc-200">
                  {communicationScore} / 5
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={communicationScore}
                onChange={(e) => setCommunicationScore(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Endorsement Badges */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase text-zinc-700 tracking-wider">
              Endorse Specific Strengths &amp; Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Feedback / Review */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-zinc-700 tracking-wider">
              Organizer Recommendation / Review
            </label>
            <textarea
              rows={3}
              placeholder={`Write feedback to help other organizers hire ${crew.name} on EventMate... (e.g. Handled crowd chaos with absolute maturity)`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-zinc-50 border-2 border-zinc-200 focus:border-[#58CC02] rounded-2xl text-xs font-bold text-zinc-900 outline-none transition-all"
            />
          </div>

          {/* Escrow Trust Guarantee Disclaimer */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2.5 text-xs text-blue-900 font-semibold">
            <span className="text-lg">🛡️</span>
            <span>
              Reviews on <strong>EventMate</strong> are linked to verified escrow disbursements to ensure 100% genuine reputation.
            </span>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-black text-xs uppercase rounded-2xl border-b-4 border-zinc-300 transition-transform active:translate-y-0.5 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-crew-review-btn"
              className="flex-1 py-3 bg-[#58CC02] hover:bg-[#52be02] text-white font-black text-xs uppercase rounded-2xl border-b-4 border-[#46A302] shadow-[0_4px_0_#46A302] transition-transform active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing Review...</span>
              ) : (
                <>
                  <span>PUBLISH REVIEW ★</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

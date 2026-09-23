/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, Shift, ActiveShiftState, CrewMember, CrewReview } from './types';
import { INITIAL_SHIFTS, INITIAL_CREW_ROSTER } from './data/mockData';
import { sound } from './utils/sound';

import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { FindWorkView } from './components/FindWorkView';
import { HireCrewView } from './components/HireCrewView';
import { ShiftDetailsModal } from './components/ShiftDetailsModal';
import { GeoClockInModal } from './components/GeoClockInModal';
import { WalletModal } from './components/WalletModal';
import { PostShiftModal } from './components/PostShiftModal';
import { ReviewCrewModal } from './components/ReviewCrewModal';
import { CrewReviewsListModal } from './components/CrewReviewsListModal';
import { AntigravityModal } from './components/AntigravityModal';

export default function App() {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('work');
  const [userIdentifier, setUserIdentifier] = useState('98201 44892');
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  // Shifts state
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [bookedShiftIds, setBookedShiftIds] = useState<string[]>(['shift-1']);

  // Crew roster state for organizers & crew profiles
  const [crewRoster, setCrewRoster] = useState<CrewMember[]>(INITIAL_CREW_ROSTER);

  // Escrow Wallet Balance (₹)
  const [walletBalance, setWalletBalance] = useState<number>(14250);

  // Active shift state (Geo-clock in)
  const [activeShiftState, setActiveShiftState] = useState<ActiveShiftState>({
    shiftId: 'shift-1',
    isClockedIn: false,
    elapsedSeconds: 0,
    earnedAmount: 0,
    isGeoVerified: true,
    status: 'not_started',
  });

  // Modal states
  const [selectedShiftForDetails, setSelectedShiftForDetails] = useState<Shift | null>(null);
  const [isGeoClockInModalOpen, setIsGeoClockInModalOpen] = useState(false);
  const [shiftForGeoClockIn, setShiftForGeoClockIn] = useState<Shift | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isPostShiftModalOpen, setIsPostShiftModalOpen] = useState(false);
  const [isAntigravityModalOpen, setIsAntigravityModalOpen] = useState(false);

  // Rating & Review Modal states
  const [crewToRate, setCrewToRate] = useState<CrewMember | null>(null);
  const [crewToViewReviews, setCrewToViewReviews] = useState<CrewMember | null>(null);

  // Live timer for active clocked-in shift
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeShiftState.isClockedIn) {
      interval = setInterval(() => {
        setActiveShiftState((prev) => {
          const newSeconds = prev.elapsedSeconds + 1;
          // Calculate proportional earned rupees (approx ₹500/hr = ₹0.138/sec)
          const earned = Math.min(4000, Math.floor((newSeconds / 3600) * 500));
          return {
            ...prev,
            elapsedSeconds: newSeconds,
            earnedAmount: earned,
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeShiftState.isClockedIn]);

  // Auth handler
  const handleLoginSuccess = (role: UserRole, identifier: string) => {
    setCurrentRole(role);
    setUserIdentifier(identifier);
    setShowWelcomeScreen(false);
  };

  // Crew actions
  const handleBookShift = (shift: Shift) => {
    if (!bookedShiftIds.includes(shift.id)) {
      setBookedShiftIds((prev) => [...prev, shift.id]);
      setShifts((prev) =>
        prev.map((s) =>
          s.id === shift.id ? { ...s, spotsFilled: Math.min(s.spotsTotal, s.spotsFilled + 1) } : s
        )
      );
    }
    setSelectedShiftForDetails(null);
  };

  const handleOpenClockInModal = (shift: Shift) => {
    setShiftForGeoClockIn(shift);
    setIsGeoClockInModalOpen(true);
  };

  const handleClockIn = (shiftId: string) => {
    setActiveShiftState({
      shiftId,
      isClockedIn: true,
      clockInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      elapsedSeconds: 1,
      earnedAmount: 25,
      isGeoVerified: true,
      status: 'clocked_in',
    });
  };

  const handleClockOut = (shiftId: string, earnedAmount: number) => {
    setActiveShiftState((prev) => ({
      ...prev,
      isClockedIn: false,
      status: 'completed',
    }));
    // Credit to escrow balance
    setWalletBalance((prev) => prev + earnedAmount);
    setIsGeoClockInModalOpen(false);
  };

  // Wallet withdrawal
  const handleWithdraw = (amount: number, upiId: string) => {
    setWalletBalance((prev) => Math.max(0, prev - amount));
  };

  // Organizer actions
  const handlePostShift = (newShift: Shift) => {
    setShifts((prev) => [newShift, ...prev]);
    setIsPostShiftModalOpen(false);
  };

  const handleApproveEscrow = (crewId: string, amount: number) => {
    setCrewRoster((prev) =>
      prev.map((c) => (c.id === crewId ? { ...c, payoutStatus: 'released' } : c))
    );
  };

  // Rating and review submission
  const handleSubmitReview = (
    crewId: string,
    reviewData: Omit<CrewReview, 'id' | 'createdAt'>
  ) => {
    const newReview: CrewReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Just now',
    };

    setCrewRoster((prev) =>
      prev.map((c) => {
        if (c.id !== crewId) return c;
        const existingReviews = c.reviews || [];
        const updatedReviews = [newReview, ...existingReviews];
        const newTotalCount = (c.totalRatingsCount || existingReviews.length) + 1;
        // Compute updated weighted average rating
        const currentSum = c.rating * (c.totalRatingsCount || existingReviews.length);
        const newAverage = parseFloat(((currentSum + reviewData.rating) / newTotalCount).toFixed(2));

        // Add any newly endorsed skills/tags
        const mergedSkills = Array.from(
          new Set([...(c.topSkills || []), ...reviewData.tags.slice(0, 2)])
        );

        return {
          ...c,
          rating: newAverage,
          totalRatingsCount: newTotalCount,
          reviews: updatedReviews,
          topSkills: mergedSkills,
          reviewedByOrganizer: true,
        };
      })
    );
  };

  // Crew profile for FindWorkView (Rohan Sharma)
  const currentCrewProfile = crewRoster.find((c) => c.id === 'crew-1') || crewRoster[0];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#1b1c1c] flex flex-col font-['Nunito',sans-serif]">
      {/* If Welcome Screen is active, render the exact requested Welcome experience */}
      {showWelcomeScreen ? (
        <div className="relative">
          {/* Quick Demo Navigator Pill in Top Right corner for instant access */}
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 text-white shadow-xl">
            <span className="text-[10px] font-black text-white/80 uppercase px-2">
              Preview Mode:
            </span>
            <button
              onClick={() => {
                sound.playPop();
                handleLoginSuccess('work', '98201 44892');
              }}
              className="bg-[#58CC02] hover:bg-[#52be02] text-white text-xs font-black px-3 py-1.5 rounded-xl border-b-2 border-[#46A302] transition-transform active:translate-y-0.5 cursor-pointer"
            >
              Enter as Crew 👷
            </button>
            <button
              onClick={() => {
                sound.playPop();
                handleLoginSuccess('hire', 'Red Carpet Events');
              }}
              className="bg-[#1CB0F6] hover:bg-[#159edb] text-white text-xs font-black px-3 py-1.5 rounded-xl border-b-2 border-[#1899D6] transition-transform active:translate-y-0.5 cursor-pointer"
            >
              Enter as Organizer 🎪
            </button>
          </div>

          <WelcomeScreen
            onLoginSuccess={handleLoginSuccess}
            initialRole={currentRole}
          />
        </div>
      ) : (
        <>
          {/* Top Return to Login Floating Banner / Demo Switcher */}
          <div className="bg-zinc-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse"></span>
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-300">
                Interactive Preview • EventMate India: Verified Crew, Escrow &amp; Reputation
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-zinc-400 text-[11px]">
                Signed in as: <strong className="text-white">{userIdentifier}</strong>
              </span>
              <button
                onClick={() => {
                  sound.playPop();
                  setShowWelcomeScreen(true);
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white px-3 py-1 rounded-lg text-[11px] font-black border border-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="Return to the original Welcome/Auth screen"
              >
                <span>← Welcome Screen</span>
              </button>
            </div>
          </div>

          {/* Main Navigation Bar */}
          <Navbar
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            onOpenWelcome={() => {
              sound.playPop();
              setShowWelcomeScreen(true);
            }}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            walletBalance={walletBalance}
            onOpenWallet={() => setIsWalletModalOpen(true)}
            userIdentifier={userIdentifier}
            onOpenAntigravity={() => setIsAntigravityModalOpen(true)}
          />

          {/* Main Content View (Find Work vs Hire Crew) */}
          <main className="flex-1 pb-16">
            {currentRole === 'work' ? (
              <FindWorkView
                shifts={shifts}
                activeShift={activeShiftState}
                bookedShiftIds={bookedShiftIds}
                onSelectShift={(shift) => setSelectedShiftForDetails(shift)}
                onOpenClockIn={handleOpenClockInModal}
                onOpenWallet={() => setIsWalletModalOpen(true)}
                selectedCity={selectedCity}
                myProfile={currentCrewProfile}
                onViewMyReputation={() => setCrewToViewReviews(currentCrewProfile)}
              />
            ) : (
              <HireCrewView
                shifts={shifts}
                crewRoster={crewRoster}
                onOpenPostShift={() => setIsPostShiftModalOpen(true)}
                onApproveEscrow={handleApproveEscrow}
                onOpenWallet={() => setIsWalletModalOpen(true)}
                selectedCity={selectedCity}
                onOpenRateCrew={(crew) => setCrewToRate(crew)}
                onViewCrewReviews={(crew) => setCrewToViewReviews(crew)}
              />
            )}
          </main>

          {/* Antigravity Autonomous Event Operations Agent Modal */}
          {isAntigravityModalOpen && (
            <AntigravityModal
              shifts={shifts}
              crewRoster={crewRoster}
              selectedCity={selectedCity}
              onClose={() => setIsAntigravityModalOpen(false)}
            />
          )}

          {/* Shift Details Modal */}
          {selectedShiftForDetails && (
            <ShiftDetailsModal
              shift={selectedShiftForDetails}
              onClose={() => setSelectedShiftForDetails(null)}
              onBookShift={handleBookShift}
              isBooked={bookedShiftIds.includes(selectedShiftForDetails.id)}
            />
          )}

          {/* Geo-Clock In & Shift Timer Modal */}
          {isGeoClockInModalOpen && shiftForGeoClockIn && (
            <GeoClockInModal
              shift={shiftForGeoClockIn}
              activeShift={activeShiftState}
              onClose={() => setIsGeoClockInModalOpen(false)}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          )}

          {/* Escrow Wallet Modal */}
          {isWalletModalOpen && (
            <WalletModal
              balance={walletBalance}
              onClose={() => setIsWalletModalOpen(false)}
              onWithdraw={handleWithdraw}
            />
          )}

          {/* Post Shift Modal for Organizers */}
          {isPostShiftModalOpen && (
            <PostShiftModal
              onClose={() => setIsPostShiftModalOpen(false)}
              onPostShift={handlePostShift}
              defaultCity={selectedCity}
            />
          )}

          {/* Organizer Rate & Review Crew Member Modal */}
          {crewToRate && (
            <ReviewCrewModal
              crew={crewToRate}
              onClose={() => setCrewToRate(null)}
              onSubmitReview={handleSubmitReview}
            />
          )}

          {/* Full Reviews and Reputation History Modal */}
          {crewToViewReviews && (
            <CrewReviewsListModal
              crew={crewToViewReviews}
              onClose={() => setCrewToViewReviews(null)}
              onOpenAddReview={(crew) => {
                setCrewToViewReviews(null);
                setCrewToRate(crew);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

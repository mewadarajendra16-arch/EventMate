export type UserRole = 'hire' | 'work';

export type ShiftCategory = 'all' | 'concerts' | 'corporate' | 'weddings' | 'vip' | 'av';

export interface Shift {
  id: string;
  title: string;
  client: string;
  category: ShiftCategory;
  venue: string;
  city: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hourlyRate: number;
  totalPay: number;
  isSurge: boolean;
  surgeMultiplier?: number;
  spotsTotal: number;
  spotsFilled: number;
  dressCode: string;
  mealsIncluded: boolean;
  aadhaarRequired: boolean;
  escrowStatus: 'locked' | 'disbursed';
  description: string;
  supervisorName: string;
  supervisorPhone: string;
  distanceKm: number;
  geoFenceMeters: number;
  badge: string;
}

export interface ActiveShiftState {
  shiftId: string;
  isClockedIn: boolean;
  clockInTime?: string;
  elapsedSeconds: number;
  earnedAmount: number;
  isGeoVerified: boolean;
  status: 'not_started' | 'clocked_in' | 'completed';
}

export interface CrewReview {
  id: string;
  organizerName: string;
  organizerCompany: string;
  eventName: string;
  shiftDate: string;
  rating: number; // 1 to 5
  punctualityScore: number; // 1 to 5
  workEthicScore: number; // 1 to 5
  communicationScore: number; // 1 to 5
  comment: string;
  tags: string[]; // e.g., 'Lightning Fast Setup', 'Never Slacks', 'Stage Hero'
  verifiedEscrowPayout: boolean;
  createdAt: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  rating: number;
  totalRatingsCount: number;
  completedGigs: number;
  avatar: string;
  level: string;
  aadhaarVerified: boolean;
  digiLockerVerified: boolean;
  status: 'clocked_in' | 'en_route' | 'completed' | 'ready';
  clockInTime?: string;
  distanceMeters: number;
  payoutStatus: 'escrow_locked' | 'released';
  reviews?: CrewReview[];
  topSkills?: string[];
  reviewedByOrganizer?: boolean; // Flag indicating if current organizer submitted a review for this gig
}

export interface OrganizerEvent {
  id: string;
  name: string;
  venue: string;
  city: string;
  date: string;
  crewNeeded: number;
  crewHired: number;
  escrowLocked: number;
  status: 'live' | 'upcoming' | 'completed';
  crewRoster: CrewMember[];
}

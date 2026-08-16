export type UserRole = 'Student' | 'ClubLead' | 'Admin' | 'Gatekeeper';

export interface User {
  id: string;
  rollNumber: string;
  fullName: string;
  email: string;
  branch: string;
  academicYear: number;
  role: UserRole;
  createdAt?: string;
}

export type ClubCategory = 'Technical' | 'Cultural' | 'Sports' | 'Social';

export interface ClubLead {
  name: string;
  role: string;
  email: string;
  avatar: string;
  linkedin?: string;
  github?: string;
}

export interface ClubFAQ {
  question: string;
  answer: string;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  category: ClubCategory;
  description: string;
  tagline: string;
  logoUrl: string;
  bannerUrl: string;
  memberCount: number;
  charterRules: string[];
  leads: ClubLead[];
  faqs: ClubFAQ[];
  achievements?: string[];
  createdAt?: string;
}

export type EventType = 'Solo' | 'Team';

export interface EventScheduleItem {
  time: string;
  activity: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  clubId: string;
  clubName: string;
  category: ClubCategory;
  eventType: EventType;
  price: number; // 0 for free
  maxCapacity: number;
  registeredCount: number;
  eventDate: string; // ISO String or YYYY-MM-DD HH:mm
  endDate?: string;
  venue: string;
  bannerUrl: string;
  rules: string[];
  schedule: EventScheduleItem[];
  judgingCriteria?: string[];
  tags: string[];
  isFeatured?: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  createdAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  isLeader?: boolean;
}

export interface Team {
  id: string;
  teamCode: string; // e.g. SAC-HACK-8392
  teamName: string;
  eventId: string;
  eventTitle: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  members: TeamMember[];
  isFullyPaid: boolean;
  createdAt?: string;
}

export type PaymentStatus = 'Pending' | 'Verified' | 'Rejected';

export interface Registration {
  id: string;
  bookingSerial: string; // SAC-123456
  studentId?: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  branch: string;
  academicYear: number;
  eventId: string;
  eventTitle: string;
  clubName: string;
  eventType: EventType;
  teamId?: string;
  teamCode?: string;
  teamName?: string;
  teamMembers?: TeamMember[];
  amountPaid: number;
  utrNumber: string;
  receiptUrl?: string;
  paymentStatus: PaymentStatus;
  scannedAt?: string | null;
  isCheckedIn: boolean;
  createdAt?: string;
}

export interface ClubMembership {
  id: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  branch: string;
  academicYear: number;
  primaryClubId: string;
  primaryClubName: string;
  secondaryClubId?: string;
  secondaryClubName?: string;
  skillsTags: string[];
  statementOfPurpose: string;
  portfolioUrl?: string;
  status: 'Applicant' | 'Member' | 'Lead';
  createdAt?: string;
}

export interface RoomBooking {
  id: string;
  clubId: string;
  clubName: string;
  bookedBy: string;
  contactEmail: string;
  roomName: 'Auditorium' | 'Seminar Hall' | 'SAC Lounge' | 'Open Amphitheatre';
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  bookingReason: string;
  expectedAttendance: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt?: string;
}

export interface StudentCoordinator {
  id: string;
  name: string;
  roleTitle: string; // e.g. "SAC General Secretary", "Technical Club Lead"
  branch: string;
  academicYear: string;
  clubAffiliation: string;
  sacTenure: string; // e.g. "2025 - 2026"
  avatarUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
  email: string;
  badges: string[];
}

export interface FacultyCoordinator {
  id: string;
  name: string;
  academicTitle: string; // e.g. "Dean of Student Affairs"
  department: string;
  sacRole: string; // e.g. "Chief SAC Patron & Mentor"
  officeLocation: string;
  officeHours: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  advisoryTenure: string;
  bio: string;
  specialization: string;
}

export interface Alumni {
  id: string;
  name: string;
  graduatingYear: number;
  pastSacRole: string;
  currentRole: string;
  company: string;
  domainSkills: string[];
  isHallOfFame: boolean;
  avatarUrl: string;
  linkedinUrl?: string;
  quote?: string;
}

export interface Grievance {
  id: string;
  category: 'Infrastructure' | 'Event Management' | 'Harassment / Safety' | 'General Query';
  subject: string;
  message: string;
  isAnonymous: boolean;
  studentName?: string;
  studentEmail?: string;
  studentRollNumber?: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  createdAt?: string;
}

export interface Announcement {
  id: string;
  tickerText: string;
  category: 'Urgent' | 'Achievement' | 'Reminder';
  link?: string;
  active: boolean;
  createdAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  clubName: string;
  year: number;
  type: 'image' | 'video';
  thumbnailUrl: string;
  videoUrl?: string;
  credits: string;
}

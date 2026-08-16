import {
  db,
  isFirebaseConfigured
} from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import {
  Club,
  Event,
  StudentCoordinator,
  FacultyCoordinator,
  Alumni,
  Announcement,
  RoomBooking,
  Registration,
  Team,
  TeamMember,
  ClubMembership,
  Grievance,
} from './types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_STUDENT_COORDINATORS,
  INITIAL_FACULTY_COORDINATORS,
  INITIAL_ALUMNI,
  INITIAL_ROOM_BOOKINGS,
  INITIAL_REGISTRATIONS,
} from './mockData';
import { generateBookingSerial, generateTeamCode } from './utils';

// In-Memory / LocalStorage cache fallback manager
class LocalStore {
  private static getKey<T>(key: string, initial: T): T {
    if (typeof window === 'undefined') return initial;
    try {
      const stored = localStorage.getItem(`sac_${key}`);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  }

  private static setKey<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`sac_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }

  static getClubs(): Club[] {
    return this.getKey('clubs', INITIAL_CLUBS);
  }

  static saveClubs(clubs: Club[]): void {
    this.setKey('clubs', clubs);
  }

  static getEvents(): Event[] {
    return this.getKey('events', INITIAL_EVENTS);
  }

  static saveEvents(events: Event[]): void {
    this.setKey('events', events);
  }

  static getStudentCoordinators(): StudentCoordinator[] {
    return this.getKey('student_coords', INITIAL_STUDENT_COORDINATORS);
  }

  static saveStudentCoordinators(coords: StudentCoordinator[]): void {
    this.setKey('student_coords', coords);
  }

  static getFacultyCoordinators(): FacultyCoordinator[] {
    return this.getKey('faculty_coords', INITIAL_FACULTY_COORDINATORS);
  }

  static getAlumni(): Alumni[] {
    return this.getKey('alumni', INITIAL_ALUMNI);
  }

  static getAnnouncements(): Announcement[] {
    return this.getKey('announcements', INITIAL_ANNOUNCEMENTS);
  }

  static getRegistrations(): Registration[] {
    return this.getKey('registrations', INITIAL_REGISTRATIONS);
  }

  static saveRegistrations(regs: Registration[]): void {
    this.setKey('registrations', regs);
  }

  static getRoomBookings(): RoomBooking[] {
    return this.getKey('room_bookings', INITIAL_ROOM_BOOKINGS);
  }

  static saveRoomBookings(bookings: RoomBooking[]): void {
    this.setKey('room_bookings', bookings);
  }

  static getTeams(): Team[] {
    return this.getKey('teams', [
      {
        id: 'team-demo-1',
        teamCode: 'SAC-HACK-8392',
        teamName: 'CyberKnights',
        eventId: 'evt-hackfest-2026',
        eventTitle: 'HackMatrix 2026: 36-Hour National Hackathon',
        creatorId: 'user-1',
        creatorName: 'Rohan Patel',
        creatorEmail: 'rohan.patel@student.college.edu',
        isFullyPaid: true,
        members: [
          {
            id: 'mem-1',
            name: 'Rohan Patel',
            email: 'rohan.patel@student.college.edu',
            rollNumber: '22CS089',
            branch: 'Computer Science',
            isLeader: true,
          },
          {
            id: 'mem-2',
            name: 'Karan Mehra',
            email: 'karan.m@student.college.edu',
            rollNumber: '22CS091',
            branch: 'Computer Science',
            isLeader: false,
          }
        ],
        createdAt: new Date().toISOString()
      }
    ]);
  }

  static saveTeams(teams: Team[]): void {
    this.setKey('teams', teams);
  }

  static getMemberships(): ClubMembership[] {
    return this.getKey('memberships', []);
  }

  static saveMemberships(memberships: ClubMembership[]): void {
    this.setKey('memberships', memberships);
  }

  static getGrievances(): Grievance[] {
    return this.getKey('grievances', []);
  }

  static saveGrievances(grievances: Grievance[]): void {
    this.setKey('grievances', grievances);
  }
}

// ----------------------------------------------------
// UNIFIED DATA SERVICE (Firestore + Seamless Local Fallback)
// Firestore calls are wrapped in a 3-second timeout to prevent
// cold-start connection delays from blocking the UI.
// ----------------------------------------------------

const FIRESTORE_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), ms)
    ),
  ]);
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'announcements')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
      }
    } catch (e) {
      console.warn("Firestore fetch announcements fallback:", e);
    }
  }
  return LocalStore.getAnnouncements();
}

export async function fetchClubs(): Promise<Club[]> {
  // Return local data immediately, then try Firestore
  const localData = LocalStore.getClubs();
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'clubs')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Club));
        LocalStore.saveClubs(firestoreData);
        return firestoreData;
      }
    } catch (e) {
      console.warn("Firestore fetch clubs fallback:", e);
    }
  }
  return localData;
}

export async function fetchClubBySlug(slug: string): Promise<Club | null> {
  const clubs = await fetchClubs();
  return clubs.find(c => c.slug === slug || c.id === slug) || null;
}

export async function fetchEvents(): Promise<Event[]> {
  const localData = LocalStore.getEvents();
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'events')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        const firestoreData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Event));
        LocalStore.saveEvents(firestoreData);
        return firestoreData;
      }
    } catch (e) {
      console.warn("Firestore fetch events fallback:", e);
    }
  }
  return localData;
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const events = await fetchEvents();
  return events.find(e => e.id === id) || null;
}

export async function fetchStudentCoordinators(): Promise<StudentCoordinator[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'student_coordinators')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentCoordinator));
      }
    } catch (e) {
      console.warn("Firestore fetch student coords fallback:", e);
    }
  }
  return LocalStore.getStudentCoordinators();
}

export async function fetchFacultyCoordinators(): Promise<FacultyCoordinator[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'faculty_coordinators')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as FacultyCoordinator));
      }
    } catch (e) {
      console.warn("Firestore fetch faculty coords fallback:", e);
    }
  }
  return LocalStore.getFacultyCoordinators();
}

export async function fetchAlumni(): Promise<Alumni[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'alumni')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Alumni));
      }
    } catch (e) {
      console.warn("Firestore fetch alumni fallback:", e);
    }
  }
  return LocalStore.getAlumni();
}

// ----------------------------------------------------
// REGISTRATIONS & UPI PAYMENT
// ----------------------------------------------------

export async function createRegistration(
  data: Omit<Registration, 'id' | 'bookingSerial' | 'createdAt' | 'paymentStatus' | 'isCheckedIn'>
): Promise<Registration> {
  const bookingSerial = generateBookingSerial();
  const newRegistration: Registration = {
    ...data,
    id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingSerial,
    paymentStatus: data.amountPaid === 0 ? 'Verified' : 'Pending',
    isCheckedIn: false,
    scannedAt: null,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'registrations', newRegistration.id), newRegistration);
    } catch (e) {
      console.warn("Firestore save registration fallback:", e);
    }
  }

  const existing = LocalStore.getRegistrations();
  LocalStore.saveRegistrations([newRegistration, ...existing]);
  return newRegistration;
}

export async function fetchRegistrations(): Promise<Registration[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'registrations')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Registration));
      }
    } catch (e) {
      console.warn("Firestore fetch registrations fallback:", e);
    }
  }
  return LocalStore.getRegistrations();
}

export async function findRegistrationBySerial(serial: string): Promise<Registration | null> {
  const normalized = serial.trim().toUpperCase();
  const list = await fetchRegistrations();
  return list.find(r => r.bookingSerial.toUpperCase() === normalized || r.id === normalized) || null;
}

export async function findRegistrationByUtr(utr: string): Promise<Registration | null> {
  const normalized = utr.trim();
  const list = await fetchRegistrations();
  return list.find(r => r.utrNumber === normalized) || null;
}

export async function updatePaymentVerification(id: string, status: 'Verified' | 'Rejected'): Promise<void> {
  if (isFirebaseConfigured() && db) {
    try {
      await updateDoc(doc(db, 'registrations', id), { paymentStatus: status });
    } catch (e) {
      console.warn(e);
    }
  }
  const list = LocalStore.getRegistrations();
  const updated = list.map(r => r.id === id ? { ...r, paymentStatus: status } : r);
  LocalStore.saveRegistrations(updated);
}

export async function checkInTicket(id: string): Promise<{ success: boolean; message: string; registration?: Registration; scannedAt?: string }> {
  const list = await fetchRegistrations();
  const reg = list.find(r => r.id === id || r.bookingSerial.toUpperCase() === id.toUpperCase());

  if (!reg) {
    return { success: false, message: 'Ticket not found in database.' };
  }

  if (reg.paymentStatus !== 'Verified') {
    return {
      success: false,
      message: `Registration payment is currently '${reg.paymentStatus}'. Verification required.`,
      registration: reg
    };
  }

  if (reg.isCheckedIn) {
    return {
      success: false,
      message: `ALREADY CHECKED IN at ${new Date(reg.scannedAt || '').toLocaleTimeString()}`,
      registration: reg,
      scannedAt: reg.scannedAt || undefined,
    };
  }

  const now = new Date().toISOString();
  reg.isCheckedIn = true;
  reg.scannedAt = now;

  if (isFirebaseConfigured() && db) {
    try {
      await updateDoc(doc(db, 'registrations', reg.id), {
        isCheckedIn: true,
        scannedAt: now
      });
    } catch (e) {
      console.warn("Firestore check-in update fallback:", e);
    }
  }

  const allRegs = LocalStore.getRegistrations();
  const updated = allRegs.map(r => r.id === reg.id ? reg : r);
  LocalStore.saveRegistrations(updated);

  return {
    success: true,
    message: 'Check-in confirmed!',
    registration: reg,
    scannedAt: now
  };
}

// ----------------------------------------------------
// TEAM LOBBY & TOKEN MANAGEMENT
// ----------------------------------------------------

export async function createTeamLobby({
  teamName,
  eventId,
  eventTitle,
  creator,
}: {
  teamName: string;
  eventId: string;
  eventTitle: string;
  creator: TeamMember;
}): Promise<Team> {
  const teamCode = generateTeamCode("HACK");
  const newTeam: Team = {
    id: `team-${Date.now()}`,
    teamCode,
    teamName,
    eventId,
    eventTitle,
    creatorId: creator.id,
    creatorName: creator.name,
    creatorEmail: creator.email,
    members: [{ ...creator, isLeader: true }],
    isFullyPaid: false,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'teams', newTeam.id), newTeam);
    } catch (e) {
      console.warn("Firestore create team fallback:", e);
    }
  }

  const currentTeams = LocalStore.getTeams();
  LocalStore.saveTeams([newTeam, ...currentTeams]);
  return newTeam;
}

export async function getTeamByCode(code: string): Promise<Team | null> {
  const normalized = code.trim().toUpperCase();
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'teams'), where('teamCode', '==', normalized));
      const snap = await withTimeout(getDocs(q), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as Team;
      }
    } catch (e) {
      console.warn("Firestore query team fallback:", e);
    }
  }
  const teams = LocalStore.getTeams();
  return teams.find(t => t.teamCode.toUpperCase() === normalized) || null;
}

export async function joinTeamByCode(code: string, newMember: TeamMember): Promise<{ success: boolean; team?: Team; error?: string }> {
  const team = await getTeamByCode(code);
  if (!team) {
    return { success: false, error: 'Team code not found. Please double-check with your team leader.' };
  }

  if (team.members.some(m => m.rollNumber.toLowerCase() === newMember.rollNumber.toLowerCase() || m.email.toLowerCase() === newMember.email.toLowerCase())) {
    return { success: false, error: 'You are already registered in this team lobby.' };
  }

  if (team.members.length >= 4) {
    return { success: false, error: 'Team is already at maximum capacity (4 members).' };
  }

  team.members.push({ ...newMember, isLeader: false });

  if (isFirebaseConfigured() && db) {
    try {
      await updateDoc(doc(db, 'teams', team.id), {
        members: team.members,
      });
    } catch (e) {
      console.warn("Firestore team update fallback:", e);
    }
  }

  const allTeams = LocalStore.getTeams();
  const updated = allTeams.map(t => t.id === team.id ? team : t);
  LocalStore.saveTeams(updated);

  return { success: true, team };
}

// ----------------------------------------------------
// ONBOARDING WIZARD (MEMBERSHIPS)
// ----------------------------------------------------

export async function submitClubMembership(
  data: Omit<ClubMembership, 'id' | 'createdAt' | 'status'>
): Promise<ClubMembership> {
  const record: ClubMembership = {
    ...data,
    id: `mem-${Date.now()}`,
    status: 'Applicant',
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'club_memberships', record.id), record);
    } catch (e) {
      console.warn("Firestore submit membership fallback:", e);
    }
  }

  const all = LocalStore.getMemberships();
  LocalStore.saveMemberships([record, ...all]);
  return record;
}

export async function fetchClubMemberships(): Promise<ClubMembership[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'club_memberships')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClubMembership));
      }
    } catch (e) {
      console.warn("Firestore fetch memberships fallback:", e);
    }
  }
  return LocalStore.getMemberships();
}

// ----------------------------------------------------
// ROOM BOOKINGS & CONFLICT CHECKER
// ----------------------------------------------------

export async function fetchRoomBookings(): Promise<RoomBooking[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'room_bookings')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as RoomBooking));
      }
    } catch (e) {
      console.warn("Firestore fetch room bookings fallback:", e);
    }
  }
  return LocalStore.getRoomBookings();
}

export async function checkRoomSlotConflict(
  roomName: string,
  bookingDate: string,
  startTime: string,
  endTime: string
): Promise<{ hasConflict: boolean; conflictingBooking?: RoomBooking }> {
  const bookings = await fetchRoomBookings();
  const approvedOrPending = bookings.filter(
    b => b.roomName === roomName && b.bookingDate === bookingDate && b.status !== 'Rejected'
  );

  const newStartMinutes = timeToMinutes(startTime);
  const newEndMinutes = timeToMinutes(endTime);

  for (const b of approvedOrPending) {
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);

    // Overlap condition: (StartA < EndB) and (EndA > StartB)
    if (newStartMinutes < bEnd && newEndMinutes > bStart) {
      return { hasConflict: true, conflictingBooking: b };
    }
  }

  return { hasConflict: false };
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export async function createRoomBooking(
  data: Omit<RoomBooking, 'id' | 'createdAt' | 'status'>
): Promise<{ success: boolean; booking?: RoomBooking; error?: string }> {
  const conflict = await checkRoomSlotConflict(
    data.roomName,
    data.bookingDate,
    data.startTime,
    data.endTime
  );

  if (conflict.hasConflict && conflict.conflictingBooking) {
    return {
      success: false,
      error: `Conflict detected! ${conflict.conflictingBooking.clubName} has already reserved ${data.roomName} on this date from ${conflict.conflictingBooking.startTime} to ${conflict.conflictingBooking.endTime}.`
    };
  }

  const newBooking: RoomBooking = {
    ...data,
    id: `rb-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'room_bookings', newBooking.id), newBooking);
    } catch (e) {
      console.warn("Firestore create booking fallback:", e);
    }
  }

  const all = LocalStore.getRoomBookings();
  LocalStore.saveRoomBookings([newBooking, ...all]);
  return { success: true, booking: newBooking };
}

// ----------------------------------------------------
// GRIEVANCES (ANONYMOUS OR CREDENTIALED)
// ----------------------------------------------------

export async function submitGrievance(
  data: Omit<Grievance, 'id' | 'createdAt' | 'status'>
): Promise<Grievance> {
  const grievance: Grievance = {
    ...data,
    // Zero out PII if anonymous
    studentName: data.isAnonymous ? undefined : data.studentName,
    studentEmail: data.isAnonymous ? undefined : data.studentEmail,
    studentRollNumber: data.isAnonymous ? undefined : data.studentRollNumber,
    id: `grv-${Date.now()}`,
    status: 'Open',
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, 'grievances', grievance.id), grievance);
    } catch (e) {
      console.warn("Firestore submit grievance fallback:", e);
    }
  }

  const all = LocalStore.getGrievances();
  LocalStore.saveGrievances([grievance, ...all]);
  return grievance;
}

export async function fetchGrievances(): Promise<Grievance[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'grievances')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Grievance));
      }
    } catch (e) {
      console.warn("Firestore fetch grievances fallback:", e);
    }
  }
  return LocalStore.getGrievances();
}

// ----------------------------------------------------
// CMS MUTATIONS (Admin Dashboard)
// ----------------------------------------------------

import { deleteDoc } from 'firebase/firestore';

export async function saveClub(club: Club): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot save Club to remote server. Check .env configuration.");
  }
  await setDoc(doc(db, 'clubs', club.id), club);
}

export async function deleteClub(id: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot delete Club from remote server.");
  }
  await deleteDoc(doc(db, 'clubs', id));
}

export async function saveEvent(evt: Event): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot save Event to remote server.");
  }
  await setDoc(doc(db, 'events', evt.id), evt);
}

export async function deleteEvent(id: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot delete Event from remote server.");
  }
  await deleteDoc(doc(db, 'events', id));
}

export async function saveStudentCoordinator(coord: StudentCoordinator): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot save Board Member to remote server.");
  }
  await setDoc(doc(db, 'student_coordinators', coord.id), coord);
}

export async function deleteStudentCoordinator(id: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot delete Board Member from remote server.");
  }
  await deleteDoc(doc(db, 'student_coordinators', id));
}

// ----------------------------------------------------
// GALLERY CRUD
// ----------------------------------------------------

import { GalleryItem } from './types';

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await withTimeout(getDocs(collection(db, 'gallery')), FIRESTORE_TIMEOUT_MS);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
      }
    } catch (e) {
      console.warn("Firestore fetch gallery fallback:", e);
    }
  }
  return [];
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot save Gallery item to remote server.");
  }
  await setDoc(doc(db, 'gallery', item.id), item);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot delete Gallery item from remote server.");
  }
  await deleteDoc(doc(db, 'gallery', id));
}

// ----------------------------------------------------
// ALUMNI CRUD
// ----------------------------------------------------

export async function saveAlumni(alumni: Alumni): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot save Alumni to remote server.");
  }
  await setDoc(doc(db, 'alumni', alumni.id), alumni);
}

export async function deleteAlumni(id: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Live Database Not Connected: Cannot delete Alumni from remote server.");
  }
  await deleteDoc(doc(db, 'alumni', id));
}

// ----------------------------------------------------
// IMAGE UPLOAD (Firebase Storage)
// ----------------------------------------------------

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadImage(file: File, path: string): Promise<string> {
  if (!isFirebaseConfigured() || !storage) {
    throw new Error("Live Database Not Connected: Cannot upload image to remote server.");
  }
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

# Technical Specification & System Architecture
## Project: College Student Activity Center (SAC) Web Portal
**Theme Vibe:** "Formal Finesse" (Deep Midnight Navy background, elegant glassmorphism, responsive golden & cyber-cyan accents)
**Target Environment:** Next.js 15, Tailwind CSS, TypeScript, Supabase (PostgreSQL), and Google Workspace (Apps Script + Sheets)

---

## 1. Directory Structure

This is the standard sitemap structure to be scaffolded within the Next.js `/src` directory:

```text
/src
├── /components
│   ├── Navbar.tsx             # Floating glassmorphic header with navigation links
│   ├── Footer.tsx             # Layout footer with quick links & social icons
│   ├── EventCard.tsx          # 3D interactive tilt event card (Framer Motion)
│   ├── AnnouncementBanner.tsx # Dynamic marquee banner for live portal updates
│   └── VideoOverlay.tsx       # Framer Motion responsive video lightbox modal
├── /app
│   ├── page.tsx               # Home Page: Banner carousel, calendar, and announcements
│   ├── layout.tsx             # Root Layout with Tailwind configuration
│   ├── /clubs
│   │   ├── page.tsx           # Clubs & Committees Directory
│   │   └── /[clubId]          # Individual Club Landing Workspace
│   ├── /events
│   │   ├── page.tsx           # Unified Events Hub (Advanced Filter & Search)
│   │   ├── /[eventId]         # Dynamic Single Event Workspace (Solo/Team)
│   │   └── /register          # Registration, Dynamic UPI Bridge, & Upload
│   ├── /team
│   │   ├── page.tsx           # Meet the Board: Student Coordinators & Faculty Mentors
│   │   └── /manage            # Interactive Team Lobby & Team Code Builder
│   ├── /alumni
│   │   └── page.tsx           # Alumni Wall of Fame, Mentorship & Giving Desk
│   ├── /join
│   │   └── page.tsx           # "Join as Member" Multiphase Onboarding Wizard
│   ├── /rules
│   │   └── page.tsx           # SOPs, Rules & Interactive Room Booking Calendar
│   ├── /contact
│   │   └── page.tsx           # Feedbacks, Anonymous Grievances & Emergency Helpdesk
│   └── /sac-admin
│       ├── scan               # Real-time QR Gatekeeper Scanner Route
│       └── dashboard          # Admin Control Center (Database Verification Table)
```

---

## 2. Page-by-Page Technical Specifications

### A. Home Page (`/app/page.tsx`)
*   **Hero Carousel**: Auto-rotating card display utilizing Framer Motion's `AnimatePresence`. Showcases high-res cover templates for upcoming college-wide events with smooth swipe/slide interactions.
*   **Live Interactive Calendar**: Shows active monthly events. Hovering over active calendar cells scales the element slightly (`scale-105`) and triggers a tool-tip with event times. Clicking a cell opens a responsive drawer component listing club host names and registration links.
*   **Dynamic Announcement Marquee**: An infinite horizontal CSS marquee rendering real-time tickers (e.g., *"🏆 Technical Club wins National Hackathon!"* or *"⚠️ Hackfest registrations close in 3 hours!"*).

### B. Clubs & Committees Directory (`/app/clubs`)
*   **Main List Page (`/clubs/page.tsx`)**: 
    *   Filters technical, cultural, sports, and social clubs using state-based tabs.
    *   Interactive cards use dynamic 3D perspective hover effects (manipulating Tailwind's `perspective-1000` and Framer Motion's `useMotionValue` for coordinate shifts).
*   **Individual Club Landing (`/clubs/[clubId]/page.tsx`)**:
    *   **Meet the Board Section**: Shows glassmorphic profile cards of leads, exposing social anchors on hover.
    *   **Club Charter Board**: Displays a clean, code-block styled panel explaining active projects, club goals, and attendance rules.
    *   **Accordion FAQs**: Animated dropdown panel built using Framer Motion's `animate={{ height: isOpen ? "auto" : 0 }}` for answering common recruitment questions.

### C. Unified Events Hub (`/app/events`)
*   **Events Search Dashboard (`/events/page.tsx`)**:
    *   Responsive control center to search, sort, and filter events simultaneously by Club Type (Technical/Cultural/Sports), Registration Price (Free/Paid), and Style (Solo/Team).
    *   Exposes visual progress bars on limited-capacity events to denote remaining ticket counts.
*   **Single Event Details Workspace (`/events/[eventId]/page.tsx`)**:
    *   Split-screen visual layout. 
    *   **Left-Panel**: Displays rules, timeline schedules, judging criteria, and map elements showing the campus venue.
    *   **Right-Panel (Form Routing)**: Determines whether the event requires a Solo or Team registration. Swaps fields dynamically based on the event configuration schema.

### D. Registration & UPI Payment Bridge (`/app/events/register`)
*   **Form Collection**: Captures name, email, roll number, department, academic year, and team configurations.
*   **Dynamic UPI QR Code**: Generates a deep-linked merchant UPI QR code dynamically in React using native canvas rendering:
    ```text
    upi://pay?pa=sac.college@okbiz&pn=STUDENT_ACTIVITY_CENTER&am={EVENT_PRICE}&cu=INR&tn=SAC-{ORDER_REF}
    ```
    This automatically locks the payment account, description, and exact price to prevent user modifications during transaction checkouts.
*   **Verification Upload**: Requires the student to enter their 12-digit transaction UTR reference number or drag-and-drop a payment confirmation screenshot for administrative audit checks.

### E. Team & Board Directory Page (`/app/team/page.tsx`)
*   **The Hierarchical Flow**: To emphasize student leadership while maintaining administrative guidance, the page is strictly ordered to showcase **Student Coordinators first**, followed by **Faculty Coordinators / Teachers second**.
*   **Section 1: Student Coordinators (Primary Display)**:
    *   **Focus**: Highlights Student President, General Secretaries, Joint Secretaries, and individual Club Presidents/Leads.
    *   **Visual Style**: Sleek, medium-sized glassmorphic cards with subtle **cyan shadows** (`hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]`).
    *   **Aesthetics**: Interactive hover cards using Framer Motion's `whileHover={{ y: -8 }}` transition. On hover, a gradient cyan underline expands, and interactive social icons (LinkedIn, GitHub, Email) fade in.
    *   **Metadata**: Displays the student's name, role title (e.g., *"Technical General Secretary"*), branch/year, active club affiliation, and a tiny tag indicating active SAC tenure.
*   **Section 2: Faculty Coordinators & Mentors (Secondary Display)**:
    *   **Focus**: Displays the Patron/Dean of Student Affairs, Faculty Advisors, and Head of Departments.
    *   **Visual Style**: Standardized, elegant cards with a refined **gold border** layout (`hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]`).
    *   **Aesthetics**: Polished and formal. Uses fading transitions. On click, it displays an overlay modal detailing their advisory tenure, office hours, and university email.
    *   **Metadata**: Displays academic titles (e.g., *"Dr. Amit Sharma, Dean of Student Affairs"*), department, advisory role within SAC, and contact office coordinates.

### F. Interactive Team Lobby (`/app/team/manage`)
*   **Create Team Flow**: Clicking "Generate Team Code" initiates a PostgreSQL transaction generating a unique, secure 8-character token (e.g., `SAC-HACK-8392`).
*   **Join Team Flow**: Collaborators paste the shared code. The UI dynamically populates empty participant cards with the new user's credentials in real-time, displaying their verified statuses side-by-side using active web socket subscriptions (or Supabase Realtime).

### G. "Join as Member" Onboarding Wizard (`/app/join`)
*   **A multi-step setup wizard tracking progressive onboarding**:
    *   **Step 1**: Personal profiles & academic details.
    *   **Step 2**: Specialized skill checkboxes mapping vectors (e.g., `Full-Stack Dev`, `Graphic Designer`, `Event Logistics`, `Content Writing`).
    *   **Step 3**: Club selections in order of priority.
*   **Data Sink**: Populates candidate tables directly accessible by Club Leads for team recruitment search queries.

### H. Media Gallery (`/app/gallery`)
*   **Masonry Image Grid**: Responsive, staggered CSS column grid with hover scaling and smooth overlay reveals showing event name, metadata, and photography credits.
*   **Filtering**: Floating glass pill buttons filtering resources on-the-fly by academic calendar year, host club, or type (Image/Video).
*   **Video Lightbox Overlay**: An intuitive modal that displays video files natively with clean transition states and ambient backdrop-blur.

### I. Alumni Network & Wall of Fame (`/app/alumni`)
*   **Hall of Fame Slider**: Highlights top-tier past presidents, mentors, and industry-placed alumni using glowing border cards.
*   **Mentor Directory**: Clean, searchable tabular registry displaying company tags (e.g., *Google, Microsoft, Stripe*) and domain skills. Includes a button invoking instant mentorship request templates.
*   **Alumni Portal**: Exposes features to request "VIP Fest Passes" and a custom secure widget for sponsoring active SAC projects.

### J. Rules & Interactive Room Booking Hub (`/app/rules`)
*   **SOP Directory**: File-card layout for downloading templates (e.g., budget sheets, permission PDFs, event posters).
*   **Interactive Room Booking**: Fully responsive calendar grid displaying space availability (Auditorium, Seminar Hall, SAC Lounge). Leads select date/time slots, instantly checking DB bounds to prevent overlapping reservation requests.

### K. Contact & Anonymous Grievances (`/app/contact`)
*   **Interactive Form**: Standard support messaging fields. Includes a toggle to switch the submission type to "Anonymous", which completely zeroes out email and roll-number properties before database insertion to protect student privacy.
*   **Emergency Board**: Top-priority floating neon-red card showing direct on-campus security, emergency response, and helpline coordinates during major events.

### L. Real-Time Gate Scanner (`/app/sac-admin/scan`)
*   An administrative route restricted by middleware session checks.
*   Uses `html5-qrcode` to lock camera focus and parse verified tickets. Integrates API requests returning distinct visual indicator screens:
    *   🟩 **GREEN State**: Valid entry. Renders student name, ticket ID, and checklist verification, calling a checkout timestamp update.
    *   🟥 **RED State**: Duplicate ticket scanned. Displays clear "ALREADY CHECKED IN" alert featuring the exact timestamp of original entry to prevent fraudulent pass sharing.
    *   🟧 **ORANGE State**: Invalid QR reference / Ticket not found.

---

## 3. Database Architecture (Supabase / PostgreSQL)

Run this SQL query in your Supabase SQL Editor to establish the relational tables, constraints, and automatic triggers:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    academic_year INT NOT NULL,
    role VARCHAR(50) DEFAULT 'Student', -- 'Student', 'ClubLead', 'Admin', 'Gatekeeper'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. CLUBS TABLE
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Technical', 'Cultural', 'Sports', 'Social'
    description TEXT,
    logo_url TEXT,
    charter_rules TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. EVENTS TABLE
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'Solo', 'Team'
    price DECIMAL(10, 2) DEFAULT 0.00,
    max_capacity INT,
    registered_count INT DEFAULT 0,
    event_date TIMESTAMP NOT NULL,
    venue VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. TEAMS TABLE (For team events)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_code VARCHAR(100) UNIQUE NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id),
    is_fully_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. REGISTRATIONS TABLE
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    utr_number VARCHAR(100) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Verified', 'Rejected'
    scanned_at TIMESTAMP DEFAULT NULL, -- Track check-in time
    is_checked_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. CLUB MEMBERSHIPS
CREATE TABLE club_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    skills_tags TEXT[], -- Array of strings (e.g. ['Frontend', 'UI/UX'])
    status VARCHAR(50) DEFAULT 'Applicant', -- 'Applicant', 'Member', 'Lead'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. ROOM BOOKINGS
CREATE TABLE room_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    room_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    booking_reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index structures for optimized queries
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_registrations_utr ON registrations(utr_number);
CREATE INDEX idx_teams_code ON teams(team_code);
```

---

## 4. Google Workspace & Apps Script Ticket Automation

Deploy this codebase inside Google Sheets (**Extensions > Apps Script**). It automatically links a central Google Sheet audit record to Google Slides template components, generating a PDF containing a custom QR and sending it directly to the student's email on admin approval.

```javascript
// Global configuration variables
const MASTER_SHEET_NAME = "Form responses 1";
const GOOGLE_SLIDE_TEMPLATE_ID = "YOUR_SLIDE_TEMPLATE_DOCUMENT_ID";
const ARCHIVE_DRIVE_FOLDER_ID = "YOUR_DRIVE_OUTPUT_FOLDER_ID";

/**
 * Creates custom spreadsheet actions menu
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🎟️ SAC Operations")
    .addItem("Approve & Dispatch PDF Ticket", "processSingleVerification")
    .addToUi();
}

/**
 * Validates, maps data, generates QR, compiles PDF, and dispatches email
 */
function processSingleVerification() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const targetSheet = activeSpreadsheet.getSheetByName(MASTER_SHEET_NAME);
  const selectedCell = targetSheet.getActiveCell();
  const currentRow = selectedCell.getRow();
  
  if (currentRow < 2) {
    SpreadsheetApp.getUi().alert("Please select a valid row containing student data!");
    return;
  }
  
  // Extract horizontal row data array
  const columnsCount = targetSheet.getLastColumn();
  const rowDataset = targetSheet.getRange(currentRow, 1, 1, columnsCount).getValues()[0];
  
  // Spreadsheet index coordinates (Zero-indexed column arrays)
  const studentName = rowDataset[1];       // Col B
  const studentEmail = rowDataset[2];      // Col C
  const rollNumber = rowDataset[3];        // Col D
  const branchName = rowDataset[4];        // Col E
  const utrReference = rowDataset[5];      // Col F
  const paymentVerification = rowDataset[6]; // Col G ("Verified")
  
  if (paymentVerification !== "Verified") {
    SpreadsheetApp.getUi().alert("This record must be flagged as 'Verified' before dispatching a ticket!");
    return;
  }
  
  // Retrieve or generate unique ticketing reference alphanumeric serial
  let bookingSerial = targetSheet.getRange(currentRow, 8).getValue(); // Col H
  if (!bookingSerial) {
    bookingSerial = "SAC-" + Math.floor(100000 + Math.random() * 900000);
    targetSheet.getRange(currentRow, 8).setValue(bookingSerial);
  }
  
  // 1. Instantiates localized template copy inside target output Drive folder
  const sourceTemplateFile = DriveApp.getFileById(GOOGLE_SLIDE_TEMPLATE_ID);
  const targetDestinationFolder = DriveApp.getFolderById(ARCHIVE_DRIVE_FOLDER_ID);
  const copiedTemplate = sourceTemplateFile.makeCopy(bookingSerial + " - " + studentName, targetDestinationFolder);
  const activeSlidePresentation = SlidesApp.openById(copiedTemplate.getId());
  const masterSlide = activeSlidePresentation.getSlides()[0];
  
  // 2. Swaps literal brackets parsing dynamic tags
  masterSlide.replaceAllText("{{Name}}", studentName);
  masterSlide.replaceAllText("{{Branch}}", branchName);
  masterSlide.replaceAllText("{{RollNumber}}", rollNumber);
  masterSlide.replaceAllText("{{SerialNumber}}", bookingSerial);
  masterSlide.replaceAllText("{{Date}}", Utilities.formatDate(new Date(), "GMT+5:30", "dd-MM-yyyy"));
  
  // 3. QR Generation: Encodes the booking reference ID into a 200x200 pixel QR image
  const apiQrEndpoint = "https://quickchart.io/qr?text=" + encodeURIComponent(bookingSerial) + "&size=200";
  const qrImageBlob = UrlFetchApp.fetch(apiQrEndpoint).getBlob();
  
  // 4. Locates marker graphic or inserts directly on slide template
  const placeholders = masterSlide.getImages();
  let markerFound = false;
  for (let i = 0; i < placeholders.length; i++) {
    const desc = placeholders[i].getDescription();
    if (desc && desc.toUpperCase() === "QR_CODE_PLACEHOLDER") {
      placeholders[i].replace(qrImageBlob);
      markerFound = true;
      break;
    }
  }
  
  // Fallback: If no placeholder image is found with that description, insert QR in bottom corner
  if (!markerFound) {
    masterSlide.insertImage(qrImageBlob, 50, 50, 150, 150);
  }
  
  activeSlidePresentation.saveAndClose();
  
  // 5. Converts slide template to standalone PDF Blob
  const exportedPdfBlob = copiedTemplate.getAs(MimeType.PDF);
  exportedPdfBlob.setName("Ticket_" + bookingSerial + ".pdf");
  
  // 6. Emails PDF to the student
  MailApp.sendEmail({
    to: studentEmail,
    subject: "🎟️ Verified: Your SAC College Entry Pass - " + bookingSerial,
    body: "Hello " + studentName + ",\n\nYour payment transaction reference (" + utrReference + ") is verified. Attached is your digital entrance pass.\n\nGatekeeping Scanner details:\n1. Keep this PDF downloaded or printed.\n2. Do not share your unique QR or reference number.\n\nWarm regards,\nStudent Activity Center (SAC) Organising Committee",
    attachments: [exportedPdfBlob]
  });
  
  // Clean up temporary template Slide file to keep Drive storage clean
  copiedTemplate.setTrashed(true);
  
  // Write confirmation to sheet
  targetSheet.getRange(currentRow, 9).setValue("Delivered"); // Col I
  SpreadsheetApp.getUi().alert("Email dispatched successfully to: " + studentName);
}
```

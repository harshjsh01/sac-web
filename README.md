# 🎓 ECB SAC — Student Activity Center Web Portal

A modern, full-stack web portal for the **Student Activity Center (SAC)** of ECB, built with **Next.js 15**, **Firebase**, and **Tailwind CSS**. Features a complete CMS, event management, club directory, and more.

![TypeScript](https://img.shields.io/badge/TypeScript-98.1%25-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=nextdotjs)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Storage-orange?style=flat-square&logo=firebase)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)

---

## ✨ Features

### 🌐 Public Pages
- **Home** — Hero carousel, dynamic stats, upcoming events, interactive calendar
- **Clubs & Committees** — Browse all clubs with categories, leads, and FAQs
- **Events Hub** — Explore events, register with UPI payments, team formation
- **Meet the Board** — Student coordinators and faculty advisors
- **Gallery** — Photo & video archives with filtering
- **Alumni Wall of Fame** — Alumni directory with mentorship requests
- **Join SAC** — Multi-step membership application wizard
- **Contact** — Grievance submission (anonymous or credentialed)

### 🔐 Admin CMS (`/sac-admin/dashboard`)
Full GUI-based content management system — no code editing required:
- **Clubs** — Create, edit, delete clubs with image upload
- **Events** — Manage events with schedule builder and featured toggle
- **Board Members** — Manage student coordinators with photo upload
- **Gallery** — Add/remove photos and videos with thumbnail upload
- **Alumni** — Manage alumni entries with profile photo upload
- **Contact Submissions** — View all grievances/queries (read-only)
- **Join SAC Applications** — View all membership applications (read-only)

### 💳 Payment & Gate System
- **Payment Verification** (`/sac-admin/payments`) — Verify/reject UTR payments
- **QR Gate Scanner** (`/sac-admin/scan`) — Scan event tickets for check-in

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Firebase Firestore |
| **Storage** | Firebase Storage (image uploads) |
| **Auth** | Firebase Auth |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore and Storage enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/harshjsh01/sac-web.git
cd sac-web

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── clubs/              # Club directory & detail pages
│   ├── events/             # Events listing, detail & registration
│   ├── gallery/            # Photo & video gallery
│   ├── alumni/             # Alumni wall of fame
│   ├── team/               # Meet the board
│   ├── join/               # Membership application
│   ├── contact/            # Contact / grievance form
│   └── sac-admin/          # Admin CMS, payments, gate scanner
├── components/             # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── EventCard.tsx
│   ├── CalendarView.tsx
│   └── ...
└── lib/                    # Core logic & services
    ├── firebase.ts         # Firebase initialization
    ├── firestoreService.ts # All CRUD operations & image upload
    ├── types.ts            # TypeScript interfaces
    ├── mockData.ts         # Seed/fallback data
    └── utils.ts            # Utility functions
```

---

## 📊 Admin Access

Navigate to `/sac-admin` to access the admin panel. The dashboard provides a complete GUI to manage all website content directly through the browser — all changes are saved to Firebase in real-time.

---

## 📄 License

This project is proprietary to **ECB Student Activity Center**.

---

Built with ❤️ by [Harsh Joshi](https://github.com/harshjsh01)

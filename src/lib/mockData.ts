import {
  Club,
  Event,
  StudentCoordinator,
  FacultyCoordinator,
  Alumni,
  Announcement,
  RoomBooking,
  Registration
} from './types';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    tickerText: '🏆 Turing Tech Club secures 1st Place at National Smart India Hackathon 2026!',
    category: 'Achievement',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-2',
    tickerText: '⚠️ Registrations for Annual Flagship Hackfest closing soon! Grab your team slots.',
    category: 'Urgent',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-3',
    tickerText: '🎭 "Dhwani" Cultural Night auditions scheduled for this Friday at Open Amphitheatre.',
    category: 'Reminder',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-4',
    tickerText: '⚽ Inter-Departmental Futsal Championship draws are now live on the Sports board!',
    category: 'Achievement',
    active: true,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_CLUBS: Club[] = [
  {
    id: 'club-code-crafters',
    slug: 'code-crafters',
    name: 'CodeCrafters Technical Society',
    category: 'Technical',
    tagline: 'Architecting Digital Realities & Open Source Systems',
    description: 'The premier computer science and engineering collective driving hackathons, competitive programming, AI research labs, and open source development across campus.',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    memberCount: 240,
    charterRules: [
      'Active contribution to at least one semester project is mandatory.',
      'Maintain minimum 75% attendance in weekend hands-on build sprints.',
      'Strict adherence to open-source licensing and peer review guidelines.',
      'Zero-tolerance policy on plagiarism during competitive hackathons.'
    ],
    leads: [
      {
        name: 'Aarav Sharma',
        role: 'President & AI Lead',
        email: 'aarav.sharma@college.edu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      },
      {
        name: 'Ananya Verma',
        role: 'Vice President (Full-Stack)',
        email: 'ananya.v@college.edu',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com'
      }
    ],
    faqs: [
      {
        question: 'Do I need prior competitive coding experience to join?',
        answer: 'Not at all! We host structured novice tracks for first-year students and intermediate dev sprints for seasoned coders.'
      },
      {
        question: 'How are project teams formed?',
        answer: 'Members form cross-functional pods during our bi-weekly Demo Days matching frontend, backend, and AI specialists.'
      }
    ],
    achievements: ['Won 14 National Hackathons in 2025', 'Built the Campus Attendance & Bus Tracker API']
  },
  {
    id: 'club-dhwani',
    slug: 'dhwani-cultural',
    name: 'Dhwani Cultural & Fine Arts Guild',
    category: 'Cultural',
    tagline: 'Resonating Rhythm, Drama, Heritage & Artistic Expression',
    description: 'Home to dancers, vocalists, theatrical performers, and digital visual artists orchestrating the annual inter-collegiate fest and vibrant cultural evenings.',
    logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
    memberCount: 310,
    charterRules: [
      'Audition rounds are held at the start of each academic semester.',
      'Performers must log rehearsal hours in the SAC logbook.',
      'Respectful treatment of musical instruments and auditorium acoustic gear is mandatory.'
    ],
    leads: [
      {
        name: 'Rohan Mehra',
        role: 'Guild Secretary & Lead Vocalist',
        email: 'rohan.mehra@college.edu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        linkedin: 'https://linkedin.com'
      },
      {
        name: 'Kavya Pillai',
        role: 'Choreography Lead',
        email: 'kavya.p@college.edu',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
        linkedin: 'https://linkedin.com'
      }
    ],
    faqs: [
      {
        question: 'Can non-performers join Dhwani?',
        answer: 'Yes! We have dedicated teams for stage management, lighting, audio engineering, and costume design.'
      }
    ],
    achievements: ['Best College Troupe - State Cultural Fest 2025', 'Produced 3 original theatre plays']
  },
  {
    id: 'club-stride',
    slug: 'stride-athletics',
    name: 'Stride Sports & Athletics Union',
    category: 'Sports',
    tagline: 'Fostering Grit, Athletic Prowess & Team Spirit',
    description: 'Empowering athletes across football, basketball, cricket, badminton, table tennis, and esports with coaching camps, league tourneys, and fitness drives.',
    logoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1200&auto=format&fit=crop&q=80',
    memberCount: 195,
    charterRules: [
      'Daily morning conditioning sessions for varsity squad members.',
      'Compulsory sportsmanship pledge and anti-doping compliance.',
      'Proper athletic gear required on all indoor courts.'
    ],
    leads: [
      {
        name: 'Vikramaditya Singh',
        role: 'Sports Secretary & Football Captain',
        email: 'vikram.singh@college.edu',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        linkedin: 'https://linkedin.com'
      }
    ],
    faqs: [
      {
        question: 'Are there intra-college recreational leagues?',
        answer: 'Yes, we run weekend premier leagues in futsal, box cricket, and volleyball open to all students.'
      }
    ],
    achievements: ['Inter-University Basketball Champions 2025', 'Gold Medal in 4x100m Athletics Relay']
  },
  {
    id: 'club-ecosphere',
    slug: 'ecosphere-social',
    name: 'EcoSphere & Social Impact Cell',
    category: 'Social',
    tagline: 'Empowering Communities, Green Tech & Social Welfare',
    description: 'Dedicated to sustainable campus initiatives, rural education outreach, blood donation drives, and ethical technology solutions.',
    logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&auto=format&fit=crop&q=80',
    memberCount: 160,
    charterRules: [
      'Minimum 20 volunteer hours per semester for active badge certification.',
      'Organize monthly green drives and waste segregation audits.'
    ],
    leads: [
      {
        name: 'Sneha Kulkarni',
        role: 'Impact Director',
        email: 'sneha.k@college.edu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        linkedin: 'https://linkedin.com'
      }
    ],
    faqs: [
      {
        question: 'Do volunteers receive recognized certificates?',
        answer: 'Yes, certified volunteer hours are validated directly by the Student Activity Center Dean.'
      }
    ],
    achievements: ['Planted 1,200 saplings on campus in 2025', 'Collected 400+ units of blood during Annual Blood Camp']
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-hackfest-2026',
    title: 'HackMatrix 2026: 36-Hour National Hackathon',
    shortDescription: 'Build next-gen AI, Web3, and IoT solutions with industry mentors and win from an INR 1,50,000 cash pool.',
    description: 'Join the biggest collegiate hackathon of the season! HackMatrix brings together 500+ builders, designers, and innovators to solve critical problems across FinTech, HealthTech, AI Automation, and Open Social Innovation. Complete with cloud credits, swag kits, free midnight meals, and direct recruiter interviews.',
    clubId: 'club-code-crafters',
    clubName: 'CodeCrafters Technical Society',
    category: 'Technical',
    eventType: 'Team',
    price: 300,
    maxCapacity: 120, // 120 teams
    registeredCount: 84,
    eventDate: '2026-09-12T09:00:00.000Z',
    endDate: '2026-09-13T21:00:00.000Z',
    venue: 'SAC Main Auditorium & Computing Lab 4',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    minTeamSize: 2,
    maxTeamSize: 4,
    rules: [
      'Teams must comprise 2 to 4 registered university students.',
      'All code repositories must be initiated fresh upon the start bell; pre-built proprietary software will lead to immediate disqualification.',
      'Teams must submit project repos with detailed README, architecture diagrams, and working live demos before the final buzzer.',
      'Participants must bring college ID cards and valid registration passes for venue check-in.'
    ],
    schedule: [
      { time: '09:00 AM (Day 1)', activity: 'Check-in, Security Verification & Swag Kit Distribution' },
      { time: '11:00 AM (Day 1)', activity: 'Opening Keynote & Problem Statements Release' },
      { time: '12:00 PM (Day 1)', activity: 'Hacking Commences (Round 1 Ideation)' },
      { time: '08:00 PM (Day 1)', activity: 'Mentorship Checkpoint & Dinner' },
      { time: '02:00 AM (Day 2)', activity: 'Midnight Gaming & Pizza Break' },
      { time: '04:00 PM (Day 2)', activity: 'Final Code Freeze & Demo Submissions' },
      { time: '06:30 PM (Day 2)', activity: 'Grand Jury Pitches, Awards & Closing Ceremony' }
    ],
    judgingCriteria: [
      'Innovation & Originality (25%)',
      'Technical Architecture & Code Quality (30%)',
      'UI/UX Design & Usability (20%)',
      'Business Viability & Presentation (25%)'
    ],
    tags: ['AI/ML', 'Web Development', 'Hardware', 'Prizes'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-sound-surge',
    title: 'SoundSurge: Battle of the Bands & DJ Night',
    shortDescription: 'High-octane musical showdown featuring 12 college rock bands followed by an electric EDM night.',
    description: 'Feel the bass and witness blistering guitar solos as collegiate rock bands compete for the crown of SoundSurge Champions. Capped off with a guest performance by international electronic music artist.',
    clubId: 'club-dhwani',
    clubName: 'Dhwani Cultural & Fine Arts Guild',
    category: 'Cultural',
    eventType: 'Solo',
    price: 150,
    maxCapacity: 600,
    registeredCount: 420,
    eventDate: '2026-09-20T17:30:00.000Z',
    endDate: '2026-09-20T23:00:00.000Z',
    venue: 'Open Air Amphitheatre',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    rules: [
      'Pass required for venue entry; one ticket admits one attendee.',
      'Outside food, sharp objects, and unauthorized recording gear are prohibited.',
      'Entry gates close strictly at 07:00 PM.'
    ],
    schedule: [
      { time: '05:30 PM', activity: 'Gate Opening & Sound Checks' },
      { time: '06:15 PM', activity: 'Battle of the Bands (Round 1)' },
      { time: '08:45 PM', activity: 'Jury Evaluation & Trophy Presentation' },
      { time: '09:15 PM', activity: 'Guest EDM Artist Headliner Act' }
    ],
    tags: ['Music', 'Concert', 'Dance', 'Night Fest'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-futsal-clash',
    title: 'Inter-Collegiate Futsal 5v5 Championship',
    shortDescription: 'Fast-paced turf showdown between 32 top collegiate soccer teams under the floodlights.',
    description: 'High-intensity 5-a-side indoor and turf futsal tournament. Knockout stages with rolling substitutions, official FIFA certified referees, and trophies for Champions, Golden Boot, and Best Goalkeeper.',
    clubId: 'club-stride',
    clubName: 'Stride Sports & Athletics Union',
    category: 'Sports',
    eventType: 'Team',
    price: 500,
    maxCapacity: 32,
    registeredCount: 28,
    eventDate: '2026-09-26T08:00:00.000Z',
    venue: 'SAC Synthetic Turf Arena',
    bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80',
    minTeamSize: 5,
    maxTeamSize: 7,
    rules: [
      'Squads consist of 5 on-field players and up to 2 rolling substitutes.',
      'Standard 20-minute halves with rolling timeouts.',
      'Turf boots required; studs with metal spikes strictly prohibited.'
    ],
    schedule: [
      { time: '08:00 AM', activity: 'Captain Briefing & Group Stage Fixtures' },
      { time: '02:00 PM', activity: 'Quarter-Finals & Semi-Finals' },
      { time: '05:30 PM', activity: 'Grand Final & Golden Boot Award Presentation' }
    ],
    tags: ['Football', 'Championship', 'Trophies', 'Athletics'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-clean-marathon',
    title: 'GreenSprint: 5K Eco Marathon & Waste Audit',
    shortDescription: 'Run for sustainable campuses, earn eco-medals, and participate in plogging and tree planting.',
    description: 'A community 5K run across scenic campus trails promoting green energy, zero-waste living, and biodiversity conservation. Every registration plants one native tree sapling.',
    clubId: 'club-ecosphere',
    clubName: 'EcoSphere & Social Impact Cell',
    category: 'Social',
    eventType: 'Solo',
    price: 0, // Free event
    maxCapacity: 300,
    registeredCount: 190,
    eventDate: '2026-10-04T06:00:00.000Z',
    venue: 'SAC Central Plaza & Green Track',
    bannerUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop&q=80',
    rules: [
      'Participants receive free organic cotton bibs and seed medals.',
      'Bring personal refillable water flasks; hydration pods available along the route.',
      'Open to all students, faculty, and alumni.'
    ],
    schedule: [
      { time: '06:00 AM', activity: 'Warm-up & Aerobic Drills' },
      { time: '06:30 AM', activity: '5K Flag Off' },
      { time: '08:00 AM', activity: 'Sapling Plantation & Eco-Breakfast' }
    ],
    tags: ['Fitness', 'Eco', 'Free', 'Community'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  }
];

// v2 SPECIFICATION: STUDENT COORDINATORS FIRST (Cyber-Cyan Focus)
export const INITIAL_STUDENT_COORDINATORS: StudentCoordinator[] = [
  {
    id: 'stu-lead-1',
    name: 'Devansh Singhania',
    roleTitle: 'Student President (SAC Council)',
    branch: 'Computer Science & Engineering',
    academicYear: '4th Year (Batch of 2026)',
    clubAffiliation: 'Central SAC Executive Board',
    sacTenure: '2025 - 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'president.sac@college.edu',
    badges: ['Executive Board', 'National Hackathon Winner', 'University Honor']
  },
  {
    id: 'stu-lead-2',
    name: 'Tanya Sengupta',
    roleTitle: 'Technical General Secretary',
    branch: 'Information Technology',
    academicYear: '3rd Year (Batch of 2027)',
    clubAffiliation: 'CodeCrafters Technical Society',
    sacTenure: '2025 - 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'tech.sec@college.edu',
    badges: ['Full-Stack Architect', 'Open Source Maintainer', 'GSoC Scholar']
  },
  {
    id: 'stu-lead-3',
    name: 'Kabir Varma',
    roleTitle: 'Cultural & Arts General Secretary',
    branch: 'Electronics & Communication',
    academicYear: '4th Year (Batch of 2026)',
    clubAffiliation: 'Dhwani Cultural Guild',
    sacTenure: '2025 - 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    email: 'cultural.sec@college.edu',
    badges: ['Stage Director', 'Inter-Fest Laureate', 'Orchestra Lead']
  },
  {
    id: 'stu-lead-4',
    name: 'Ritika Nair',
    roleTitle: 'Sports & Wellness Joint Secretary',
    branch: 'Mechanical Engineering',
    academicYear: '3rd Year (Batch of 2027)',
    clubAffiliation: 'Stride Sports Union',
    sacTenure: '2025 - 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    email: 'sports.sec@college.edu',
    badges: ['Varsity Captain', 'State Athletics Gold', 'Fitness Mentor']
  },
  {
    id: 'stu-lead-5',
    name: 'Siddharth Rao',
    roleTitle: 'Social Outreach & CSR Secretary',
    branch: 'Electrical Engineering',
    academicYear: '4th Year (Batch of 2026)',
    clubAffiliation: 'EcoSphere Social Cell',
    sacTenure: '2025 - 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'social.sec@college.edu',
    badges: ['UN Youth Delegate', 'Green Campus Advocate', 'Community Lead']
  },
  {
    id: 'stu-lead-6',
    name: 'Meera Deshmukh',
    roleTitle: 'Design & Media Lead',
    branch: 'Computer Science (AI & Data Science)',
    academicYear: '3rd Year (Batch of 2027)',
    clubAffiliation: 'SAC Media & PR Wing',
    sacTenure: '2025 - 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    email: 'media.sac@college.edu',
    badges: ['UI/UX Specialist', 'Brand Architect', 'Video Producer']
  }
];

// v2 SPECIFICATION: FACULTY COORDINATORS SECOND (Regal Gold Focus)
export const INITIAL_FACULTY_COORDINATORS: FacultyCoordinator[] = [
  {
    id: 'fac-1',
    name: 'Dr. Amit Sharma',
    academicTitle: 'Dean of Student Affairs & Chief Patron',
    department: 'Department of Computer Science & Engineering',
    sacRole: 'Chief SAC Patron & Executive Mentor',
    officeLocation: 'Dean Office, Administrative Block - 2nd Floor (Room 204)',
    officeHours: 'Mon - Thu, 03:00 PM - 05:00 PM',
    email: 'dean.studentaffairs@college.edu',
    phone: '+91 11 2659 1001',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    advisoryTenure: '2021 - Present (5th Year)',
    specialization: 'Distributed Systems, Educational Governance & Student Leadership',
    bio: 'Dr. Amit Sharma holds a Ph.D. from IIT Bombay and has spearheaded collegiate innovation ecosystems for over 18 years. He oversees overall SAC charter adherence, fund allocation, and inter-university collaborations.'
  },
  {
    id: 'fac-2',
    name: 'Prof. Radhika Iyer',
    academicTitle: 'Faculty Advisor (Technical & Innovation Wing)',
    department: 'Department of Information Technology',
    sacRole: 'Senior Advisor, Technical Societies & Hackathons',
    officeLocation: 'SAC Building, Room 102 (Technical Society Office)',
    officeHours: 'Tue & Fri, 02:00 PM - 04:00 PM',
    email: 'radhika.iyer@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    advisoryTenure: '2023 - Present',
    specialization: 'Artificial Intelligence, Cybersecurity & Open Source Incubation',
    bio: 'Prof. Iyer mentors campus tech builders, reviews seed project grant proposals, and liaises with tech industry leaders for sponsorships and hackathon problem statements.'
  },
  {
    id: 'fac-3',
    name: 'Dr. Rajesh Nair',
    academicTitle: 'Faculty Advisor (Cultural, Fine Arts & Media)',
    department: 'Department of Humanities & Management',
    sacRole: 'Convener, Annual Cultural Fest & Stage Logistics',
    officeLocation: 'Humanities Wing, Cabin H-14',
    officeHours: 'Wed & Thu, 11:00 AM - 01:00 PM',
    email: 'rajesh.nair@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    advisoryTenure: '2022 - Present',
    specialization: 'Media Aesthetics, Theatre Arts & Event Operations',
    bio: 'Dr. Rajesh Nair brings two decades of experience organizing mega-scale collegiate fests, international conferences, and state-level artistic showcases.'
  },
  {
    id: 'fac-4',
    name: 'Coach Balwant Singh',
    academicTitle: 'Director of Physical Education & Sports',
    department: 'Department of Athletics & Wellness',
    sacRole: 'Chief Sports Director & Tournament Referee',
    officeLocation: 'Sports Complex, Ground Floor Office',
    officeHours: 'Mon - Sat, 08:00 AM - 11:00 AM',
    email: 'sports.director@college.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    advisoryTenure: '2020 - Present',
    specialization: 'Athletic Conditioning, Tournament Scheduling & Team Psychology',
    bio: 'Former national athlete and certified referee overseeing inter-university sports teams, gym maintenance, and campus wellness initiatives.'
  }
];

export const INITIAL_ALUMNI: Alumni[] = [
  {
    id: 'alm-1',
    name: 'Vikram Joshi',
    graduatingYear: 2021,
    pastSacRole: 'Ex-President, CodeCrafters & Hackathon Lead',
    currentRole: 'Staff Software Engineer',
    company: 'Google Cloud, Sunnyvale',
    domainSkills: ['Cloud Infrastructure', 'Distributed Systems', 'Go', 'Kubernetes'],
    isHallOfFame: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    quote: 'The midnight hackathons in the SAC lab laid the foundation for everything I build today at hyper-scale.'
  },
  {
    id: 'alm-2',
    name: 'Priyanka Sen',
    graduatingYear: 2022,
    pastSacRole: 'Ex-Cultural Secretary & Lead Choreographer',
    currentRole: 'Senior Product Designer',
    company: 'Stripe, London',
    domainSkills: ['Product Strategy', 'Design Systems', 'Figma', 'FinTech UX'],
    isHallOfFame: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    quote: 'Leading 300+ students during annual fest taught me leadership and creative agility far beyond textbook theory.'
  },
  {
    id: 'alm-3',
    name: 'Nikhil Agarwal',
    graduatingYear: 2020,
    pastSacRole: 'Ex-Robotics Society Lead',
    currentRole: 'Co-Founder & CTO',
    company: 'NeuraDrive AI (Y Combinator S22)',
    domainSkills: ['Autonomous Robotics', 'Computer Vision', 'Fundraising', 'Startup Leadership'],
    isHallOfFame: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com',
    quote: 'SAC was our first incubator. We built our prototype in Room 102!'
  },
  {
    id: 'alm-4',
    name: 'Shweta Rao',
    graduatingYear: 2023,
    pastSacRole: 'Ex-EcoSphere Lead',
    currentRole: 'ESG Solutions Consultant',
    company: 'McKinsey & Company',
    domainSkills: ['Sustainability Audits', 'Corporate ESG', 'Renewables'],
    isHallOfFame: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    linkedinUrl: 'https://linkedin.com'
  }
];

export const INITIAL_ROOM_BOOKINGS: RoomBooking[] = [
  {
    id: 'rb-1',
    clubId: 'club-code-crafters',
    clubName: 'CodeCrafters Technical Society',
    bookedBy: 'Aarav Sharma',
    contactEmail: 'aarav.sharma@college.edu',
    roomName: 'Auditorium',
    bookingDate: '2026-09-12',
    startTime: '08:00',
    endTime: '22:00',
    bookingReason: 'HackMatrix 2026 Inauguration & Opening Keynotes',
    expectedAttendance: 450,
    status: 'Approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rb-2',
    clubId: 'club-dhwani',
    clubName: 'Dhwani Cultural Guild',
    bookedBy: 'Rohan Mehra',
    contactEmail: 'rohan.mehra@college.edu',
    roomName: 'SAC Lounge',
    bookingDate: '2026-09-15',
    startTime: '16:00',
    endTime: '19:00',
    bookingReason: 'Acoustic Guitar Rehearsal & Vocal Harmonization',
    expectedAttendance: 25,
    status: 'Approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rb-3',
    clubId: 'club-stride',
    clubName: 'Stride Sports Union',
    bookedBy: 'Vikramaditya Singh',
    contactEmail: 'vikram.singh@college.edu',
    roomName: 'Seminar Hall',
    bookingDate: '2026-09-18',
    startTime: '14:00',
    endTime: '17:00',
    bookingReason: 'Inter-Departmental Sports Captains Draw & Rules Briefing',
    expectedAttendance: 60,
    status: 'Approved',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-demo-1',
    bookingSerial: 'SAC-849201',
    studentName: 'Rohan Patel',
    studentEmail: 'rohan.patel@student.college.edu',
    rollNumber: '22CS089',
    branch: 'Computer Science',
    academicYear: 3,
    eventId: 'evt-hackfest-2026',
    eventTitle: 'HackMatrix 2026: 36-Hour National Hackathon',
    clubName: 'CodeCrafters Technical Society',
    eventType: 'Team',
    teamCode: 'SAC-HACK-8392',
    teamName: 'CyberKnights',
    amountPaid: 300,
    utrNumber: '428901847291',
    paymentStatus: 'Verified',
    isCheckedIn: false,
    scannedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'reg-demo-2',
    bookingSerial: 'SAC-392018',
    studentName: 'Pooja Hegde',
    studentEmail: 'pooja.h@student.college.edu',
    rollNumber: '23EC045',
    branch: 'Electronics & Comm.',
    academicYear: 2,
    eventId: 'evt-sound-surge',
    eventTitle: 'SoundSurge: Battle of the Bands & DJ Night',
    clubName: 'Dhwani Cultural Guild',
    eventType: 'Solo',
    amountPaid: 150,
    utrNumber: '428901847292',
    paymentStatus: 'Verified',
    isCheckedIn: true,
    scannedAt: '2026-09-20T18:15:30.000Z',
    createdAt: new Date().toISOString()
  }
];

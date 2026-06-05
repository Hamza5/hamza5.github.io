// ---------------------------------------------------------------------------
// Profile data — single source of truth for all static content.
//
// Design notes:
//  - All collections are arrays even if currently one item, to avoid a
//    future structural change when more items are added.
//  - The top-level `Profile` interface is locale-neutral (plain strings).
//    To support i18n later, wrap in `getProfile(locale: string): Profile`.
//  - Proficiency values are 0–1 (same scale as InteractiveCV).
// ---------------------------------------------------------------------------

export interface Phone {
  country: string;     // ISO 3166-1 alpha-2, e.g. "DZ"
  flag: string;        // emoji flag, e.g. "🇩🇿"
  number: string;      // E.164 format, e.g. "+213659418469"
  label: string;       // display-friendly, e.g. "+213 659 418 469"
}

export interface Language {
  name: string;
  flagSrc: string;     // path relative to /public, e.g. "/images/flags/france.png"
  description: string;
  proficiency: number; // 0–1
}

export interface Location {
  district?: string;   // suburb / neighbourhood within the city, e.g. "Bab Ezzouar"
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;    // IANA timezone, e.g. "Africa/Algiers"
}

export interface PersonalDetails {
  dateOfBirth: string; // ISO 8601, e.g. "1994-05-13"
  nationality: string;
  religion: string;
}

export interface ContactInfo {
  emails: string[];
  phones: Phone[];
}

// ---------------------------------------------------------------------------
// Timeline — unified education + work history, sorted descending by endYear.
//
// Design notes:
//  - `category` drives the visual accent colour (education → purple, work → cyan).
//  - `type` drives the badge label on each card.
//  - `endYear` is used as the primary sort key; for ongoing entries use the
//    current year or 9999 to pin them to the top.
//  - `startYear` equals `endYear` for single-year entries (e.g. an exam).
//  - `logoSrc` is relative to /public (e.g. "/images/logos/usthb_logo.png").
//  - `institutionUrl` is used to make the logo a clickable link.
// ---------------------------------------------------------------------------

export type TimelineEntryType =
  | "bachelor"
  | "master"
  | "phd"
  | "language"
  | "certificate"
  | "course"
  | "internship"
  | "job"
  | "freelance";

export type TimelineEntryCategory = "education" | "work";

export interface TimelineEntry {
  type: TimelineEntryType;
  category: TimelineEntryCategory;
  institution: string;
  logoSrc: string;
  institutionUrl: string;
  title: string;
  startYear: number;
  endYear: number;
}

// ---------------------------------------------------------------------------
// Tech Stack
// ---------------------------------------------------------------------------

export interface SkillItem {
  name: string;
  /** Lowercase registry key (no "si" prefix). null = use fallbackImageSrc. */
  slug: string | null;
  description: string;
  proficiency: number; // 0–1
  fallbackImageSrc?: string; // path relative to /public
}

export interface SkillCategory {
  id: string;
  name: string;
  items: SkillItem[];
}

// ---------------------------------------------------------------------------
// Projects — sorted descending by year, then by month.
//
// Design notes:
//  - `category` drives badge colour accent.
//  - `month` is 1-based (1 = January). Omit for year-only precision.
//  - `tags` are short tech-stack labels shown as chips on the card.
//  - `url` is the live/demo URL; `githubUrl` is the GitHub repo link.
//    Both are optional — private/internal projects may have neither.
// ---------------------------------------------------------------------------

export type ProjectCategory =
  | "personal"
  | "freelance"
  | "work"
  | "research"
  | "writing";

export interface ProjectEntry {
  title: string;
  description: string;
  category: ProjectCategory;
  year: number;
  month?: number;       // 1–12
  tags: string[];
  url?: string;
  githubUrl?: string;
}

export interface Profile {
  fullName: string;
  shortDescription: string;
  contact: ContactInfo;
  personal: PersonalDetails;
  languages: Language[];
  location: Location;
  timeline: TimelineEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const profile: Profile = {
  fullName: "Hamza Abbad",
  shortDescription: "Engineer in Artificial Intelligence and Computer Science",

  contact: {
    emails: [
      "hamza.abbad@gmail.com",
    ],
    phones: [
      {
        country: "DZ",
        flag: "🇩🇿",
        number: "+213659418469",
        label: "+213 6 59 41 84 69",
      },
    ],
  },

  personal: {
    dateOfBirth: "1994-05-13",
    nationality: "Algerian",
    religion: "Islam",
  },

  languages: [
    {
      name: "Arabic",
      flagSrc: "/images/flags/arab-league.png",
      description: "Standard Arabic and most dialects",
      proficiency: 0.9,
    },
    {
      name: "English",
      flagSrc: "/images/flags/united-states.png",
      description: "American accent",
      proficiency: 0.8,
    },
    {
      name: "French",
      flagSrc: "/images/flags/france.png",
      description: "Metropolitan French",
      proficiency: 0.7,
    },
    {
      name: "Chinese",
      flagSrc: "/images/flags/china.png",
      description: "Mandarin Chinese",
      proficiency: 0.6,
    },
    {
      name: "Russian",
      flagSrc: "/images/flags/russia.png",
      description: "Basic words and sentences",
      proficiency: 0.1,
    },
  ],

  location: {
    district: "Bir El Djir",
    city: "Oran",
    country: "Algeria",
    latitude: 35.706047773344736,
    longitude: -0.5866758062029425,
    timezone: "Africa/Algiers",
  },

  // Sorted descending by endYear, then by startYear for same-endYear entries.
  timeline: [
    {
      type: "job",
      category: "work",
      institution: "SMRIS-CRTI",
      logoSrc: "/images/logos/SMRIS-CRTI_logo.png",
      institutionUrl: "https://www.smris-crti.dz/",
      title: "State Engineer for Research Support",
      startYear: 2025,
      endYear: 9999, // Ongoing
    },
    {
      type: "freelance",
      category: "work",
      institution: "Upwork",
      logoSrc: "/images/logos/upwork_logo.png",
      institutionUrl: "https://www.upwork.com/",
      title: "Web Scraping and Web Developement projects",
      startYear: 2024,
      endYear: 2025,
    },
    {
      type: "freelance",
      category: "work",
      institution: "Hsoub Academy",
      logoSrc: "/images/logos/Hsoub_academy.png",
      institutionUrl: "https://academy.hsoub.com/",
      title: "Helping students in Python programming",
      startYear: 2024,
      endYear: 2024,
    },
    {
      type: "phd",
      category: "education",
      institution: "Wuhan University of Technology (WHUT)",
      logoSrc: "/images/logos/whut_logo.png",
      institutionUrl: "https://www.whut.edu.cn/",
      title: "PhD in Arabic Natural Language Processing using Deep Learning",
      startYear: 2018,
      endYear: 2024,
    },
    {
      type: "job",
      category: "work",
      institution: "Data Impact",
      logoSrc: "/images/logos/dataimpact_logo.png",
      institutionUrl: "https://www.dataimpact.io/",
      title: "Web scraping for digital shelf",
      startYear: 2022,
      endYear: 2022,
    },
    {
      type: "course",
      category: "education",
      institution: "EdX",
      logoSrc: "/images/logos/edx_logo.png",
      institutionUrl: "https://www.edx.org/",
      title: "Reinforcement Learning Explained",
      startYear: 2019,
      endYear: 2019,
    },
    {
      type: "certificate",
      category: "education",
      institution: "International Education Specialists (IDP)",
      logoSrc: "/images/logos/idp_logo.png",
      institutionUrl: "https://www.idp.com/",
      title: "International English Language Testing System (IELTS)",
      startYear: 2018,
      endYear: 2018,
    },
    {
      type: "course",
      category: "education",
      institution: "Coursera",
      logoSrc: "/images/logos/coursera_logo.png",
      institutionUrl: "https://www.coursera.org/",
      title: "Machine Learning",
      startYear: 2018,
      endYear: 2018,
    },
    {
      type: "language",
      category: "education",
      institution: "Wuhan University of Technology (WHUT)",
      logoSrc: "/images/logos/whut_logo.png",
      institutionUrl: "https://www.whut.edu.cn/",
      title: "Mandarin Chinese",
      startYear: 2017,
      endYear: 2018,
    },
    {
      type: "master",
      category: "education",
      institution: "University of Science and Technology Houari Boumediene (USTHB)",
      logoSrc: "/images/logos/usthb_logo.png",
      institutionUrl: "https://www.usthb.dz/",
      title: "Master in Artificial Intelligence",
      startYear: 2015,
      endYear: 2017,
    },
    {
      type: "internship",
      category: "work",
      institution: "AlBaraka Bank",
      logoSrc: "/images/logos/albaraka_logo.png",
      institutionUrl: "https://www.albaraka-bank.dz/",
      title: "Internship in IT",
      startYear: 2014,
      endYear: 2014,
    },
    {
      type: "bachelor",
      category: "education",
      institution: "University of Science and Technology Houari Boumediene (USTHB)",
      logoSrc: "/images/logos/usthb_logo.png",
      institutionUrl: "https://www.usthb.dz/",
      title: "Bachelor in Computer Science",
      startYear: 2012,
      endYear: 2015,
    },
  ],

  // -------------------------------------------------------------------------
  // Tech Stack
  // -------------------------------------------------------------------------
  skills: [
    {
      id: "languages",
      name: "Programming Languages",
      items: [
        { name: "Python", slug: "python", description: "Backend scripting and AI development", proficiency: 0.95 },
        { name: "Markdown", slug: "markdown", description: "Documentation and technical writing", proficiency: 0.95 },
        { name: "JavaScript / TypeScript", slug: "typescript", description: "Full-stack web development", proficiency: 0.80 },
        { name: "HTML / CSS", slug: "html5", description: "Web markup and styling", proficiency: 0.70 },
        { name: "LaTeX", slug: "latex", description: "Scientific document publishing", proficiency: 0.60 },
        { name: "Dart / Flutter", slug: "flutter", description: "Cross-platform mobile development", proficiency: 0.50 },
        { name: "Java", slug: null, description: "Desktop application development", proficiency: 0.30, fallbackImageSrc: "/images/logos/Java_logo.png" },
      ],
    },
    {
      id: "frameworks",
      name: "Frameworks & Libraries",
      items: [
        { name: "Django", slug: "django", description: "Full-featured Python web framework", proficiency: 0.80 },
        { name: "Pillow", slug: null, description: "Python image processing", proficiency: 0.80, fallbackImageSrc: "/images/logos/Pillow_logo.png" },
        { name: "PyQt", slug: null, description: "Desktop GUI development", proficiency: 0.80, fallbackImageSrc: "/images/logos/PyQt_logo.png" },
        { name: "Next.js", slug: "nextdotjs", description: "React framework for production apps", proficiency: 0.80 },
        { name: "Playwright", slug: null, description: "Cross-browser automation and testing", proficiency: 0.80, fallbackImageSrc: "/images/logos/Playwright_logo.svg" },
        { name: "UserScripts", slug: null, description: "Browser automation and enhancement", proficiency: 0.80, fallbackImageSrc: "/images/logos/UserScript_logo.png" },
        { name: "NumPy", slug: "numpy", description: "Vectorized numerical computing", proficiency: 0.70 },
        { name: "TensorFlow", slug: "tensorflow", description: "Deep learning and neural networks", proficiency: 0.70 },
        { name: "Crawlee", slug: null, description: "Modern web crawling framework", proficiency: 0.70, fallbackImageSrc: "/images/logos/Crawlee_logo.png" },
        { name: "PrimeReact", slug: "primereact", description: "Rich UI component library for React", proficiency: 0.70 },
        { name: "Matplotlib", slug: null, description: "Data visualization and charting", proficiency: 0.60, fallbackImageSrc: "/images/logos/Matplotlib_logo.png" },
        { name: "Flask", slug: "flask", description: "Lightweight Python web framework", proficiency: 0.60 },
        { name: "React", slug: "react", description: "Component-based web UI library", proficiency: 0.60 },
        { name: "Tailwind CSS", slug: "tailwindcss", description: "Utility-first CSS framework", proficiency: 0.60 },
        { name: "OpenCV", slug: "opencv", description: "Computer vision and image analysis", proficiency: 0.50 },
      ],
    },
    {
      id: "databases",
      name: "Databases",
      items: [
        { name: "SQLite", slug: "sqlite", description: "Embedded file-based SQL database", proficiency: 0.90 },
        { name: "PostgreSQL", slug: "postgresql", description: "Advanced relational database", proficiency: 0.50 },
        { name: "MongoDB", slug: "mongodb", description: "Document-oriented NoSQL database", proficiency: 0.40 },
      ],
    },
    {
      id: "devops",
      name: "DevOps",
      items: [
        { name: "Git", slug: "git", description: "Distributed version control", proficiency: 0.80 },
        { name: "GitHub Actions", slug: "githubactions", description: "CI/CD workflow automation", proficiency: 0.80 },
        { name: "Poetry", slug: "poetry", description: "Python dependency management", proficiency: 0.70 },
        { name: "Docker", slug: "docker", description: "Containerization for deployment", proficiency: 0.60 },
      ],
    },
    {
      id: "graphic",
      name: "Graphic Tools",
      items: [
        { name: "Inkscape", slug: "inkscape", description: "Vector graphics design", proficiency: 0.70 },
        { name: "GIMP", slug: "gimp", description: "Raster image editing", proficiency: 0.60 },
        { name: "Blender", slug: "blender", description: "3D modeling and rendering", proficiency: 0.20 },
      ],
    },
  ],

  // -------------------------------------------------------------------------
  // Projects — sorted descending by year, then by month.
  // -------------------------------------------------------------------------
  projects: [
    {
      title: "File Brain",
      description: "Smart local file search engine with typo tolerance, OCR, and semantic multilanguage matching.",
      category: "personal",
      year: 2026,
      month: 1,
      tags: ["Python", "FastAPI", "Typesense", "React", "PrimeReact", "SQLite"],
      url: "https://file-brain.com/",
      githubUrl: "https://github.com/Hamza5/file-brain",
    },
    {
      title: "Scraping Brain",
      description: "AI-powered service for performing web scraping tasks using natural language instructions.",
      category: "personal",
      year: 2025,
      month: 9,
      tags: ["Python", "FastAPI", "LangGraph", "Playwright", "Supabase", "Next.js"],
      url: "https://scrapingbrain.com/",
    },
    {
      title: "SMRIS Secretary",
      description: "Desktop app for registering and tracking interns at CRTI-SMRIS, with automated document generation.",
      category: "work",
      year: 2025,
      month: 5,
      tags: ["React", "PrimeReact", "Electron", "PocketBase", "Refine.dev"],
    },
    {
      title: "Instagram Automation",
      description: "Desktop app that automates bulk-adding or removing Instagram followers from the Close Friends list.",
      category: "freelance",
      year: 2024,
      month: 11,
      tags: ["Next.js", "React", "PrimeReact", "TypeScript"],
    },
    {
      title: "Upwork Job Notification Bot",
      description: "CLI tool that periodically scrapes Upwork job listings with user-specified filters and sends desktop notifications for new matches.",
      category: "freelance",
      year: 2024,
      month: 10,
      tags: ["Next.js", "React", "Playwright", "Google OAuth", "Mantine"],
    },
    {
      title: "Telegram / WhatsApp Info Extractor",
      description: "Web app that scrapes basic channel info from Telegram and WhatsApp and exports it into a Google Sheet.",
      category: "freelance",
      year: 2024,
      month: 10,
      tags: ["Python", "Flask", "BeautifulSoup", "Google Sheets API"],
    },
    {
      title: "Amazon Scraper / Telegram Poster",
      description: "CLI app that scrapes discounted products from Amazon DE and posts them automatically to a Telegram group.",
      category: "freelance",
      year: 2024,
      month: 9,
      tags: ["TypeScript", "Crawlee", "Playwright", "Telegraf"],
    },
    {
      title: "Store Scrap",
      description: "Desktop GUI app that scrapes products of selected brands from four Saudi e-commerce retailers.",
      category: "freelance",
      year: 2024,
      month: 8,
      tags: ["Python", "Scrapy", "PySide6"],
      githubUrl: "https://github.com/Hamza5/StoreScrap",
    },
    {
      title: "Lisan1 Students Blog",
      description: "Search engine over a corpus of Saudi student Arabic texts, with tools for n-gram extraction, frequency analysis, and linguistic feature discovery.",
      category: "freelance",
      year: 2024,
      month: 7,
      tags: ["Django", "MySQL", "Bootstrap", "jQuery", "NLP"],
      url: "https://corpus.lisan1.com/",
    },
    {
      title: "Multilevel Diacritizer",
      description: "Flask/Flutter/TensorFlow web application serving as a GUI for a deep learning model for automatic Arabic diacritics restoration, developed during PhD research.",
      category: "research",
      year: 2019,
      month: 10,
      tags: ["Python", "Flask", "TensorFlow", "Flutter", "NLP", "Deep Learning"],
      githubUrl: "https://github.com/Hamza5/multilevel-diacritizer",
    },
    {
      title: "Periodical File Sender",
      description: "Desktop GUI tool to send emails with attachments periodically via an SMTP server.",
      category: "personal",
      year: 2019,
      month: 1,
      tags: ["Python", "PyQt5", "SMTP"],
      githubUrl: "https://github.com/Hamza5/Periodical-File-Sender",
    },
    {
      title: "Learn to Program with C (Arabic)",
      description: "Full Arabic translation of a 500-page French book teaching C programming, with high-quality layout and typesetting.",
      category: "writing",
      year: 2018,
      month: 9,
      tags: ["LaTeX", "Arabic", "Technical Writing"],
      githubUrl: "https://github.com/Hamza5/Learn-to-program-with-C_AR",
    },
    {
      title: "DNA Translator (Arabic)",
      description: "Cross-platform app to translate between DNA, RNA, and amino acid sequences, with a fully Arabic interface.",
      category: "personal",
      year: 2018,
      month: 9,
      tags: ["AutoIt", "HTML", "CSS", "JavaScript"],
      githubUrl: "https://github.com/Hamza5/DNA-translator_AR",
    },
    {
      title: "Basic Regular Expression Tester",
      description: "Python desktop application for testing and visualising regular expression functions against arbitrary text input.",
      category: "personal",
      year: 2014,
      month: 8,
      tags: ["Python", "PyQt4"],
      githubUrl: "https://github.com/Hamza5/Basic-Regular-Expressions-Tester",
    },
  ],
};

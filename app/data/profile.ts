// ---------------------------------------------------------------------------
// Profile data — structural source of truth.
//
// All display text (names, titles, descriptions) lives in messages/*.json
// and is accessed via the useLocalizedProfile() hook.
// Only structural/numeric/URL data lives here, keyed by stable `id` fields.
// ---------------------------------------------------------------------------

export interface Phone {
  country: string;     // ISO 3166-1 alpha-2, e.g. "DZ"
  flag: string;        // emoji flag, e.g. "🇩🇿"
  number: string;      // E.164 format, e.g. "+213659418469"
  label: string;       // display-friendly, e.g. "+213 659 418 469"
}

export interface Language {
  id: string;          // stable key for i18n lookup, e.g. "arabic"
  flagSrc: string;     // path relative to /public
  proficiency: number; // 0–1
}

export interface Location {
  latitude: number;
  longitude: number;
  timezone: string;    // IANA timezone, e.g. "Africa/Algiers"
}

export interface PersonalDetails {
  dateOfBirth: string; // ISO 8601, e.g. "1994-05-13"
}

export interface ContactInfo {
  emails: string[];
  phones: Phone[];
}

// ---------------------------------------------------------------------------
// Timeline — unified education + work history, sorted descending by endYear.
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
  id: string;
  type: TimelineEntryType;
  category: TimelineEntryCategory;
  institution: string;
  logoSrc: string;
  institutionUrl: string;
  startYear: number;
  endYear: number;
}

// ---------------------------------------------------------------------------
// Tech Stack
// ---------------------------------------------------------------------------

export interface SkillItem {
  id: string;
  slug: string | null;
  proficiency: number; // 0–1
  fallbackImageSrc?: string;
}

export interface SkillCategory {
  id: string;
  items: SkillItem[];
}

// ---------------------------------------------------------------------------
// Projects — sorted descending by year, then by month.
// ---------------------------------------------------------------------------

export type ProjectCategory =
  | "personal"
  | "freelance"
  | "work"
  | "research"
  | "writing";

export interface ProjectEntry {
  id: string;
  category: ProjectCategory;
  year: number;
  month?: number;
  tags: string[];
  url?: string;
  githubUrl?: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

// ---------------------------------------------------------------------------
// Publications — titles/venues stay in English (academic language).
// ---------------------------------------------------------------------------

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  url: string;
  doi: string;
}

export interface Profile {
  /** Canonical Latin-script name — used for vCard and file downloads. */
  fullName: string;
  contact: ContactInfo;
  personal: PersonalDetails;
  socialLinks: SocialLink[];
  languages: Language[];
  location: Location;
  timeline: TimelineEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  publications: Publication[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const profile: Profile = {
  fullName: "Hamza Abbad",

  socialLinks: [
    { label: "Portfolio", url: "https://hamza5.github.io" },
    { label: "GitHub",    url: "https://github.com/Hamza5" },
    { label: "LinkedIn",  url: "https://www.linkedin.com/in/hamza-abbad/" },
  ],

  contact: {
    emails: ["hamza.abbad@gmail.com"],
    phones: [
      {
        country: "DZ",
        flag: "🇩🇿",
        number: "+213542511063",
        label: "+213 542 51 10 63",
      },
    ],
  },

  personal: {
    dateOfBirth: "1994-05-13",
  },

  languages: [
    { id: "arabic",  flagSrc: "/images/flags/arab-league.png",   proficiency: 0.9 },
    { id: "english", flagSrc: "/images/flags/united-states.png", proficiency: 0.8 },
    { id: "french",  flagSrc: "/images/flags/france.png",        proficiency: 0.7 },
    { id: "chinese", flagSrc: "/images/flags/china.png",         proficiency: 0.6 },
    { id: "russian", flagSrc: "/images/flags/russia.png",        proficiency: 0.1 },
  ],

  location: {
    latitude:  35.706047773344736,
    longitude: -0.5866758062029425,
    timezone:  "Africa/Algiers",
  },

  timeline: [
    { id: "smrisCrtiJob",          type: "job",         category: "work",      institution: "SMRIS-CRTI",                                               logoSrc: "/images/logos/SMRIS-CRTI_logo.png",   institutionUrl: "https://www.smris-crti.dz/",                startYear: 2025, endYear: 9999 },
    { id: "upworkFreelance",       type: "freelance",   category: "work",      institution: "Upwork",                                                   logoSrc: "/images/logos/upwork_logo.png",        institutionUrl: "https://www.upwork.com/",                   startYear: 2024, endYear: 2025 },
    { id: "hsoubAcademyFreelance", type: "freelance",   category: "work",      institution: "Hsoub Academy",                                            logoSrc: "/images/logos/Hsoub_academy.png",      institutionUrl: "https://academy.hsoub.com/",               startYear: 2024, endYear: 2024 },
    { id: "whutPhd",               type: "phd",         category: "education", institution: "Wuhan University of Technology (WHUT)",                    logoSrc: "/images/logos/whut_logo.png",          institutionUrl: "https://www.whut.edu.cn/",                  startYear: 2018, endYear: 2024 },
    { id: "dataImpactJob",         type: "job",         category: "work",      institution: "Data Impact",                                              logoSrc: "/images/logos/dataimpact_logo.png",    institutionUrl: "https://www.dataimpact.io/",                startYear: 2022, endYear: 2022 },
    { id: "edxCourse",             type: "course",      category: "education", institution: "EdX",                                                      logoSrc: "/images/logos/edx_logo.png",           institutionUrl: "https://www.edx.org/",                      startYear: 2019, endYear: 2019 },
    { id: "idpCertificate",        type: "certificate", category: "education", institution: "International Education Specialists (IDP)",                logoSrc: "/images/logos/idp_logo.png",           institutionUrl: "https://www.idp.com/",                      startYear: 2018, endYear: 2018 },
    { id: "courseraCourse",        type: "course",      category: "education", institution: "Coursera",                                                 logoSrc: "/images/logos/coursera_logo.png",      institutionUrl: "https://www.coursera.org/",                 startYear: 2018, endYear: 2018 },
    { id: "whutLanguage",          type: "language",    category: "education", institution: "Wuhan University of Technology (WHUT)",                    logoSrc: "/images/logos/whut_logo.png",          institutionUrl: "https://www.whut.edu.cn/",                  startYear: 2017, endYear: 2018 },
    { id: "usthbMaster",           type: "master",      category: "education", institution: "University of Science and Technology Houari Boumediene (USTHB)", logoSrc: "/images/logos/usthb_logo.png", institutionUrl: "https://www.usthb.dz/",                     startYear: 2015, endYear: 2017 },
    { id: "albarakaInternship",    type: "internship",  category: "work",      institution: "AlBaraka Bank",                                            logoSrc: "/images/logos/albaraka_logo.png",      institutionUrl: "https://www.albaraka-bank.dz/",             startYear: 2014, endYear: 2014 },
    { id: "usthbBachelor",         type: "bachelor",    category: "education", institution: "University of Science and Technology Houari Boumediene (USTHB)", logoSrc: "/images/logos/usthb_logo.png", institutionUrl: "https://www.usthb.dz/",                     startYear: 2012, endYear: 2015 },
  ],

  skills: [
    {
      id: "languages",
      items: [
        { id: "python",     slug: "python",      proficiency: 0.95 },
        { id: "markdown",   slug: "markdown",    proficiency: 0.95 },
        { id: "typescript", slug: "typescript",  proficiency: 0.80 },
        { id: "html5",      slug: "html5",       proficiency: 0.70 },
        { id: "latex",      slug: "latex",       proficiency: 0.60 },
        { id: "flutter",    slug: "flutter",     proficiency: 0.50 },
        { id: "java",       slug: null,          proficiency: 0.30, fallbackImageSrc: "/images/logos/Java_logo.png" },
      ],
    },
    {
      id: "frameworks",
      items: [
        { id: "django",      slug: "django",      proficiency: 0.80 },
        { id: "pillow",      slug: null,          proficiency: 0.80, fallbackImageSrc: "/images/logos/Pillow_logo.png" },
        { id: "pyQt",        slug: null,          proficiency: 0.80, fallbackImageSrc: "/images/logos/PyQt_logo.png" },
        { id: "nextJs",      slug: "nextdotjs",   proficiency: 0.80 },
        { id: "playwright",  slug: null,          proficiency: 0.80, fallbackImageSrc: "/images/logos/Playwright_logo.svg" },
        { id: "userScripts", slug: null,          proficiency: 0.80, fallbackImageSrc: "/images/logos/UserScript_logo.png" },
        { id: "numpy",       slug: "numpy",       proficiency: 0.70 },
        { id: "tensorflow",  slug: "tensorflow",  proficiency: 0.70 },
        { id: "crawlee",     slug: null,          proficiency: 0.70, fallbackImageSrc: "/images/logos/Crawlee_logo.png" },
        { id: "primeReact",  slug: "primereact",  proficiency: 0.70 },
        { id: "matplotlib",  slug: null,          proficiency: 0.60, fallbackImageSrc: "/images/logos/Matplotlib_logo.png" },
        { id: "flask",       slug: "flask",       proficiency: 0.60 },
        { id: "react",       slug: "react",       proficiency: 0.60 },
        { id: "tailwindCss", slug: "tailwindcss", proficiency: 0.60 },
        { id: "openCv",      slug: "opencv",      proficiency: 0.50 },
      ],
    },
    {
      id: "databases",
      items: [
        { id: "sqlite",     slug: "sqlite",     proficiency: 0.90 },
        { id: "postgresql", slug: "postgresql", proficiency: 0.50 },
        { id: "mongodb",    slug: "mongodb",    proficiency: 0.40 },
      ],
    },
    {
      id: "devops",
      items: [
        { id: "git",           slug: "git",          proficiency: 0.80 },
        { id: "githubActions", slug: "githubactions", proficiency: 0.80 },
        { id: "poetry",        slug: "poetry",        proficiency: 0.70 },
        { id: "docker",        slug: "docker",        proficiency: 0.60 },
      ],
    },
    {
      id: "graphic",
      items: [
        { id: "inkscape", slug: "inkscape", proficiency: 0.70 },
        { id: "gimp",     slug: "gimp",     proficiency: 0.60 },
        { id: "blender",  slug: "blender",  proficiency: 0.20 },
      ],
    },
  ],

  projects: [
    { id: "pftSmrisWebsite",             category: "work",      year: 2026, month: 5,  tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],                               url: "https://smris-crti.dz" },
    { id: "upTribe",                     category: "personal",  year: 2026, month: 3,  tags: ["Next.js", "React", "Convex", "PrimeReact", "Tailwind CSS"],                   url: "https://uptribe.cc",          githubUrl: "https://github.com/Hamza5/uptribe" },
    { id: "fileBrain",                     category: "personal",  year: 2026, month: 1,  tags: ["Python", "FastAPI", "Typesense", "React", "PrimeReact", "SQLite"],                 url: "https://file-brain.com/",      githubUrl: "https://github.com/Hamza5/file-brain" },
    { id: "scrapingBrain",                 category: "personal",  year: 2025, month: 9,  tags: ["Python", "FastAPI", "LangGraph", "Playwright", "Supabase", "Next.js"],             url: "https://scrapingbrain.com/" },
    { id: "smrisSecretary",                category: "work",      year: 2025, month: 5,  tags: ["React", "PrimeReact", "Electron", "PocketBase", "Refine.dev"] },
    { id: "instagramAutomation",           category: "freelance", year: 2024, month: 11, tags: ["Next.js", "React", "PrimeReact", "TypeScript"] },
    { id: "upworkJobNotificationBot",      category: "freelance", year: 2024, month: 10, tags: ["Next.js", "React", "Playwright", "Google OAuth", "Mantine"] },
    { id: "telegramWhatsAppInfoExtractor", category: "freelance", year: 2024, month: 10, tags: ["Python", "Flask", "BeautifulSoup", "Google Sheets API"] },
    { id: "amazonScraperTelegramPoster",   category: "freelance", year: 2024, month: 9,  tags: ["TypeScript", "Crawlee", "Playwright", "Telegraf"] },
    { id: "storeScrap",                    category: "freelance", year: 2024, month: 8,  tags: ["Python", "Scrapy", "PySide6"],                                                     githubUrl: "https://github.com/Hamza5/StoreScrap" },
    { id: "lisan1StudentsBlog",            category: "freelance", year: 2024, month: 7,  tags: ["Django", "MySQL", "Bootstrap", "jQuery", "NLP"],                                  url: "https://corpus.lisan1.com/" },
    { id: "multilevelDiacritizer",         category: "research",  year: 2019, month: 10, tags: ["Python", "Flask", "TensorFlow", "Flutter", "NLP", "Deep Learning"],               githubUrl: "https://github.com/Hamza5/multilevel-diacritizer" },
    { id: "periodicalFileSender",          category: "personal",  year: 2019, month: 1,  tags: ["Python", "PyQt5", "SMTP"],                                                         githubUrl: "https://github.com/Hamza5/Periodical-File-Sender" },
    { id: "learnToProgramWithC",           category: "writing",   year: 2018, month: 9,  tags: ["LaTeX", "Arabic", "Technical Writing"],                                           githubUrl: "https://github.com/Hamza5/Learn-to-program-with-C_AR" },
    { id: "dnaTranslator",                 category: "personal",  year: 2018, month: 9,  tags: ["AutoIt", "HTML", "CSS", "JavaScript"],                                            githubUrl: "https://github.com/Hamza5/DNA-translator_AR" },
    { id: "basicRegexTester",              category: "personal",  year: 2014, month: 8,  tags: ["Python", "PyQt4"],                                                                  githubUrl: "https://github.com/Hamza5/Basic-Regular-Expressions-Tester" },
  ],

  publications: [
    {
      title: "Simple Extensible Deep Learning Model for Automatic Arabic Diacritization",
      authors: ["Hamza Abbad", "Shengwu Xiong"],
      venue: "ACM Transactions on Asian and Low-Resource Language Information Processing (TALLIP)",
      year: 2022,
      url: "https://dl.acm.org/doi/abs/10.1145/3480938",
      doi: "10.1145/3480938",
    },
    {
      title: "Multi-components System for Automatic Arabic Diacritization",
      authors: ["Hamza Abbad", "Shengwu Xiong"],
      venue: "European Conference on Information Retrieval (ECIR 2020), Springer LNCS",
      year: 2020,
      url: "https://link.springer.com/chapter/10.1007/978-3-030-45439-5_23",
      doi: "10.1007/978-3-030-45439-5_23",
    },
  ],
};

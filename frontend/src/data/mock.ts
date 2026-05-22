// Mock REST data — replace with real API calls later.
// Shape mirrors what a /api/* endpoint would return.

export const profile = {
  name: "Shaik Sameer",
  handle: "Sameer.dev",
  title: "Full Stack Engineer",
  location: "Hyderabad, India",
  bio: "Building scalable systems with NestJS, Next.js, and event-driven architecture.",
  available: true,
  email: "sameer@example.com",
  github: "https://github.com/Shaik-Sameer77",
  linkedin: "https://linkedin.com/in/shaik-sameer",
  resumeUrl: "/resume.pdf",
  avatarUrl: "/profile.png",
};

export const stats = [
  { label: "projects shipped", value: "5+" },
  { label: "years building", value: "3+" },
  { label: "lines of TypeScript", value: "10k+" },
  { label: "open-source PRs", value: "40+" },
];

export type Project = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  category: "Full Stack" | "Backend" | "Frontend" | "Open Source";
  github?: string;
  live?: string;
  featured?: boolean;
  images?: string[];
};

export const projects: Project[] = [
  {
    slug: "portfolio-platform",
    title: "Portfolio Platform",
    description: "Event-driven CMS-backed portfolio with a NestJS API, Kafka pipelines, and a Next.js front end.",
    stack: ["NestJS", "Next.js", "Kafka", "PostgreSQL", "MongoDB"],
    category: "Full Stack",
    github: "https://github.com/Shaik-Sameer77",
    live: "#",
    featured: true,
    images: ["/project_placeholder_1_1778503449199.png", "/project_placeholder_2_1778503465369.png"],
  },
  {
    slug: "ecommerce-api",
    title: "E-commerce API",
    description: "Modular commerce backend with Stripe billing, Redis-backed carts, and Prisma migrations.",
    stack: ["NestJS", "Prisma", "Stripe", "Redis"],
    category: "Backend",
    github: "https://github.com/Shaik-Sameer77",
    live: "#",
    featured: true,
    images: ["/project_placeholder_2_1778503465369.png", "/project_placeholder_3_1778503481624.png"],
  },
  {
    slug: "dev-tools-cli",
    title: "Dev Tools CLI",
    description: "A typed CLI that scaffolds services, codegens DTOs, and runs project-wide refactors.",
    stack: ["Node.js", "TypeScript", "Commander.js"],
    category: "Open Source",
    github: "https://github.com/Shaik-Sameer77",
    featured: true,
    images: ["/project_placeholder_3_1778503481624.png", "/project_placeholder_1_1778503449199.png"],
  },
  {
    slug: "realtime-dashboard",
    title: "Realtime Ops Dashboard",
    description: "Websocket-driven dashboard for service health, deploy events, and incident timelines.",
    stack: ["Next.js", "Zustand", "WebSockets"],
    category: "Frontend",
    github: "https://github.com/Shaik-Sameer77",
  },
  {
    slug: "kafka-replayer",
    title: "Kafka Replayer",
    description: "Record and replay Kafka topics across environments for safe debugging.",
    stack: ["Node.js", "Kafka", "TypeScript"],
    category: "Backend",
    github: "https://github.com/Shaik-Sameer77",
  },
  {
    slug: "ui-primitives",
    title: "UI Primitives",
    description: "Headless React components used across my client work.",
    stack: ["React", "TypeScript", "Tailwind"],
    category: "Frontend",
    github: "https://github.com/Shaik-Sameer77",
  },
];

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string | "Present";
  bullets: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: "Stealth Startup",
    role: "Full Stack Engineer",
    start: "Jan 2023",
    end: "Present",
    bullets: [
      "Designed an event-driven architecture using Kafka to decouple 6 internal services.",
      "Built a NestJS API gateway with auth, rate limiting, and typed contracts shared with the web app.",
      "Shipped a Next.js client used by 2k+ weekly users with 99.95% uptime.",
      "Mentored two junior engineers on TypeScript, testing, and code review.",
    ],
    stack: ["NestJS", "Kafka", "Next.js", "PostgreSQL", "Redis"],
  },
  {
    company: "Freelance",
    role: "Backend Engineer",
    start: "Jun 2022",
    end: "Dec 2022",
    bullets: [
      "Built a billing and subscription backend on Stripe for a SaaS client.",
      "Migrated a legacy Express API to NestJS with zero-downtime cutover.",
      "Introduced CI with GitHub Actions, cutting deploy time from 12m to 3m.",
    ],
    stack: ["NestJS", "Prisma", "Stripe", "PostgreSQL"],
  },
  {
    company: "Independent Projects",
    role: "Builder",
    start: "Aug 2021",
    end: "May 2022",
    bullets: [
      "Shipped open-source CLIs and React libraries.",
      "Wrote technical articles on system design and TypeScript.",
    ],
    stack: ["TypeScript", "Node.js", "React"],
  },
];

export const education = [
  { school: "JNTU Hyderabad", degree: "B.Tech, Computer Science", date: "2019 — 2023" },
];

export const certifications = [
  { name: "AWS Certified Developer - Associate", issuer: "Amazon Web Services", date: "Aug 2024", imageUrl: "/project_placeholder_1_1778503449199.png" },
  { name: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp", date: "May 2024", imageUrl: "/project_placeholder_2_1778503465369.png" },
  { name: "Stripe Certified Developer", issuer: "Stripe", date: "Jan 2025", imageUrl: "/project_placeholder_3_1778503481624.png" },
];

export const stack = {
  Frontend: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Zustand", "Framer Motion"],
  Backend: ["NestJS", "Node.js", "Prisma", "REST APIs", "Kafka"],
  Databases: ["PostgreSQL", "MongoDB", "Redis"],
  DevOps: ["Docker", "GitHub Actions", "Railway", "Vercel"],
  Tools: ["Git", "VS Code", "Postman", "Linear"],
};

export const uses = [
  {
    section: "Hardware",
    items: [
      { name: "MacBook Pro 14” M2", note: "Daily driver. Quiet, fast, lasts a full day." },
      { name: "LG 27” 4K display", note: "Plenty of room for an editor and two browsers." },
      { name: "Keychron K2", note: "Brown switches. Compact and quiet enough for calls." },
    ],
  },
  {
    section: "Editor",
    items: [
      { name: "VS Code", note: "Tokyo Night theme, JetBrains Mono, ligatures on." },
      { name: "Extensions", note: "ESLint, Prettier, GitLens, Error Lens, Tailwind IntelliSense." },
    ],
  },
  {
    section: "Terminal",
    items: [
      { name: "Warp + zsh", note: "Starship prompt, fzf, zoxide for fast navigation." },
      { name: "tmux", note: "Persistent sessions per project." },
    ],
  },
  {
    section: "Apps",
    items: [
      { name: "Linear", note: "Issue tracking that doesn't get in the way." },
      { name: "Raycast", note: "Launcher, snippets, clipboard history." },
      { name: "Notion", note: "Long-form notes and project briefs." },
    ],
  },
  {
    section: "Extensions",
    items: [
      { name: "React DevTools", note: "Component tree, profiler." },
      { name: "JSON Viewer", note: "Pretty API responses in the browser." },
    ],
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
};

export const posts: BlogPost[] = [
  {
    slug: "kafka-over-rest",
    title: "Why I chose Kafka over REST for microservices",
    excerpt: "Synchronous calls felt right until services started failing in cascades. Here's what changed.",
    category: "System Design",
    date: "Mar 14, 2025",
    readingTime: "8 min",
  },
  {
    slug: "type-safe-nestjs-prisma",
    title: "Building a type-safe API with NestJS and Prisma",
    excerpt: "Generated types from the schema all the way to the React client — no any in sight.",
    category: "Engineering",
    date: "Feb 02, 2025",
    readingTime: "11 min",
  },
  {
    slug: "monorepo-vs-separate",
    title: "Monorepo vs separate repos: what I learned",
    excerpt: "I tried both. Here's the honest tradeoff matrix I wish someone had given me.",
    category: "Engineering",
    date: "Jan 09, 2025",
    readingTime: "6 min",
  },
];

export const services = [
  {
    title: "Full-stack development",
    description: "End-to-end product work, from API contracts to a polished client.",
    includes: ["Next.js + NestJS apps", "Auth, billing, dashboards", "CI/CD and observability"],
    price: "From $4k / project",
  },
  {
    title: "API design & backend architecture",
    description: "Design clean, evolvable backends with proper boundaries.",
    includes: ["Domain modeling", "Event-driven patterns", "Performance reviews"],
    price: "From $2k / engagement",
  },
  {
    title: "Technical consulting",
    description: "Pair with your team on the hardest parts of the system.",
    includes: ["Architecture reviews", "Tech selection", "Hiring loops"],
    price: "Get in touch",
  },
  {
    title: "Code review & mentoring",
    description: "Weekly review sessions for individuals or small teams.",
    includes: ["PR reviews", "1:1 sessions", "Reading list"],
    price: "From $400 / month",
  },
];

export const tools = [
  {
    name: "kctl",
    slug: "kctl",
    description: "Kafka topic inspector and replayer for debugging event-driven systems.",
    longDescription: "kctl is a developer CLI tool that lets you inspect, replay, and debug Kafka topics without writing a single line of consumer code. Designed for teams working on event-driven microservice architectures, it surfaces messages in a readable format, supports offset control, and lets you pipe output into your own scripts.",
    category: "Built by me",
    techStack: ["Node.js", "TypeScript", "Apache Kafka", "Commander.js"],
    features: [
      "Inspect topic messages in real-time",
      "Replay messages from any offset",
      "Filter messages by key or header",
      "Export topic dumps as JSON",
      "Works with any Kafka-compatible broker",
    ],
    images: ["/project_placeholder_1_1778503449199.png", "/project_placeholder_2_1778503465369.png"],
    liveUrl: "#",
    url: "#",
  },
  {
    name: "envsync",
    slug: "envsync",
    description: "Safely sync .env files across your team without exposing secrets.",
    longDescription: "envsync solves the classic problem of sharing environment configuration across a dev team. Rather than emailing .env files or committing them by mistake, envsync encrypts them with a shared team key and lets each developer pull the latest config in one command. It integrates with your CI pipeline too.",
    category: "Built by me",
    techStack: ["Node.js", "TypeScript", "AES-256", "GitHub CLI"],
    features: [
      "AES-256 encrypted .env storage",
      "Team-based key sharing",
      "One-command push and pull",
      "CI/CD integration support",
      "Diff and audit trail of changes",
    ],
    images: ["/project_placeholder_2_1778503465369.png", "/project_placeholder_3_1778503481624.png"],
    liveUrl: "#",
    url: "#",
  },
  {
    name: "tsx",
    slug: "tsx",
    description: "Run TypeScript files instantly without a build step.",
    longDescription: "tsx is a lightweight Node.js enhancement that allows you to execute TypeScript and ESM files directly — no compilation needed. It's built on esbuild under the hood, making it extremely fast. Perfect for scripts, CLIs, and quick TypeScript experiments without the overhead of a full tsconfig setup.",
    category: "CLI",
    techStack: ["Node.js", "TypeScript", "esbuild"],
    features: [
      "Run .ts files like .js files",
      "Zero config required",
      "Supports ESM and CommonJS",
      "Watch mode for development",
      "Blazing fast via esbuild",
    ],
    images: ["/project_placeholder_3_1778503481624.png", "/project_placeholder_1_1778503449199.png"],
    liveUrl: "https://tsx.is",
    url: "https://tsx.is",
  },
  {
    name: "Bruno",
    slug: "bruno",
    description: "A fast and git-friendly API client that lives inside your repo.",
    longDescription: "Bruno is an open-source API client that stores your collections directly in your filesystem using its own plain text markup language, Bru. This means your API requests live next to your code, can be version-controlled with git, and reviewed in pull requests — no more Postman exports or sync issues.",
    category: "Web tools",
    techStack: ["Electron", "React", "Bru language", "Node.js"],
    features: [
      "Collections stored as plain text files",
      "Git-friendly — no binary formats",
      "No cloud sync required",
      "Supports environments and variables",
      "Open source and free",
    ],
    images: ["/project_placeholder_1_1778503449199.png", "/project_placeholder_3_1778503481624.png"],
    liveUrl: "https://www.usebruno.com",
    url: "https://www.usebruno.com",
  },
  {
    name: "Excalidraw",
    slug: "excalidraw",
    description: "A virtual whiteboard for sketching hand-drawn like diagrams.",
    longDescription: "Excalidraw is an open-source virtual whiteboard tool that lets you create diagrams with a beautiful hand-drawn aesthetic. Perfect for architecture diagrams, wireframes, and brainstorming sessions. It supports real-time collaboration, end-to-end encryption, and exports to SVG and PNG.",
    category: "Curated",
    techStack: ["React", "TypeScript", "Canvas API", "WebSockets"],
    features: [
      "Hand-drawn style diagrams",
      "Real-time collaboration",
      "End-to-end encrypted rooms",
      "Export to SVG and PNG",
      "Extensive shape library",
    ],
    images: ["/project_placeholder_2_1778503465369.png", "/project_placeholder_1_1778503449199.png"],
    liveUrl: "https://excalidraw.com",
    url: "https://excalidraw.com",
  },
  {
    name: "Tinybird",
    slug: "tinybird",
    description: "Realtime analytics over ClickHouse for developers.",
    longDescription: "Tinybird is a data platform that lets developers build and publish realtime data APIs on top of ClickHouse without managing infrastructure. You push events to Tinybird, write SQL, and instantly get a low-latency API endpoint. Ideal for building product analytics, dashboards, and event pipelines.",
    category: "Curated",
    techStack: ["ClickHouse", "SQL", "REST API", "Python"],
    features: [
      "Sub-second query latency",
      "Instant SQL-to-API publishing",
      "Streaming data ingestion",
      "Built-in versioning for pipes",
      "Free tier available",
    ],
    images: ["/project_placeholder_3_1778503481624.png", "/project_placeholder_2_1778503465369.png"],
    liveUrl: "https://www.tinybird.co",
    url: "https://www.tinybird.co",
  },
];

export const ecommerce = [
  { 
    name: "MacBook Pro M2", 
    slug: "macbook-pro-m2",
    description: "14-inch, 16GB RAM, 512GB SSD.", 
    longDescription: "The 14-inch MacBook Pro with M2 Pro and M2 Max takes power and speed to the next level, whether it's on battery or plugged in. With a stunning Liquid Retina XDR display, all the ports you need, and all-day battery life—this pro laptop goes anywhere you need.",
    price: 1999,
    category: "Laptops", 
    images: ["/project_placeholder_1_1778503449199.png", "/project_placeholder_2_1778503465369.png"],
    url: "#" 
  },
  { 
    name: "Clean Architecture", 
    slug: "clean-architecture",
    description: "A Craftsman's Guide to Software Structure and Design.", 
    longDescription: "Practical software architecture solutions from the legendary Robert C. Martin ('Uncle Bob'). By applying universal rules of software architecture, you can dramatically improve developer productivity throughout the life of any software system.",
    price: 34,
    category: "Books", 
    images: ["/project_placeholder_2_1778503465369.png", "/project_placeholder_3_1778503481624.png"],
    url: "#" 
  },
  { 
    name: "SanDisk 128GB", 
    slug: "sandisk-128gb",
    description: "Ultra Dual Drive Luxe USB Type-C Flash Drive.", 
    longDescription: "Looking for storage that works across your USB Type-C and Type-A devices? The all-metal SanDisk Ultra Dual Drive Luxe lets you easily move files between your USB Type-C smartphone, tablets and Macs and USB Type-A computers.",
    price: 18,
    category: "Pendrives", 
    images: ["/project_placeholder_3_1778503481624.png", "/project_placeholder_1_1778503449199.png"],
    url: "#" 
  },
  { 
    name: "Dell XPS 13", 
    slug: "dell-xps-13",
    description: "13.4-inch FHD+, Intel Core i7, 16GB RAM.", 
    longDescription: "Our thinnest and lightest 13-inch XPS is built for a lifestyle on the move. Expect long battery life with the new 12th Gen Intel Core processors. The 4-sided InfinityEdge display delivers stunning visuals in a compact form factor.",
    price: 1299,
    category: "Laptops", 
    images: ["/project_placeholder_1_1778503449199.png", "/project_placeholder_3_1778503481624.png"],
    url: "#" 
  },
  { 
    name: "Designing Data-Intensive Applications", 
    slug: "designing-data-intensive-apps",
    description: "The Big Ideas Behind Reliable, Scalable, and Maintainable Systems.", 
    longDescription: "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. In this comprehensive and practical guide, Martin Kleppmann helps you navigate this diverse landscape.",
    price: 42,
    category: "Books", 
    images: ["/project_placeholder_2_1778503465369.png", "/project_placeholder_1_1778503449199.png"],
    url: "#" 
  },
];

export const gallery = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  category: ["Nature", "Architecture", "Street", "Travel"][i % 4],
  location: ["Hyderabad", "Kerala", "Goa", "Ladakh", "Hampi"][i % 5],
  date: "2024",
  caption: ["Golden hour", "Lines and light", "A quiet street", "On the road", "Old stones"][i % 5],
  height: [220, 320, 280, 380, 240, 340][i % 6],
}));

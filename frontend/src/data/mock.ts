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
  },
  {
    slug: "dev-tools-cli",
    title: "Dev Tools CLI",
    description: "A typed CLI that scaffolds services, codegens DTOs, and runs project-wide refactors.",
    stack: ["Node.js", "TypeScript", "Commander.js"],
    category: "Open Source",
    github: "https://github.com/Shaik-Sameer77",
    featured: true,
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
  { name: "kctl", description: "Kafka topic inspector and replayer.", category: "Built by me", url: "#" },
  { name: "envsync", description: "Sync .env files across teammates safely.", category: "Built by me", url: "#" },
  { name: "tsx", description: "Run TypeScript files instantly.", category: "CLI", url: "#" },
  { name: "Bruno", description: "API client that lives in your repo.", category: "Web tools", url: "#" },
  { name: "Excalidraw", description: "Sketches that look like sketches.", category: "Curated", url: "#" },
  { name: "Tinybird", description: "Realtime analytics over ClickHouse.", category: "Curated", url: "#" },
];

export const gallery = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  category: ["Nature", "Architecture", "Street", "Travel"][i % 4],
  location: ["Hyderabad", "Kerala", "Goa", "Ladakh", "Hampi"][i % 5],
  date: "2024",
  caption: ["Golden hour", "Lines and light", "A quiet street", "On the road", "Old stones"][i % 5],
  height: [220, 320, 280, 380, 240, 340][i % 6],
}));

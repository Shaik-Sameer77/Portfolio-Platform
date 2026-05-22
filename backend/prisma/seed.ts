import 'dotenv/config';
import { PrismaClient, ProductType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const tools = [
  {
    name: 'kctl',
    slug: 'kctl',
    description: 'Kafka topic inspector and replayer for debugging event-driven systems.',
    longDescription: 'kctl is a developer CLI tool that lets you inspect, replay, and debug Kafka topics without writing a single line of consumer code. Designed for teams working on event-driven microservice architectures, it surfaces messages in a readable format, supports offset control, and lets you pipe output into your own scripts.',
    category: 'Built by me',
    techStack: ['Node.js', 'TypeScript', 'Apache Kafka', 'Commander.js'],
    features: [
      'Inspect topic messages in real-time',
      'Replay messages from any offset',
      'Filter messages by key or header',
      'Export topic dumps as JSON',
      'Works with any Kafka-compatible broker',
    ],
    images: ['/project_placeholder_1_1778503449199.png', '/project_placeholder_2_1778503465369.png'],
    url: '#',
    liveUrl: '#',
    type: ProductType.SOFTWARE,
  },
  {
    name: 'envsync',
    slug: 'envsync',
    description: 'Safely sync .env files across your team without exposing secrets.',
    longDescription: 'envsync solves the classic problem of sharing environment configuration across a dev team. Rather than emailing .env files or committing them by mistake, envsync encrypts them with a shared team key and lets each developer pull the latest config in one command. It integrates with your CI pipeline too.',
    category: 'Built by me',
    techStack: ['Node.js', 'TypeScript', 'AES-256', 'GitHub CLI'],
    features: [
      'AES-256 encrypted .env storage',
      'Team-based key sharing',
      'One-command push and pull',
      'CI/CD integration support',
      'Diff and audit trail of changes',
    ],
    images: ['/project_placeholder_2_1778503465369.png', '/project_placeholder_3_1778503481624.png'],
    url: '#',
    liveUrl: '#',
    type: ProductType.SOFTWARE,
  },
  {
    name: 'tsx',
    slug: 'tsx',
    description: 'Run TypeScript files instantly without a build step.',
    longDescription: "tsx is a lightweight Node.js enhancement that allows you to execute TypeScript and ESM files directly — no compilation needed. It's built on esbuild under the hood, making it extremely fast. Perfect for scripts, CLIs, and quick TypeScript experiments without the overhead of a full tsconfig setup.",
    category: 'CLI',
    techStack: ['Node.js', 'TypeScript', 'esbuild'],
    features: [
      'Run .ts files like .js files',
      'Zero config required',
      'Supports ESM and CommonJS',
      'Watch mode for development',
      'Blazing fast via esbuild',
    ],
    images: ['/project_placeholder_3_1778503481624.png', '/project_placeholder_1_1778503449199.png'],
    url: 'https://tsx.is',
    liveUrl: 'https://tsx.is',
    type: ProductType.SOFTWARE,
  },
  {
    name: 'Bruno',
    slug: 'bruno',
    description: 'A fast and git-friendly API client that lives inside your repo.',
    longDescription: 'Bruno is an open-source API client that stores your collections directly in your filesystem using its own plain text markup language, Bru. This means your API requests live next to your code, can be version-controlled with git, and reviewed in pull requests — no more Postman exports or sync issues.',
    category: 'Web tools',
    techStack: ['Electron', 'React', 'Bru language', 'Node.js'],
    features: [
      'Collections stored as plain text files',
      'Git-friendly — no binary formats',
      'No cloud sync required',
      'Supports environments and variables',
      'Open source and free',
    ],
    images: ['/project_placeholder_1_1778503449199.png', '/project_placeholder_3_1778503481624.png'],
    url: 'https://www.usebruno.com',
    liveUrl: 'https://www.usebruno.com',
    type: ProductType.SOFTWARE,
  },
  {
    name: 'Excalidraw',
    slug: 'excalidraw',
    description: 'A virtual whiteboard for sketching hand-drawn like diagrams.',
    longDescription: 'Excalidraw is an open-source virtual whiteboard tool that lets you create diagrams with a beautiful hand-drawn aesthetic. Perfect for architecture diagrams, wireframes, and brainstorming sessions. It supports real-time collaboration, end-to-end encryption, and exports to SVG and PNG.',
    category: 'Curated',
    techStack: ['React', 'TypeScript', 'Canvas API', 'WebSockets'],
    features: [
      'Hand-drawn style diagrams',
      'Real-time collaboration',
      'End-to-end encrypted rooms',
      'Export to SVG and PNG',
      'Extensive shape library',
    ],
    images: ['/project_placeholder_2_1778503465369.png', '/project_placeholder_1_1778503449199.png'],
    url: 'https://excalidraw.com',
    liveUrl: 'https://excalidraw.com',
    type: ProductType.SOFTWARE,
  },
  {
    name: 'Tinybird',
    slug: 'tinybird',
    description: 'Realtime analytics over ClickHouse for developers.',
    longDescription: 'Tinybird is a data platform that lets developers build and publish realtime data APIs on top of ClickHouse without managing infrastructure. You push events to Tinybird, write SQL, and instantly get a low-latency API endpoint. Ideal for building product analytics, dashboards, and event pipelines.',
    category: 'Curated',
    techStack: ['ClickHouse', 'SQL', 'REST API', 'Python'],
    features: [
      'Sub-second query latency',
      'Instant SQL-to-API publishing',
      'Streaming data ingestion',
      'Built-in versioning for pipes',
      'Free tier available',
    ],
    images: ['/project_placeholder_3_1778503481624.png', '/project_placeholder_2_1778503465369.png'],
    url: 'https://www.tinybird.co',
    liveUrl: 'https://www.tinybird.co',
    type: ProductType.SOFTWARE,
  },
];

const ecommerce = [
  {
    name: 'MacBook Pro M2',
    slug: 'macbook-pro-m2',
    description: '14-inch, 16GB RAM, 512GB SSD.',
    longDescription: 'The 14-inch MacBook Pro with M2 Pro and M2 Max takes power and speed to the next level, whether it is on battery or plugged in. With a stunning Liquid Retina XDR display, all the ports you need, and all-day battery life—this pro laptop goes anywhere you need.',
    price: 1999,
    category: 'Laptops',
    images: ['/project_placeholder_1_1778503449199.png', '/project_placeholder_2_1778503465369.png'],
    url: '#',
    type: ProductType.ECOMMERCE,
  },
  {
    name: 'Clean Architecture',
    slug: 'clean-architecture',
    description: "A Craftsman's Guide to Software Structure and Design.",
    longDescription: "Practical software architecture solutions from the legendary Robert C. Martin ('Uncle Bob'). By applying universal rules of software architecture, you can dramatically improve developer productivity throughout the life of any software system.",
    price: 34,
    category: 'Books',
    images: ['/project_placeholder_2_1778503465369.png', '/project_placeholder_3_1778503481624.png'],
    url: '#',
    type: ProductType.ECOMMERCE,
  },
  {
    name: 'SanDisk 128GB',
    slug: 'sandisk-128gb',
    description: 'Ultra Dual Drive Luxe USB Type-C Flash Drive.',
    longDescription: 'Looking for storage that works across your USB Type-C and Type-A devices? The all-metal SanDisk Ultra Dual Drive Luxe lets you easily move files between your USB Type-C smartphone, tablets and Macs and USB Type-A computers.',
    price: 18,
    category: 'Pendrives',
    images: ['/project_placeholder_3_1778503481624.png', '/project_placeholder_1_1778503449199.png'],
    url: '#',
    type: ProductType.ECOMMERCE,
  },
  {
    name: 'Dell XPS 13',
    slug: 'dell-xps-13',
    description: '13.4-inch FHD+, Intel Core i7, 16GB RAM.',
    longDescription: 'Our thinnest and lightest 13-inch XPS is built for a lifestyle on the move. Expect long battery life with the new 12th Gen Intel Core processors. The 4-sided InfinityEdge display delivers stunning visuals in a compact form factor.',
    price: 1299,
    category: 'Laptops',
    images: ['/project_placeholder_1_1778503449199.png', '/project_placeholder_3_1778503481624.png'],
    url: '#',
    type: ProductType.ECOMMERCE,
  },
  {
    name: 'Designing Data-Intensive Applications',
    slug: 'designing-data-intensive-apps',
    description: 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems.',
    longDescription: 'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. In this comprehensive and practical guide, Martin Kleppmann helps you navigate this diverse landscape.',
    price: 42,
    category: 'Books',
    images: ['/project_placeholder_2_1778503465369.png', '/project_placeholder_1_1778503449199.png'],
    url: '#',
    type: ProductType.ECOMMERCE,
  },
];

async function main() {
  console.log('Seeding products...');

  const count = await prisma.product.count();
  if (count > 0) {
    console.log('Products already exist. Skipping seed.');
    return;
  }

  for (const t of tools) {
    await prisma.product.create({
      data: t,
    });
  }

  for (const e of ecommerce) {
    await prisma.product.create({
      data: e,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

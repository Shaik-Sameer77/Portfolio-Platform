// Vercel serverless entry point
// Only dynamic imports — @vercel/node compiles this trivially without
// needing to resolve Prisma types or NestJS internals.

let server: any;

async function getServer() {
  if (!server) {
    const mod = await import('../dist/serverless.js');
    server = await mod.createServer();
  }
  return server;
}

export default async function handler(req: any, res: any) {
  const app = await getServer();
  app(req, res);
}

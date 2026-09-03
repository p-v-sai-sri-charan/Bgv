import type { NextConfig } from "next";

/**
 * Extra origins allowed to invoke Server Actions (login, onboarding forms, …).
 * Next only trusts the same origin by default, which breaks when the app is
 * reached through a proxy or tunnel (VS Code / GitHub dev tunnels, ngrok, a
 * load balancer). Add hosts via the ALLOWED_ORIGINS env var (comma-separated),
 * e.g. ALLOWED_ORIGINS="app.example.com,*.trycloudflare.com".
 */
const allowedOrigins = [
  "localhost:3000",
  "localhost",
  "127.0.0.1:3000",
  "**.devtunnels.ms",
  "**.github.dev",
  "**.githubpreview.dev",
  "**.ngrok-free.app",
  "**.ngrok.io",
  "**.trycloudflare.com",
  ...(process.env.ALLOWED_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? []),
];

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle (.next/standalone) so the Docker
  // runtime image only needs Node + the built app, no full node_modules.
  output: "standalone",

  // The Prisma client is generated into src/generated/prisma (see
  // prisma/schema.prisma). Next's file tracer doesn't reliably pick up its
  // runtime + wasm, so force every route's trace to include the whole folder —
  // without this the standalone server 500s on the first DB query.
  outputFileTracingIncludes: {
    "/**": ["./src/generated/prisma/**/*"],
  },

  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;

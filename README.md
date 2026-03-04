# ead-lms

A full-stack TypeScript monorepo built with fastify+nextjs para uma plataforma de cursos a distancia/presencial

## Quick Start

```bash
pnpm install
docker compose up -d
pnpm db:migrate
pnpm dev
```

## What's Running

- **Web:** http://localhost:3000
- **API:** http://localhost:8080
- **API Docs:** http://localhost:8080/docs

## Project Structure

```
ead-lms/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Fastify backend
└── packages/
    ├── types/        # Shared Zod schemas
    ├── utils/        # Shared utilities
    └── ui/           # Shared UI components
```

## Database

```bash
pnpm db:studio        # Open Prisma Studio
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
```

---

Built with [Blitzpack](https://github.com/CarboxyDev/blitzpack)

# Astro + Cloudflare Durable Objects Demo

A minimal example showing how to use Cloudflare Durable Objects with Astro for persistent storage.

## Features

- **Persistent Counter**: A simple counter that maintains state across deployments
- **Durable Objects**: Demonstrates Cloudflare's stateful serverless objects
- **Minimal Setup**: Clean, simple implementation with minimal code

## Project Structure

```
/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Homepage with counter demo
│   │   └── api/
│   │       └── counter.ts       # API routes for counter operations
│   └── worker.ts                # Durable Object implementation
├── wrangler.jsonc               # Cloudflare Workers configuration
└── astro.config.mjs             # Astro configuration
```

## API Endpoints

- `GET /api/counter` - Get current counter value (returns plain text)
- `POST /api/counter` - Increment counter and return new value (returns plain text)

## Setup & Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Generate TypeScript types**
   ```bash
   npx wrangler@latest types
   ```

3. **Start development server**
   ```bash
   npx wrangler@latest dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

Deploy to Cloudflare Workers:

```bash
npx wrangler@latest deploy
```

The Durable Object will be automatically created and bound according to the configuration in `wrangler.jsonc`.

## How It Works

1. **Durable Object**: `CounterDurableObject` stores a persistent counter value
2. **API Routes**: Simple endpoints that interact with the Durable Object
3. **Frontend**: Basic HTML/JS interface that calls the API endpoints

The counter value persists across deployments and is globally consistent across all requests.

## Key Files

- `src/worker.ts` - Durable Object class with storage operations
- `src/pages/api/counter.ts` - API endpoints that proxy to the Durable Object
- `wrangler.jsonc` - Durable Object binding configuration
- `astro.config.mjs` - Astro + Cloudflare adapter configuration
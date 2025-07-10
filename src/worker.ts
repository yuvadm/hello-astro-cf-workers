import type { SSRManifest } from 'astro';
import { App } from 'astro/app';
import { handle } from '@astrojs/cloudflare/handler';
import { DurableObject } from 'cloudflare:workers';

class CounterDurableObject extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/get') {
      const count = (await this.ctx.storage.get<number>('count')) || 0;
      return new Response(count.toString());
    }

    if (url.pathname === '/increment') {
      const count = (await this.ctx.storage.get<number>('count')) || 0;
      const newCount = count + 1;
      await this.ctx.storage.put('count', newCount);
      return new Response(newCount.toString());
    }

    return new Response('Not found', { status: 404 });
  }
}

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(request, env, ctx) {
        return handle(manifest, app, request as any, env as any, ctx);
      }
    } satisfies ExportedHandler<Env>,
    CounterDurableObject: CounterDurableObject,
  };
}
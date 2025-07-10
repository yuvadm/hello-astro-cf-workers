import type { SSRManifest } from 'astro';
import { App } from 'astro/app';
import { handle } from '@astrojs/cloudflare/handler';
import { DurableObject } from 'cloudflare:workers';

interface Env {
  COUNTER_DO: DurableObjectNamespace;
}

class CounterDurableObject extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === '/increment') {
      const currentValue = (await this.ctx.storage.get<number>('counter')) || 0;
      const newValue = currentValue + 1;
      await this.ctx.storage.put('counter', newValue);

      return new Response(JSON.stringify({
        counter: newValue,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/get') {
      const currentValue = (await this.ctx.storage.get<number>('counter')) || 0;
      return new Response(JSON.stringify({
        counter: currentValue,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/reset') {
      await this.ctx.storage.put('counter', 0);
      return new Response(JSON.stringify({
        counter: 0,
        message: 'Counter reset',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
}

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(request, env, ctx) {
        return handle(manifest, app, request, env, ctx);
      }
    } satisfies ExportedHandler<Env>,
    CounterDurableObject: CounterDurableObject,
  };
}
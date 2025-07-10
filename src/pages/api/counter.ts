import type { APIRoute } from 'astro';

interface Env {
  COUNTER_DO: DurableObjectNamespace;
}

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env as Env;
  if (!env?.COUNTER_DO) {
    return new Response(JSON.stringify({ error: 'Durable Object not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const id = env.COUNTER_DO.idFromName('global-counter');
  const stub = env.COUNTER_DO.get(id);

  const response = await stub.fetch(new Request('https://counter.do/get'));
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env as Env;
  if (!env?.COUNTER_DO) {
    return new Response(JSON.stringify({ error: 'Durable Object not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action') || 'increment';

  const id = env.COUNTER_DO.idFromName('global-counter');
  const stub = env.COUNTER_DO.get(id);

  let doRequest: Request;
  switch (action) {
    case 'reset':
      doRequest = new Request('https://counter.do/reset');
      break;
    case 'increment':
    default:
      doRequest = new Request('https://counter.do/increment');
      break;
  }

  const response = await stub.fetch(doRequest);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
};
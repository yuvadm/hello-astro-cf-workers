import type { APIRoute } from 'astro';

interface Env {
  COUNTER_DO: DurableObjectNamespace;
}

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env as Env;
  const id = env.COUNTER_DO.idFromName('counter');
  const stub = env.COUNTER_DO.get(id);
  const response = await stub.fetch('https://counter.do/get');
  return response;
};

export const POST: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env as Env;
  const id = env.COUNTER_DO.idFromName('counter');
  const stub = env.COUNTER_DO.get(id);
  const response = await stub.fetch('https://counter.do/increment');
  return response;
};
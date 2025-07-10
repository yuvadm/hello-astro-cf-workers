import type { APIRoute } from 'astro';

const getEnv = (locals: any) => (locals as any).runtime.env as Env;

export const GET: APIRoute = async ({ locals }) => {
  const env = getEnv(locals);
  const id = env.COUNTER_DO.idFromName('counter');
  const stub = env.COUNTER_DO.get(id);
  const response = await stub.fetch('https://counter.do/get');
  return response;
};

export const POST: APIRoute = async ({ locals }) => {
  const env = getEnv(locals);
  const id = env.COUNTER_DO.idFromName('counter');
  const stub = env.COUNTER_DO.get(id);
  const response = await stub.fetch('https://counter.do/increment');
  return response;
};
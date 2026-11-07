import type { APIRoute } from 'astro';
import { renderRobots } from '../lib/seo/robots';

export const GET: APIRoute = () =>
  new Response(renderRobots(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

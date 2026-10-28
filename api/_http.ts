import type { IncomingMessage, ServerResponse } from 'node:http';
export type ApiRequest = IncomingMessage & { body?: unknown };
export function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(data));
}
export async function bodyOf(req: ApiRequest) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 30000) throw new Error('Pedido muito grande.'); }
  return JSON.parse(raw);
}

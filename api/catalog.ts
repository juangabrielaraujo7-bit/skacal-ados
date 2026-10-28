import { getCatalog } from './_catalog.js';
import { json, type ApiRequest } from './_http.js';
import type { ServerResponse } from 'node:http';
export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Método não permitido.' });
  try { json(res, 200, await getCatalog()); } catch { json(res, 503, { error: 'Catálogo temporariamente indisponível. Tente novamente.' }); }
}

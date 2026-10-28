import { getCatalog } from './_catalog.js';
import { bodyOf, json, type ApiRequest } from './_http.js';
import { prepareQuote } from '../shared/order.js';
import type { ServerResponse } from 'node:http';
export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método não permitido.' });
  let body;
  try { body = await bodyOf(req); } catch { return json(res, 400, { error: 'Pedido inválido.' }); }
  let catalog;
  try { catalog = await getCatalog(); } catch { return json(res, 503, { error: 'Não foi possível conferir o catálogo. Tente novamente antes de preparar o pedido.' }); }
  try { const quote = prepareQuote(catalog, body?.items, body?.receiving); json(res, quote.issues.length ? 409 : 200, quote); }
  catch (error) { json(res, 400, { error: error instanceof Error ? error.message : 'Pedido inválido.' }); }
}

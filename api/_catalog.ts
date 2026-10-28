import { demoCatalog } from '../shared/demo.js';
import type { Catalog, Product } from '../shared/types.js';
export async function getCatalog(): Promise<Catalog> {
  const project = process.env.SANITY_PROJECT_ID;
  if (!project) return structuredClone(demoCatalog);
  if (!/^[a-z0-9]+$/.test(project)) throw new Error('Projeto Sanity inválido.');
  const dataset = process.env.SANITY_DATASET || 'production';
  if (!/^[a-z0-9_-]+$/.test(dataset)) throw new Error('Dataset inválido.');
  // Fresh origin query, published perspective; no CDN or browser token.
  const query = `{"products": *[_type == "product" && !(_id in path("drafts.**"))]{"id":_id,name,reference,"category":category->name,"line":line->name,"brand":brand->name,audience,description,specifications,price,salePrice,featured,requiresSize,variants[]{"id":_key,color,hex,available,sizes[]{size,available},"images":images[].asset->url}},"settings":*[_type=="settings" && _id=="settings"][0]{whatsapp,bannerTitle,bannerText,bannerCategory,"bannerImage":bannerImage.asset->url}}`;
  const url = `https://${project}.api.sanity.io/v2026-03-01/data/query/${dataset}?perspective=published&query=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: process.env.SANITY_API_READ_TOKEN ? { Authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}` } : {}, cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Não foi possível consultar o catálogo. Tente novamente.');
  const { result } = await response.json();
  if (!Array.isArray(result?.products)) throw new Error('Catálogo inválido.');
  const products: Product[] = result.products.filter((p: Product) => p.id && p.reference && Number.isFinite(p.price) && p.price > 0 && p.variants?.length).map((p: Product) => ({ ...p, specifications: p.specifications || [], line: p.line || '', variants: p.variants.map(v => ({ ...v, images: v.images || [], sizes: v.sizes || [] })) }));
  return { mode: 'live', products, settings: { whatsapp: '', bannerTitle: 'Seu novo favorito.', bannerText: 'Conheça a seleção da SKA Calçados.', bannerImage: '', bannerCategory: 'Todos', ...result.settings } };
}


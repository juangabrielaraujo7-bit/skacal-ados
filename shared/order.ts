import { itemKey, money, priceOf, type Catalog, type CartItem, type Receiving, type Quote } from './types.js';
export function prepareQuote(catalog: Catalog, input: unknown, receiving: Receiving): Quote {
  if (receiving !== 'pickup' && receiving !== 'delivery') throw new Error('Escolha como deseja receber.');
  if (!Array.isArray(input) || input.length < 1 || input.length > 50) throw new Error('O pedido precisa ter entre 1 e 50 variações.');
  const issues: string[] = [], items: CartItem[] = [];
  const seen = new Set<string>();
  for (const entry of input) {
    if (!entry || typeof entry !== 'object') throw new Error('Item de pedido inválido.');
    const { productId, variantId, size, quantity } = entry;
    if (typeof productId !== 'string' || typeof variantId !== 'string' || typeof size !== 'string' || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Variação ou quantidade inválida. Use de 1 a 99 unidades.');
    const key = itemKey({ productId, variantId, size });
    if (seen.has(key)) throw new Error('Variação repetida no pedido.');
    seen.add(key);
    const p = catalog.products.find(p => p.id === productId);
    const v = p?.variants.find(v => v.id === variantId);
    if (!p || !v) { issues.push('Um produto ou cor foi removido do catálogo. Remova o item do carrinho.'); continue; }
    if (!v.available || (p.requiresSize && !v.sizes.some(s => s.size === size && s.available))) { issues.push(`${p.name}, ${v.color}${size ? `, nº ${size}` : ''}: indisponível. Remova ou escolha outra variação.`); continue; }
    if (!p.requiresSize && size !== '') throw new Error('Este produto não possui numeração.');
    items.push({ productId, variantId, size, quantity, unitPrice: priceOf(p), name: p.name, reference: p.reference, color: v.color, image: v.images[0] });
  }
  const subtotal = items.reduce((total, item) => total + Math.round(item.unitPrice * 100) * item.quantity, 0) / 100;
  const message = issues.length ? '' : [catalog.mode === 'demo' ? 'DEMONSTRAÇÃO SKA CALÇADOS\nProdutos, preços e disponibilidade ilustrativos. Valores não validados para compra real.' : 'Olá, SKA Calçados! Gostaria de confirmar este pedido:', '', ...items.map(i => `${i.quantity}x ${i.name}\nRef.: ${i.reference} | Cor: ${i.color} | ${i.size ? `Número: ${i.size}` : 'Sem numeração'}\nUnitário: ${money(i.unitPrice)} | Produtos: ${money(i.unitPrice * i.quantity)}`), '', `Subtotal dos produtos: ${money(subtotal)}`, receiving === 'pickup' ? 'Recebimento: retirada na loja (a combinar).' : 'Recebimento: entrega a combinar pelo WhatsApp. Endereço e frete serão definidos no atendimento. Frete não incluído no subtotal.', 'Pedido sujeito à confirmação de disponibilidade pela loja. Não reserva produtos.'].join('\n');
  return { mode: catalog.mode, items, issues, subtotal, message, whatsapp: catalog.settings.whatsapp };
}

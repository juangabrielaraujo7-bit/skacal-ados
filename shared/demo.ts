import { expandedProducts } from './expanded-products.js';
import type { Catalog, Product, Variant } from './types.js';
const photos = (id: number) => [1, 2, 3].map(n => `/assets/p${id}-${n}.webp`);
const sizes = (male = false, missing = '35') => (male ? ['37','38','39','40','41','42','43'] : ['34','35','36','37','38','39']).map(size => ({ size, available: size !== missing }));
const variant = (id: string, color: string, hex: string, images: string[], male = false): Variant => ({ id, color, hex, images, available: true, sizes: sizes(male) });
function product(id: string, name: string, category: string, price: number, variants: Variant[], options: Partial<Product> = {}): Product {
  return { id, name, category, price, variants, reference: `SKA-${id}`, audience: 'Feminino', line: 'Essenciais', description: 'Um modelo versátil para acompanhar suas combinações do dia a dia. Escolha a cor e a numeração para montar seu pedido.', specifications: ['Produto e fotografia de referência para demonstração.', 'Detalhes de materiais e medidas serão cadastrados pela loja.'], featured: false, requiresSize: true, ...options };
}
export const demoCatalog: Catalog = {
  mode: 'demo',
  settings: { whatsapp: '', bannerTitle: 'Seu novo favorito.', bannerText: 'Escolhas para todos os seus momentos. Encontre o par que combina com você.', bannerImage: '/assets/p187-2.webp', bannerCategory: 'Ofertas' },
  products: [
    ...expandedProducts,
    product('1001', 'Sapatilha Essencial', 'Sapatilhas', 119.90, [variant('preto', 'Preto', '#282724', photos(188))], { salePrice: 89.90, featured: true, line: 'Ska Confort' }),
    product('1002', 'Rasteira Tiras Douradas', 'Rasteiras', 99.90, [variant('dourado', 'Dourado', '#bd9949', ['/assets/rasteira.jpg'])], { salePrice: 79.90, featured: true }),
    product('1003', 'Mocassim Detalhe Metal', 'Mocassins', 169.90, [variant('bege', 'Bege', '#d4c4a5', ['/assets/mocassim.png'])], { featured: true, line: 'Ska Confort' }),
    product('1004', 'Tênis Casual Color', 'Tênis casuais', 199.90, [variant('colorido', 'Colorido', '#d7b945', photos(90))], { salePrice: 159.90, featured: true }),
    product('1005', 'Scarpin Clássico', 'Scarpins', 149.90, [variant('preto', 'Preto', '#292826', photos(185)), { ...variant('dourado', 'Dourado', '#c3a06b', photos(187)), sizes: sizes(false, '38') }], { salePrice: 129.90, featured: true }),
    product('1006', 'Tamanco Salto Bloco', 'Tamancos', 139.90, [variant('preto', 'Preto', '#292826', photos(186))], { featured: true }),
    product('1007', 'Anabela Natural', 'Anabelas', 179.90, [variant('bege', 'Bege', '#d4c4a5', ['/assets/anabela.jpg'])]),
    product('1008', 'Bota Cano Curto', 'Botas', 239.90, [variant('preto', 'Preto', '#292826', ['/assets/bota.jpg'])], { variants: [{ ...variant('preto', 'Preto', '#292826', ['/assets/bota.jpg']), sizes: sizes().map(s => ({ ...s, available: false })), available: false }] }),
    product('1009', 'Slip-on Dia a Dia', 'Slip-on', 149.90, [variant('branco', 'Branco', '#f5f4f0', ['/assets/slipon.jpg'])], { line: 'Ska Confort', featured: true }),
    product('1010', 'Tênis Casual Urbano', 'Sapatênis', 219.90, [variant('branco-vermelho', 'Branco e vermelho', '#b73b36', photos(91), true)], { audience: 'Masculino', salePrice: 189.90 }),
    product('1011', 'Social Clássico', 'Sociais', 229.90, [variant('preto', 'Preto', '#292826', ['/assets/social.jpg'], true)], { audience: 'Masculino' }),
    product('1012', 'Sandália Casual', 'Sandálias', 159.90, [variant('cafe', 'Café', '#644633', ['/assets/sandalia.jpg'], true)], { audience: 'Masculino' }),
    product('1013', 'Bolsa Everyday', 'Bolsas e acessórios', 189.90, [{ ...variant('caramelo', 'Caramelo', '#a97143', photos(173)), sizes: [] }], { requiresSize: false, featured: true, salePrice: 159.90 }),
    product('1014', 'Bolsa City', 'Bolsas e acessórios', 169.90, [{ ...variant('preto', 'Preto', '#292826', photos(176)), sizes: [] }], { requiresSize: false }),
  ],
};



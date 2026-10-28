export const slug = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const brands = [
  { name: 'Ska Confort', logo: '/assets/ska-logo.png', text: 'Leveza para acompanhar a sua rotina. Conheça a linha da SKA.' },
  { name: 'Usaflex', logo: '/assets/brands/usaflex.svg', text: 'Uma seleção de modelos que une conforto e estilo em cada passo.' },
  { name: 'MZQ (Mezzo Punto)', logo: '/assets/brands/mezzo.png', text: 'Personalidade nos detalhes. Descubra os modelos da Mezzo Punto.' },
  { name: 'Vizzano', logo: '/assets/brands/vizzano.png', text: 'Do casual às ocasiões especiais. Encontre o seu próximo favorito.' },
  { name: 'Democrata', logo: '/assets/brands/democrata.svg', text: 'Escolhas masculinas para o trabalho, os encontros e o dia a dia.' },
  { name: 'New Face', logo: '/assets/brands/newface.png', text: 'Sandálias e combinações casuais para dias cheios de possibilidades.' },
  { name: 'WJ Acessórios', logo: '/assets/brands/wj.svg', text: 'Bolsas que acompanham você e dão o toque final ao seu estilo.' },
];
export function categoryPath(name: string) {
  if (name === 'Todos') return '/catalogo';
  if (name === 'Ofertas') return '/ofertas';
  if (name === 'Destaques') return '/destaques';
  if (name === 'Feminino' || name === 'Masculino') return `/${slug(name)}`;
  if (brands.some(b => b.name === name)) return `/marcas/${slug(name)}`;
  return `/categoria/${slug(name)}`;
}
export function resolvePage(path: string, categories: string[]) {
  if (path === '/' || path === '/catalogo' || path === '/busca') return 'Todos';
  return [...categories, ...brands.map(b => b.name), 'Feminino', 'Masculino', 'Ofertas', 'Destaques'].find(c => categoryPath(c) === path) || null;
}

import type { MouseEvent, ReactNode } from 'react';
import { ArrowRight, CaretRight } from '@phosphor-icons/react';
import { brands, categoryPath } from '../shared/navigation';
import type { Product } from '../shared/types';

export function BrandMark({ line = 'CALÇADOS' }: { line?: string }) {
  return <span className="brand-lockup" role="img" aria-label={`SKA ${line === 'CONFORT' ? 'Confort' : 'Calçados'}`}><span className="brand-wordmark">SKA</span><span className="brand-subtitle">{line}</span></span>;
}
export function navigate(path: string) {
  history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}
export function PageLink({ to, children, className, ...rest }: { to: string; children: ReactNode; className?: string; 'aria-current'?: 'page' }) {
  function follow(e: MouseEvent<HTMLAnchorElement>) { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); navigate(to); } }
  return <a href={to} onClick={follow} className={className} {...rest}>{children}</a>;
}
export function BrandStrip() {
  return <section className="brand-section container" id="marcas" aria-label="Compre por marca"><div className="brand-intro"><strong>Nossas marcas</strong></div><div className="brand-logos">{brands.map(b => <PageLink key={b.name} to={categoryPath(b.name)} className={`brand-tile ${b.name === 'Ska Confort' ? 'own-brand' : ''}`}>{b.name === 'Ska Confort' ? <BrandMark line="CONFORT"/> : <img src={b.logo} alt={b.name}/>}</PageLink>)}</div></section>;
}
export function CategoryTiles({ products }: { products: Product[] }) {
  const groups = ['Sapatilhas', 'Sandálias', 'Rasteiras', 'Tênis casuais', 'Mocassins', 'Botas', 'Bolsas e acessórios'];
  const preferred: Record<string,string> = { Sapatilhas:'1001', Sandálias:'brand-0', Rasteiras:'brand-20', 'Tênis casuais':'brand-13', Mocassins:'1003', Botas:'1008', 'Bolsas e acessórios':'brand-26' };
  return <section className="category-shopping container"><div className="section-heading"><div><h2>Qual é o seu estilo hoje?</h2></div><PageLink to="/catalogo" className="text-button">Ver tudo <ArrowRight size={17}/></PageLink></div><div className="category-pictures">{groups.map(name => { const p=products.find(p=>p.id===preferred[name]) || products.find(p=>p.category===name);return p && <PageLink key={name} to={categoryPath(name)}><div><img src={p.variants[0].images[0]} alt="" loading="lazy"/></div><span>{name === 'Bolsas e acessórios' ? 'Bolsas' : name}<CaretRight size={13}/></span></PageLink>; })}</div></section>;
}
export function CategoryIntro({ category, products, query }: { category: string | null; products: Product[]; query?: string }) {
  const brand = brands.find(b=>b.name===category);
  const total=products.filter(p=>p.category===category||p.brand===category||p.line===category||p.audience===category).length;
  return <div className="container listing-intro"><nav className="breadcrumbs" aria-label="Você está aqui"><PageLink to="/">Início</PageLink><CaretRight size={12}/><PageLink to="/catalogo">Catálogo</PageLink>{category !== 'Todos' && <><CaretRight size={12}/><span>{category || 'Página não encontrada'}</span></>}</nav><div className="listing-banner">{brand && (brand.name === 'Ska Confort' ? <BrandMark line="CONFORT"/> : <img src={brand.logo} alt={brand.name}/>)}<div><h1>{query ? `Busca por “${query}”` : category === 'Todos' ? 'Todo o catálogo' : category || 'Página não encontrada'}</h1><p>{brand?.text || (category==='Ofertas' ? 'Favoritos com preços especiais. Encontre a sua próxima boa escolha.' : 'Explore os modelos, compare os detalhes e encontre o que combina com você.')}</p></div>{total>0 && <span className="listing-watermark">SKA<span>CALÇADOS</span></span>}</div></div>;
}

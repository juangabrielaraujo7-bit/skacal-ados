import { storeWhatsapp } from '../shared/contact.js';
import { brands, categoryPath, resolvePage } from '../shared/navigation';
import { BrandStrip, CategoryTiles, CategoryIntro, PageLink, navigate } from './Storefront';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowLeft, Bag, MagnifyingGlass, X, Plus, Minus, Trash, Check, SlidersHorizontal, WhatsappLogo, Storefront, Truck, CaretDown, Star, Package, WarningCircle } from '@phosphor-icons/react';
import { itemKey, money, priceOf, type Catalog, type CartItem, type Product, type Quote, type Receiving } from '../shared/types';

const storageKey = 'ska-cart-v1';
function loadCart(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(saved)) return [];
    const seen = new Set<string>();
    return saved.filter(i => {
      if (!i || typeof i.productId !== 'string' || typeof i.variantId !== 'string' || typeof i.size !== 'string' || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 99 || !Number.isFinite(i.unitPrice) || i.unitPrice <= 0 || typeof i.name !== 'string' || typeof i.color !== 'string' || typeof i.reference !== 'string' || typeof i.image !== 'string') return false;
      const key = itemKey(i); if (seen.has(key)) return false; seen.add(key); return true;
    }).slice(0,50);
  } catch { return []; }
}
function Modal({ children, title, close, drawer = false }: { children: ReactNode; title: string; close: () => void; drawer?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal(); document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = ''; previous?.focus(); };
  }, []);
  return <dialog ref={ref} aria-label={title} className={drawer ? 'modal drawer' : 'modal'} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className="dialog-inner"><button className="icon-button close" aria-label="Fechar" onClick={close}><X size={23} /></button>{children}</div>
  </dialog>;
}
function ProductImage({ src, alt, ...props }: { src: string; alt: string; className?: string; loading?: 'lazy' | 'eager' }) {
  return <img src={src} alt={alt} {...props} onError={e => { const img = e.currentTarget; img.hidden = true; const parent = img.parentElement; if (parent && !parent.querySelector('.photo-fallback')) { const fallback = document.createElement('span'); fallback.className = 'photo-fallback'; fallback.textContent = 'Fotografia em atualização'; parent.appendChild(fallback); } }} />;
}
function Price({ product }: { product: Product }) { return <div className="price">{priceOf(product) < product.price && <del>{money(product.price)}</del>}<strong>{money(priceOf(product))}</strong></div>; }

function ProductDetail({ product: p, demo, add, help }: { product: Product; demo: boolean; add: (i: CartItem) => void; help: (text: string) => void }) {
  const [color, setColor] = useState(''), [size, setSize] = useState(''), [image, setImage] = useState(0), [error, setError] = useState('');
  const selected = p.variants.find(v => v.id === color);
  const shown = selected || p.variants[0];
  const available = selected?.available && (!p.requiresSize || selected.sizes.some(s => s.available));
  function onAdd() {
    if (!selected) { setError('Selecione uma cor para continuar.'); return; }
    if (p.requiresSize && !size) { setError('Selecione uma numeração disponível.'); return; }
    if (!available) { setError('Esta variação está indisponível.'); return; }
    add({ productId: p.id, variantId: selected.id, size, quantity: 1, unitPrice: priceOf(p), name: p.name, reference: p.reference, color: selected.color, image: selected.images[0] });
  }
  return <div className="product-detail">
    <div className="gallery"><div className="gallery-main"><ProductImage src={shown.images[image]} alt={`${p.name} na cor ${shown.color}, vista ${image + 1}`} /></div><div className="thumbnails">{shown.images.map((src, index) => <button key={src} aria-label={`Ver foto ${index + 1}`} aria-pressed={image === index} onClick={() => setImage(index)}><ProductImage src={src} alt="" /></button>)}</div><span className="muted small">{demo ? 'Fotografias ilustrativas. Catálogo de demonstração.' : 'Confira os detalhes e as variações disponíveis.'}</span></div>
    <div className="product-info"><p className="eyebrow">{p.brand || p.line || p.audience} / {p.category}</p><h2>{p.name}</h2><p className="reference">Referência {p.reference}</p><Price product={p} /><p className="description">{p.description}</p>
      <fieldset><legend>Cor <span>{selected ? selected.color : 'Selecione'}</span></legend><div className="color-options">{p.variants.map(v => <button key={v.id} onClick={() => { setColor(v.id); setSize(''); setImage(0); setError(''); }} aria-pressed={color === v.id} className={color === v.id ? 'selected' : ''}><span className="swatch" style={{ background: v.hex }} />{v.color}{!v.available && ' (esgotado)'}</button>)}</div></fieldset>
      {p.requiresSize ? <fieldset><legend>Numeração <span>{!selected ? 'Escolha primeiro a cor' : size || 'Selecione'}</span></legend><div className="size-options">{shown.sizes.map(s => <button key={s.size} disabled={!selected || !s.available || !shown.available} title={!s.available || !shown.available ? 'Indisponível nesta cor' : `Número ${s.size}`} aria-pressed={size === s.size} onClick={() => { setSize(s.size); setError(''); }} className={size === s.size ? 'selected' : ''}>{s.size}</button>)}</div>{selected && !available && <p className="inline-error">Esta cor está esgotada.</p>}</fieldset> : <p className="no-size"><Check size={16} /> Este produto não exige numeração.</p>}
      {error && <p className="inline-error" role="alert">{error}</p>}
      <button className="primary full" onClick={onAdd} disabled={!!selected && !available}><Bag size={20} />Adicionar ao carrinho<ArrowRight size={19} /></button>
      <button className="text-button help-product" onClick={() => help(`Olá, SKA! Tenho uma dúvida sobre ${p.name}, referência ${p.reference}.${selected ? ` Cor: ${selected.color}.` : ''}${size ? ` Número: ${size}.` : ''}`)}><WhatsappLogo size={20} />Tirar uma dúvida sobre este produto</button>
      <div className="product-notice"><Package size={19} /><p>Disponibilidade sujeita à confirmação da loja. Adicionar ao carrinho não reserva o produto.</p></div>
      <details className="specs"><summary>Detalhes do produto<CaretDown /></summary><ul>{p.specifications.map(s => <li key={s}>{s}</li>)}</ul></details>
    </div>
  </div>;
}

export function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null), [catalogError, setCatalogError] = useState(''), [refreshing, setRefreshing] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(loadCart), [cartOpen, setCartOpen] = useState(false), [hash, setHash] = useState(location.hash);
  const [search, setSearch] = useState(new URLSearchParams(location.search).get('q') || ''), [path, setPath] = useState(location.pathname), [brandFilter, setBrandFilter] = useState(''), [sizeFilter, setSizeFilter] = useState(''), [maxPrice, setMaxPrice] = useState(''), [sort, setSort] = useState('featured'), [filtersOpen, setFiltersOpen] = useState(false);
  const [receiving, setReceiving] = useState<Receiving>('pickup'), [quote, setQuote] = useState<Quote | null>(null), [pendingQuote, setPendingQuote] = useState<Quote | null>(null), [orderError, setOrderError] = useState(''), [busy, setBusy] = useState(false), [helpMessage, setHelpMessage] = useState(''), [toast, setToast] = useState('');
  async function refresh() {
    setRefreshing(true);
    try { const response = await fetch('/api/catalog', { cache: 'no-store' }); if (!response.ok) throw new Error(); setCatalog(await response.json()); setCatalogError(''); }
    catch { setCatalogError('Não foi possível atualizar o catálogo. Tente novamente.'); }
    finally { setRefreshing(false); }
  }
  useEffect(() => { void refresh(); const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void refresh(); }, 60000); const onFocus = () => void refresh(); window.addEventListener('focus', onFocus); return () => { clearInterval(timer); window.removeEventListener('focus', onFocus); }; }, []);
  useEffect(() => { function changed() { setHash(location.hash); } window.addEventListener('hashchange', changed); return () => window.removeEventListener('hashchange', changed); }, []);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { setToast('Não foi possível salvar o carrinho neste navegador.'); } setQuote(null); setPendingQuote(null); setOrderError(''); }, [cart, receiving]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); }, [toast]);
  const products = catalog?.products || [];
  const category = resolvePage(path, [...new Set(products.map(p=>p.category))]);
  const isHome = path === '/';
  useLayoutEffect(() => { window.scrollTo({top:0,behavior:'instant'}); }, [path]);
  useEffect(() => {
    function routeChanged() { setPath(location.pathname); setHash(location.hash); setSearch(new URLSearchParams(location.search).get('q') || ''); setSizeFilter(''); setMaxPrice(''); setBrandFilter(''); setFiltersOpen(false); setSort('featured'); }
    window.addEventListener('popstate', routeChanged);
    return () => window.removeEventListener('popstate', routeChanged);
  }, []);
  useEffect(() => { document.title = isHome ? 'SKA Calçados | Seu novo favorito' : (path === '/busca' ? 'Busca' : category || 'Página não encontrada') + ' | SKA Calçados'; }, [category, isHome, path]);
  let selectedId = '';
  try { selectedId = hash.startsWith('#produto/') ? decodeURIComponent(hash.slice(9)) : ''; } catch { selectedId = 'invalid'; }
  const selectedProduct = products.find(p => p.id === selectedId);
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  const subtotal = cart.reduce((n, i) => n + Math.round(i.unitPrice * 100) * i.quantity, 0) / 100;
  const shownProducts = useMemo(() => {
    const normalized = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const filtered = products.filter(p => {
      const match = category === 'Todos' || category === p.category || category === p.audience || category === p.line || category === p.brand || (category === 'Ofertas' && priceOf(p) < p.price) || (category === 'Destaques' && p.featured);
      const text = `${p.name} ${p.reference} ${p.category} ${p.line} ${p.brand || ''} ${p.audience}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return match && (!brandFilter || p.brand === brandFilter || p.line === brandFilter) && text.includes(normalized) && (!sizeFilter || p.variants.some(v => v.available && v.sizes.some(s => s.size === sizeFilter && s.available))) && (!maxPrice || priceOf(p) <= Number(maxPrice));
    });
    return filtered.sort((a, b) => sort === 'price-asc' ? priceOf(a) - priceOf(b) : sort === 'price-desc' ? priceOf(b) - priceOf(a) : sort === 'name' ? a.name.localeCompare(b.name) : Number(b.featured) - Number(a.featured));
  }, [products, category, search, sizeFilter, maxPrice, sort, brandFilter]);
  function closeProduct() { history.replaceState(null, '', `${location.pathname}${location.search}#catalogo`); setHash('#catalogo'); }
  function goCategory(next: string) { navigate(categoryPath(next)); }
  function addItem(item: CartItem) {
    setCart(current => {
      const found = current.find(i => itemKey(i) === itemKey(item));
      if (found) return current.map(i => itemKey(i) === itemKey(item) ? { ...i, quantity: Math.min(99, i.quantity + 1) } : i);
      return [...current, item];
    });
    closeProduct(); setCartOpen(true); setToast('Produto adicionado ao carrinho.');
  }
  function changeQuantity(item: CartItem, quantity: number) { setCart(current => current.map(i => itemKey(i) === itemKey(item) ? { ...i, quantity: Math.max(1, Math.min(99, quantity)) } : i)); }
  async function prepare() {
    setBusy(true); setOrderError(''); setPendingQuote(null); setQuote(null);
    try {
      const response = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receiving, items: cart.map(({ productId, variantId, size, quantity }) => ({ productId, variantId, size, quantity })) }) });
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      if (result.issues?.length) { setOrderError(result.issues.join('\n')); return; }
      if (!response.ok) throw new Error('Não foi possível preparar o pedido. Tente novamente.');
      const changed = result.items.some((i: CartItem) => cart.find(old => itemKey(old) === itemKey(i))?.unitPrice !== i.unitPrice);
      if (changed) setPendingQuote(result); else setQuote(result);
    } catch (error) { setOrderError(error instanceof Error ? error.message : 'Não foi possível preparar o pedido.'); }
    finally { setBusy(false); }
  }
  const phone = (quote?.whatsapp || catalog?.settings.whatsapp || storeWhatsapp).replace(/\D/g, '');
  const canWhatsapp = /^\d{10,15}$/.test(phone);
  const contactUrl = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Olá, SKA Calçados! Gostaria de ajuda com o catálogo.');
  function openHelp(text: string) {
    if (canWhatsapp) window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
    else { setHelpMessage(text); }
  }
  const categories = ['Todos', ...new Set(['Sapatilhas', 'Rasteiras', 'Tamancos', 'Anabelas', 'Scarpins', 'Mocassins', 'Botas', 'Tênis casuais', 'Slip-on', 'Sociais', 'Sapatênis', 'Sandálias', 'Bolsas e acessórios', ...products.map(p => p.category).filter(Boolean)])];
  const filterCount = Number(!!sizeFilter) + Number(!!maxPrice) + Number(!!brandFilter);

  return <>
    <a className="skip-link" href="#catalogo">Pular para os produtos</a>
    <div className="topbar"><span>Seu estilo, seu jeito. Encontre na SKA.</span><a className="topbar-contact" href={contactUrl} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={15} /> WhatsApp (11) 94180-7394</a></div>
    <header><div className="header-main container"><PageLink to="/" className="brand"><img src="/assets/ska-logo.png" alt="SKA Calçados" /><span>CALÇADOS</span></PageLink><form className="search" role="search" onSubmit={e=>{e.preventDefault(); navigate(`/busca?q=${encodeURIComponent(search)}`);}}><MagnifyingGlass size={21} /><input aria-label="Buscar produtos" value={search} onChange={e => { setSearch(e.target.value); }} placeholder="O que você está procurando?" />{search && <button type="button" aria-label="Limpar busca" onClick={() => setSearch('')}><X size={17}/></button>}<button type="submit" className="search-submit" aria-label="Buscar"><ArrowRight size={18}/></button></form><a className="header-help text-button" href={contactUrl} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={25} /><span>Precisa de ajuda?<strong>Fale com a SKA</strong></span></a><button className="cart-button" aria-label={`Abrir carrinho, ${count} itens`} onClick={() => setCartOpen(true)}><Bag size={26} /><span className="cart-label">Meu carrinho</span><span className="cart-count">{count}</span></button></div><nav className="nav container" aria-label="Categorias principais">{['Todos', 'Feminino', 'Masculino', 'Tênis casuais', 'Bolsas e acessórios', 'Ska Confort', 'Ofertas'].map(c => <PageLink key={c} to={categoryPath(c)} className={`${!isHome && category === c ? 'active' : ''} ${c === 'Ofertas' ? 'gold' : ''}`} >{c === 'Todos' ? 'Todo o catálogo' : c}{c === 'Ska Confort' && <Star size={14} weight="fill" />}</PageLink>)}</nav></header>
    <main className={isHome ? 'home-page' : 'listing-page'}>
      {isHome && <><section className="hero container" aria-label="Destaque SKA"><div className="hero-content"><span className="eyebrow">ESCOLHAS QUE COMBINAM COM VOCÊ</span><h1>{catalog?.settings.bannerTitle || 'Seu novo favorito.'}</h1><p>{catalog?.settings.bannerText || 'Escolhas para todos os seus momentos. Encontre o par que combina com você.'}</p><button className="primary" onClick={() => goCategory(catalog?.settings.bannerCategory || 'Ofertas')}>Explorar a seleção <ArrowRight size={19}/></button></div><div className="hero-image">{catalog?.mode === 'live' && !catalog.settings.bannerImage ? <img className="banner-logo" src="/assets/ska-logo.png" alt="SKA Calçados"/> : <ProductImage src={catalog?.settings.bannerImage || '/assets/p187-2.webp'} alt="Seleção do catálogo SKA" />}{catalog?.mode !== 'live' && <span className="hero-caption">Um toque de brilho.<br/>Muitas possibilidades.</span>}</div></section>
      <BrandStrip/><CategoryTiles products={products}/><div className="benefits container"><div><Bag size={23}/><span>Escolha seus favoritos<strong>Monte seu pedido no catálogo</strong></span></div><div><WhatsappLogo size={24}/><span>Atendimento de perto<strong>Finalize com a equipe da loja</strong></span></div><div><Storefront size={24}/><span>Receba do seu jeito<strong>Retirada ou entrega a combinar</strong></span></div></div></>}
      {!isHome && <CategoryIntro category={category} products={products} query={path === '/busca' ? search : undefined}/>}
      <section className="catalog container" id="catalogo" aria-labelledby="catalog-title"><div className="section-heading"><div><span className="eyebrow">CATÁLOGO SKA</span><h2 id="catalog-title">{search ? 'Resultados da sua busca' : isHome ? 'Favoritos da seleção' : category === 'Todos' ? 'Todos os produtos' : category || 'Explore outras categorias'}</h2></div><span className="product-count" aria-live="polite">{isHome && <PageLink to="/catalogo" className="text-button">Ver todo o catálogo <ArrowRight size={16}/></PageLink>}<span className={isHome ? 'sr-only' : ''}>{catalog ? `${shownProducts.length} ${shownProducts.length === 1 ? 'produto' : 'produtos'}` : 'Carregando catálogo…'}</span></span></div>
        <div className="listing-layout"><aside className="listing-sidebar"><h3>Categorias</h3><div className="category-tabs" aria-label="Tipos de produto">{categories.map(c => <PageLink key={c} to={categoryPath(c)} className={category === c ? 'selected' : ''} aria-current={category===c ? 'page' : undefined}>{c}</PageLink>)}</div><h3>Marcas</h3><div className="sidebar-brands">{brands.map(b=><PageLink key={b.name} to={categoryPath(b.name)}>{b.name}<ArrowRight size={13}/></PageLink>)}</div></aside><div className="listing-results">
        <div className="toolbar"><button className="filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={19}/>Filtros{filterCount > 0 && ` (${filterCount})`}</button><div className={`filter-fields ${filtersOpen ? 'expanded' : ''}`}><label>Marca<select aria-label="Filtrar por marca" value={brandFilter} onChange={e=>setBrandFilter(e.target.value)}><option value="">Todas as marcas</option>{brands.map(b=><option key={b.name}>{b.name}</option>)}</select></label><label>Numeração<select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)}><option value="">Todas</option>{Array.from({length: 10}, (_,i) => String(i+34)).map(n => <option key={n}>{n}</option>)}</select></label><label>Preço<select value={maxPrice} onChange={e => setMaxPrice(e.target.value)}><option value="">Todos os preços</option><option value="100">Até R$ 100</option><option value="150">Até R$ 150</option><option value="200">Até R$ 200</option><option value="300">Até R$ 300</option><option value="400">Até R$ 400</option></select></label>{filterCount > 0 && <button className="text-button" onClick={() => { setSizeFilter(''); setMaxPrice(''); setBrandFilter(''); }}>Limpar filtros<X size={15}/></button>}</div><label className="sort"><span>Ordenar por</span><select aria-label="Ordenar produtos" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Destaques</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome</option></select></label></div>
        {catalog?.mode === 'demo' && <p className="demo-notice"><WarningCircle size={17}/><span>Demonstração: produtos, fotos, preços e disponibilidade ilustrativos.</span></p>}
        {catalogError && <div className="error-state" role="alert">{catalogError}<button className="text-button" onClick={() => void refresh()} disabled={refreshing}>Tentar novamente</button></div>}
        {!catalog && !catalogError && <div className="product-grid skeletons">{[1,2,3,4].map(i => <div key={i} className="skeleton"/>)}</div>}
        <div className="product-grid">{(isHome ? [...shownProducts].sort((a,b) => {
          const picks = ['brand-0','brand-8','brand-22','brand-16','brand-28','brand-26','1001','1003'];
          const rank = (id: string) => picks.includes(id) ? picks.indexOf(id) : 100;
          return rank(a.id)-rank(b.id);
        }).slice(0,8) : shownProducts).map((p, index) => {
          const inStock = p.variants.some(v => v.available && (!p.requiresSize || v.sizes.some(s => s.available)));
          return <article className="product-card" key={p.id}><a className="product-photo" href={`#produto/${encodeURIComponent(p.id)}`} aria-label={`Ver ${p.name}`}><ProductImage src={p.variants[0].images[0]} alt={`${p.name}, ${p.variants[0].color}`} loading={index < 4 ? 'eager' : 'lazy'} /></a><div className="product-meta"><span>{p.brand || (p.line === 'Ska Confort' ? 'SKA CONFORT' : p.category)}</span>{priceOf(p) < p.price ? <span className="sale-label">Oferta</span> : !inStock ? <span>Esgotado</span> : null}</div><a className="product-name" href={`#produto/${encodeURIComponent(p.id)}`}>{p.name}</a><div className="card-colors">{p.variants.map(v => <span key={v.id} className="swatch" style={{background:v.hex}} title={v.color}/>)}<span>{p.variants.length === 1 ? p.variants[0].color : `${p.variants.length} cores`}</span></div><Price product={p}/><a className={`choose-button ${!inStock ? 'sold-out' : ''}`} href={`#produto/${encodeURIComponent(p.id)}`}>{inStock ? 'Escolher opções' : 'Ver produto'}<Plus size={18}/></a></article>;
        })}</div>
        {catalog && !shownProducts.length && <div className="empty-state"><MagnifyingGlass size={38}/><h3>Nenhum produto por aqui</h3><p>Tente outra busca ou ajuste os filtros.</p><button className="primary" onClick={() => { setSearch(''); goCategory('Todos'); setSizeFilter(''); setMaxPrice(''); setBrandFilter(''); }}>Ver todos os produtos<ArrowRight/></button></div>}
      </div></div></section>
      {isHome && <section className="sale-feature container"><div><span className="eyebrow">PEQUENOS PREÇOS. GRANDES ESCOLHAS.</span><h2>Um novo par.<br/>Um novo favorito.</h2><p>Encontre sua próxima combinação na seleção de ofertas.</p><PageLink to="/ofertas" className="primary">Explorar ofertas <ArrowRight size={19}/></PageLink></div><img src="/assets/p187-1.webp" alt="Scarpin dourado da seleção demonstrativa" loading="lazy"/><span className="sale-stamp">SELEÇÃO<span>SKA</span>ESPECIAL</span></section>}
      <section className="confort container"><div><Star size={27}/><span>SKA CONFORT</span></div><h2>Para acompanhar o seu dia.</h2><p>Conheça os modelos da nossa seleção de conforto.</p><button className="text-button" onClick={() => goCategory('Ska Confort')}>Descobrir a linha<ArrowRight size={20}/></button></section>
      <section className="how-to container"><h2>Gostou? É fácil pedir.</h2><ol><li><span>1</span><div><h3>Encontre o seu favorito</h3><p>Escolha o produto, a cor e a numeração.</p></div></li><li><span>2</span><div><h3>Monte seu carrinho</h3><p>Revise os itens e escolha como receber.</p></div></li><li><span>3</span><div><h3>Converse com a SKA</h3><p>A loja confirma a disponibilidade e combina os detalhes.</p></div></li></ol></section>
    </main>
    <footer><div className="container footer-main"><PageLink to="/" className="footer-brand"><img src="/assets/ska-logo.png" alt="SKA Calçados"/></PageLink><p>Seu estilo começa<br/>com uma boa escolha.</p><div><strong>Vamos conversar?</strong><a className="text-button" href={contactUrl} target="_blank" rel="noopener noreferrer">WhatsApp (11) 94180-7394<ArrowRight size={17}/></a></div><div><strong>Sobre os pedidos</strong><span>Retirada e entrega a combinar.</span><span>Disponibilidade confirmada pela loja.</span></div></div><div className="container footer-bottom"><span>SKA Calçados</span><span>{catalog?.mode === 'live' ? 'Catálogo sujeito à confirmação de disponibilidade.' : 'Prévia demonstrativa. Nenhum pedido real é enviado.'}</span></div></footer>

    {selectedProduct && !cartOpen && !helpMessage && <Modal title={selectedProduct.name} close={closeProduct}><ProductDetail key={selectedProduct.id} product={selectedProduct} demo={catalog?.mode === 'demo'} add={addItem} help={openHelp}/></Modal>}
    {selectedId && catalog && !selectedProduct && <Modal title="Produto não encontrado" close={closeProduct}><div className="message-dialog"><h2>Produto não encontrado</h2><p>Este produto não faz parte do catálogo atual.</p><button className="primary" onClick={closeProduct}>Voltar ao catálogo</button></div></Modal>}
    {cartOpen && <Modal title="Meu carrinho" close={() => setCartOpen(false)} drawer><div className="cart-header"><Bag size={25}/><h2>Meu carrinho <span>({count})</span></h2></div>{cart.length ? <>
      <p className="muted cart-intro">Suas escolhas estão aqui. Revise antes de continuar.</p><div className="cart-items">{cart.map(item => <article className="cart-item" key={itemKey(item)}><div className="cart-photo"><ProductImage src={item.image} alt={item.name}/></div><div className="cart-item-info"><h3>{item.name}</h3><span>{item.color} / {item.size ? `Nº ${item.size}` : 'Sem numeração'}</span><span className="small">Ref. {item.reference}</span><strong>{money(item.unitPrice)}</strong><div className="quantity"><button aria-label={`Diminuir quantidade de ${item.name}`} disabled={item.quantity <= 1} onClick={() => changeQuantity(item, item.quantity - 1)}><Minus size={14}/></button><span aria-label={`Quantidade de ${item.name}`}>{item.quantity}</span><button aria-label={`Aumentar quantidade de ${item.name}`} disabled={item.quantity >= 99} onClick={() => changeQuantity(item, item.quantity + 1)}><Plus size={14}/></button></div></div><button className="remove icon-button" aria-label={`Remover ${item.name}`} onClick={() => setCart(current => current.filter(i => itemKey(i) !== itemKey(item)))}><Trash size={19}/></button></article>)}</div>
      <fieldset className="receiving"><legend>Como deseja receber?</legend><label className={receiving === 'pickup' ? 'selected' : ''}><input type="radio" name="receiving" value="pickup" checked={receiving === 'pickup'} onChange={() => setReceiving('pickup')}/><Storefront size={22}/><span><strong>Retirada na loja</strong><small>Combine o melhor momento com a equipe</small></span></label><label className={receiving === 'delivery' ? 'selected' : ''}><input type="radio" name="receiving" value="delivery" checked={receiving === 'delivery'} onChange={() => setReceiving('delivery')}/><Truck size={23}/><span><strong>Entrega a combinar</strong><small>Endereço e frete definidos no WhatsApp</small></span></label></fieldset>
      <div className="subtotal"><span>Subtotal dos produtos</span><strong>{money(subtotal)}</strong></div><p className="small muted">{receiving === 'delivery' ? 'Frete não incluído. O valor será combinado no atendimento.' : 'A retirada será combinada no atendimento.'}</p>
      <div className="order-notice"><WarningCircle size={19}/><p>{catalog?.mode === 'demo' ? 'Fluxo demonstrativo. Os valores não foram validados para uma compra real. ' : ''}Pedido sujeito à confirmação de disponibilidade pela loja. Não reserva produtos.</p></div>
      {orderError && <div className="error-state" role="alert">{orderError}</div>}
      {pendingQuote && <div className="price-change" role="alert"><h3>Os preços foram atualizados</h3>{pendingQuote.items.filter(i => i.unitPrice !== cart.find(c => itemKey(c) === itemKey(i))?.unitPrice).map(i => <p key={itemKey(i)}>{i.name}: {money(cart.find(c => itemKey(c) === itemKey(i))!.unitPrice)} → <strong>{money(i.unitPrice)}</strong></p>)}<p>Novo subtotal: {money(pendingQuote.subtotal)}</p><button className="primary full" onClick={() => { setCart(pendingQuote.items); setPendingQuote(null); setToast('Preços atualizados. Confira e prepare seu pedido novamente.'); }}>Aceitar preços atualizados</button></div>}
      {!quote && !pendingQuote && <button className="primary full" disabled={busy} onClick={() => void prepare()}><WhatsappLogo size={21}/>{busy ? 'Conferindo o catálogo…' : 'Preparar pedido'}<ArrowRight size={19}/></button>}
      {quote && <div className="prepared"><h3><Check size={19}/>Pedido pronto</h3>{canWhatsapp ? <a className="primary full" href={`https://wa.me/${phone}?text=${encodeURIComponent(quote.message)}`} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={20}/>Abrir WhatsApp<ArrowRight/></a> : <p className="small">O atendimento está temporariamente indisponível. Tente novamente em instantes.</p>}</div>}
      <button className="text-button continue" onClick={() => setCartOpen(false)}><ArrowLeft size={17}/>Continuar escolhendo</button>
    </> : <div className="empty-state"><Bag size={48}/><h3>Seu carrinho está esperando</h3><p>Encontre um favorito para chamar de seu.</p><button className="primary" onClick={() => { setCartOpen(false); goCategory('Todos'); }}>Explorar o catálogo<ArrowRight size={19}/></button></div>}</Modal>}
    {helpMessage && <Modal title="Fale com a SKA" close={() => setHelpMessage('')}><div className="message-dialog"><WhatsappLogo size={35} className="gold"/><h2>Fale com a SKA</h2>{canWhatsapp ? <a className="primary full" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${phone}?text=${encodeURIComponent(helpMessage)}`}>Abrir WhatsApp<ArrowRight/></a> : <p>O atendimento está temporariamente indisponível. Tente novamente em instantes.</p>}</div></Modal>}
    {toast && <div className="toast" role="status"><Check size={18}/>{toast}</div>}
  </>;
}




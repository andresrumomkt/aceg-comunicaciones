import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowLeft, ChevronDown, ChevronRight, Check, Search, X, Menu, Radio, Network, Smartphone, Wrench, ShieldCheck, HardHat, Factory, Truck, Zap, HeartPulse, Users, MapPin, Phone, Mail, Clock3, MessageCircle, Plus, Minus, Signal, Globe2, Headphones, BatteryCharging, SlidersHorizontal, ExternalLink } from 'lucide-react';
import { articles, categories, contact, industries, portfolio, products } from './data/content';
import dealers from './data/dealers.json';
import { HeroVideo } from './components/HeroVideo';
import { heroVideo } from './data/media';
import { asset, siteUrl } from './site';
import './styles.css';
import './hero-video.css';

const iconSet = [ShieldCheck, HardHat, Factory, Zap, Factory, Truck, HeartPulse, Users];
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const provinces = [...new Set(dealers.map(d => d.province))].sort((a, b) => a.localeCompare(b, 'es'));
const productUrl = (p: typeof products[number]) => `/productos/${p.category}/${p.slug}`;

function Action({ children, to, variant = '', className = '' }: { children: React.ReactNode; to: string; variant?: string; className?: string }) {
  return <Link className={`button ${variant} ${className}`} to={to}>{children}<ArrowUpRight size={18} aria-hidden="true" /></Link>;
}
function TextLink({ children, to }: { children: React.ReactNode; to: string }) {
  return <Link className="text-link" to={to}>{children}<ArrowRight size={18} aria-hidden="true" /></Link>;
}
function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? 'light' : ''}`}><span />{children}</p>;
}
function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <section className="page-intro"><div className="container"><Breadcrumb current={eyebrow} /><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{children && <p className="intro-copy">{children}</p>}</div></section>;
}
function Breadcrumb({ current }: { current: string }) {
  return <nav className="breadcrumb" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><ChevronRight size={12} /><span>{current}</span></nav>;
}

function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const header = useRef<HTMLElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(null); setMobile(false); setSearch(false); setQuery(''); }, [location.pathname]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false); if (search) searchButton.current?.focus(); setSearch(false); } };
    const outside = (e: MouseEvent) => { if (!header.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('keydown', handler); document.addEventListener('mousedown', outside);
    return () => { document.removeEventListener('keydown', handler); document.removeEventListener('mousedown', outside); };
  }, [search]);
  useEffect(() => { document.body.classList.toggle('menu-open', mobile || search); return () => document.body.classList.remove('menu-open'); }, [mobile, search]);
  const results = [
    ...products.map(p => ({ title: p.name, type: p.label, url: productUrl(p) })),
    ...industries.map(p => ({ title: p.name, type: 'Industria', url: `/industrias/${p.slug}` })),
    ...articles.map(p => ({ title: p.title, type: 'Perspectivas', url: `/novedades/${p.slug}` })),
    { title: 'WAVE PTX', type: 'Banda ancha', url: '/productos/wave-ptx' },
    { title: 'Red de distribuidores', type: 'Argentina', url: '/dealers' },
  ].filter(r => normalize(r.title).includes(normalize(query)));
  return <>
    <a className="skip-link" href="#contenido">Ir al contenido</a>
    <header ref={header} className="site-header">
      <div className="utility"><div className="container"><span>Conectamos personas. Potenciamos operaciones.</span><Link to="/dealers">Red de distribuidores <ArrowUpRight size={12} /></Link><span className="country"><Globe2 size={12} /> Argentina</span></div></div>
      <div className="brand-row container">
        <Link to="/" className="brand" aria-label="ACEG Comunicaciones, inicio"><img src={asset('aceg.webp')} alt="ACEG" /><span>COMUNICACIONES<span>Desde 1980</span></span></Link>
        <div className="brand-right"><span className="partner-label">Distribuidor oficial</span><img className="motorola-logo" src={asset('motorola.webp')} alt="Motorola Solutions" /><span className="brand-divider" /><button ref={searchButton} className="icon-button search-trigger" aria-label="Buscar en ACEG" title="Buscar" onClick={() => setSearch(true)}><Search size={21} /></button><button className="icon-button mobile-toggle" aria-label={mobile ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobile} onClick={() => setMobile(!mobile)}>{mobile ? <X /> : <Menu />}</button></div>
      </div>
      <div className="nav-bar"><div className="container nav-inner"><nav className={mobile ? 'main-nav mobile-visible' : 'main-nav'} aria-label="Navegación principal">
        {['Productos', 'Soluciones', 'Industrias'].map(label => <div className="nav-item" key={label}><button aria-expanded={open === label} aria-controls={`menu-${label}`} className={open === label ? 'nav-trigger active' : 'nav-trigger'} onClick={() => setOpen(open === label ? null : label)}>{label}<ChevronDown size={13} /></button></div>)}
        <NavLink to="/nosotros">Somos ACEG</NavLink><NavLink to="/novedades">Perspectivas</NavLink><NavLink className="mobile-dealers" to="/dealers">Distribuidores</NavLink>
      </nav><Link className="nav-contact" to="/contacto">Hablemos de tu proyecto <ArrowUpRight size={17} /></Link></div></div>
      {open && <div className="mega-menu" id={`menu-${open}`}><div className="container mega-inner"><div className="mega-heading"><Eyebrow>{open === 'Productos' ? 'Tecnología que conecta' : open === 'Industrias' ? 'Cada operación es única' : 'El ecosistema ACEG'}</Eyebrow><h2>{open === 'Productos' ? 'Un equipo para cada desafío.' : open === 'Industrias' ? 'Hablamos el idioma de tu industria.' : 'Todo funciona mejor cuando se conecta.'}</h2><TextLink to={open === 'Industrias' ? '/industrias' : open === 'Productos' ? '/productos' : '/soluciones'}>Explorar {open.toLowerCase()}</TextLink></div><div className="mega-links">
        {open === 'Productos' ? categories.map((c, i) => <Link key={c.slug} to={`/productos/${c.slug}`}><span className="menu-number">0{i + 1}</span><div><strong>{c.name}</strong><p>{c.description}</p></div><ArrowUpRight size={18} /></Link>) : open === 'Industrias' ? industries.map((item, i) => { const Icon = iconSet[i]; return <Link key={item.slug} to={`/industrias/${item.slug}`}><Icon size={22} /><strong>{item.name}</strong><ArrowUpRight size={17} /></Link>; }) : portfolio.map((p, i) => { const Icon = [Radio, Network, Smartphone, Wrench][i]; return <Link key={p.title} to={p.route}><Icon size={23} /><div><strong>{p.title}</strong><p>{p.subtitle}</p></div><ArrowUpRight size={18} /></Link>; })}
      </div><button className="icon-button mega-close" aria-label="Cerrar menú desplegable" onClick={() => setOpen(null)}><X size={20} /></button></div></div>}
    </header>
    {open && <div className="menu-scrim" onClick={() => setOpen(null)} />}
    {search && <div className="search-backdrop" onClick={() => { setSearch(false); searchButton.current?.focus(); }}><section className="search-dialog" role="dialog" aria-modal="true" aria-label="Buscar en ACEG" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Tab') { const focusables = e.currentTarget.querySelectorAll<HTMLElement>('input, button, a'); const first = focusables[0]; const last = focusables[focusables.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } }}><div className="search-field"><Search size={23} /><input autoFocus aria-label="Buscar productos, industrias o contenidos" placeholder="¿Qué estás buscando?" value={query} onChange={e => setQuery(e.target.value)} /><button className="icon-button" aria-label="Cerrar búsqueda" onClick={() => { setSearch(false); searchButton.current?.focus(); }}><X /></button></div><div className="search-results"><p className="small-label">{query ? `${results.length} resultados` : 'Explorá ACEG'}</p>{results.length ? results.slice(0, 8).map(r => <Link key={r.url} to={r.url}><span><small>{r.type}</small>{r.title}</span><ArrowUpRight size={20} /></Link>) : <div className="empty"><h3>No encontramos coincidencias.</h3><p>Probá con otro producto, industria o tecnología.</p><button className="button" onClick={() => setQuery('')}>Limpiar búsqueda <X size={17} /></button></div>}</div></section></div>}
  </>;
}

const slides = [
  { eyebrow: 'Comunicaciones críticas. Operaciones conectadas.', title: <>Comunicaciones<br />que mueven<br /><em>operaciones.</em></>, text: 'De comunicar mejor a operar mejor. Integramos tecnología, ingeniería y respaldo para conectar a tu equipo.', image: 'operacion.webp', cta: 'Explorá nuestras soluciones', url: '/soluciones', label: 'Sistemas que se conectan' },
  { eyebrow: 'WAVE PTX · Push-to-talk de banda ancha', title: <>Una conversación.<br />Distintas redes.<br /><em>El mismo equipo.</em></>, text: 'Conectá personas entre distintos sitios, con radios y dispositivos sobre redes celulares y Wi-Fi.', image: 'logistica.jpg', cta: 'Conocé WAVE PTX', url: '/productos/wave-ptx', label: 'Más allá de la radio' },
  { eyebrow: 'Una red que te acompaña en Argentina', title: <>La tecnología<br />adecuada.<br /><em>El aliado cercano.</em></>, text: 'Más de 100 distribuidores en 20 provincias. Experiencia local, con el respaldo de ACEG.', image: 'industria.jpg', cta: 'Encontrá tu distribuidor', url: '/dealers', label: 'Cerca de tu operación' },
];
function Hero() {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  return <section className="hero-section" aria-label="Destacados de ACEG">
    <div className={`hero ${active === 0 ? 'hero-with-video' : ''}`}>
      <img className={`hero-image hero-image-${active}`} src={active === 0 ? heroVideo.poster : asset(slide.image)} alt={active === 0 ? 'Personal operativo utilizando radios Motorola Solutions' : active === 1 ? 'Centro de distribución y logística' : 'Personal trabajando en un entorno industrial'} fetchPriority="high" />
      {active === 0 && <HeroVideo />}
      <div className="hero-blue" />
      <div className="container hero-content" key={active}>
        <Eyebrow light>{slide.eyebrow}</Eyebrow>
        <h1>{slide.title}</h1>
        <p>{slide.text}</p>
        <Action to={slide.url} variant="white">{slide.cta}</Action>
        <div className="hero-note"><span className="signal-dot" /> Personas + tecnología + respaldo</div>
      </div>
      <span className="hero-side-label">ACEG / CONECTADOS DESDE 1980</span>
      <div className="hero-controls">
        <button className="icon-button" aria-label="Destacado anterior" onClick={() => setActive((active + 2) % 3)}><ArrowLeft size={18} /></button>
        <span>0{active + 1}<i>/ 03</i></span>
        <button className="icon-button" aria-label="Siguiente destacado" onClick={() => setActive((active + 1) % 3)}><ArrowRight size={18} /></button>
      </div>
    </div>
    <div className="hero-tabs container" role="tablist" aria-label="Destacados">{slides.map((s, i) => <button key={s.label} role="tab" aria-selected={active === i} onClick={() => setActive(i)}><span>0{i + 1}</span>{s.label}<ArrowUpRight size={17} /></button>)}</div>
  </section>;
}
function Stats() {
  return <div className="stats-band"><div className="container stats"><div><strong>+40<span>años</span></strong><p>de experiencia en Argentina</p></div><div><strong>+100</strong><p>distribuidores en nuestra red</p></div><div><strong>20<span>provincias</span></strong><p>con presencia de dealers</p></div><div className="stat-support"><Network size={29} /><span>Ingeniería y respaldo<strong>En cada etapa del proyecto.</strong></span></div></div></div>;
}
function Ecosystem() {
  const [active, setActive] = useState(0);
  const p = portfolio[active];
  return <section className="section ecosystem" id="ecosistema"><div className="container"><div className="section-heading ecosystem-heading"><div><Eyebrow>El ecosistema ACEG</Eyebrow><h2>La diferencia está<br />en cómo se conecta.</h2></div><p>Un radio es el comienzo. Una operación conectada es el resultado. Diseñamos la conexión entre las personas, la tecnología y tu forma de trabajar.</p></div><div className="ecosystem-grid"><div className="portfolio-accordion">{portfolio.map((item, i) => { const Icon = [Radio, Network, Smartphone, Wrench][i]; return <div className={`portfolio-item ${active === i ? 'selected' : ''}`} key={item.title}><h3><button aria-expanded={active === i} aria-controls={`portfolio-${i}`} onClick={() => setActive(i)}><Icon size={23} /><span>{item.title}</span>{active === i ? <Minus size={19} /> : <Plus size={19} />}</button></h3>{active === i && <div id={`portfolio-${i}`} className="portfolio-copy"><p className="portfolio-subtitle">{item.subtitle}</p><p>{item.text}</p><TextLink to={item.route}>Explorar la solución</TextLink></div>}</div>; })}</div><div className={`product-stage ${active > 1 ? 'photo-stage' : ''}`}><div className="stage-top"><span>TECNOLOGÍA QUE CONECTA</span><span>0{active + 1} / 04</span></div><div className="stage-image" key={p.image}><img src={asset(p.image)} alt={p.title} loading="lazy" /></div><div className="stage-bottom"><span><small>{active < 2 ? 'MOTOROLA SOLUTIONS' : 'EL ECOSISTEMA ACEG'}</small><strong>{active === 0 ? 'MOTOTRBO™ R7' : active === 1 ? 'MOTOTRBO™ SLR' : p.title}</strong></span><Link className="circle-link" to={p.route} aria-label={`Explorar ${p.title}`}><ArrowUpRight size={23} /></Link></div><span className="stage-rail" /></div></div></div></section>;
}
function ProductCard({ product }: { product: typeof products[number] }) {
  return <Link className="product-card" to={productUrl(product)}><div className="product-image"><img src={asset(product.image)} alt={product.name} loading="lazy" /><span className="product-card-arrow"><ArrowUpRight size={21} /></span></div><p className="small-label">{product.label}</p><h3>{product.name}</h3><p className="product-description">{product.description}</p><div className="product-tags">{product.tags.slice(0, 2).map(t => <span key={t}>{t}</span>)}</div></Link>;
}
function Featured({ filter, title = 'Tecnología a la altura de tu equipo.' }: { filter?: string; title?: string }) {
  const list = filter ? products.filter(p => p.industries.includes(filter)) : products;
  return <section className="section featured" id="equipos"><div className="container"><div className="section-heading"><div><Eyebrow>Equipos destacados</Eyebrow><h2>{title}</h2></div><TextLink to="/productos">Todo el portfolio</TextLink></div><div className="product-grid">{list.map(p => <ProductCard product={p} key={p.slug} />)}</div></div></section>;
}
function IndustryCard({ industry }: { industry: typeof industries[number] }) {
  const Icon = iconSet[industries.indexOf(industry)];
  return <Link to={`/industrias/${industry.slug}`} className="industry-card"><img src={asset(industry.image)} alt={industry.name} loading="lazy" /><div className="industry-tint" /><Icon className="industry-icon" size={26} /><div className="industry-card-copy"><h3>{industry.name}</h3><p>{industry.title}</p><span className="circle-link"><ArrowUpRight size={21} /></span></div></Link>;
}
function IndustrySection() {
  const [page, setPage] = useState(0);
  const shown = page === 0 ? [industries[0], industries[4], industries[5]] : page === 1 ? [industries[1], industries[2], industries[3]] : [industries[6], industries[7]];
  return <section className="section industry-section"><div className="container"><div className="section-heading"><div><Eyebrow>Soluciones por industria</Eyebrow><h2>Tu industria.<br />Nuestro punto de partida.</h2></div><div className="industry-heading-right"><p>Cada entorno tiene sus desafíos.<br />La solución empieza por entenderlos.</p><div className="arrow-controls"><button className="icon-button" aria-label="Industrias anteriores" onClick={() => setPage((page + 2) % 3)}><ArrowLeft size={20} /></button><button className="icon-button" aria-label="Más industrias" onClick={() => setPage((page + 1) % 3)}><ArrowRight size={20} /></button></div></div></div><div className="industry-grid">{shown.map(i => <IndustryCard industry={i} key={i.slug} />)}</div><div className="section-bottom"><span className="small-label">Personas conectadas. Operaciones más coordinadas.</span><TextLink to="/industrias">Explorá todas las industrias</TextLink></div></div></section>;
}
function NetworkSection() {
  const [province, setProvince] = useState('');
  return <section className="network-section"><div className="container network-grid"><div className="network-copy"><Eyebrow>Una red. Todo el respaldo.</Eyebrow><h2>Cerca de tu<br /><em>operación.</em></h2><p>La tecnología necesita un buen aliado. Nuestra red de distribuidores combina conocimiento local y el respaldo técnico de ACEG.</p><label className="small-label" htmlFor="home-province">¿Dónde está tu equipo?</label><div className="province-search"><select id="home-province" value={province} onChange={e => setProvince(e.target.value)}><option value="">Seleccioná una provincia</option>{provinces.map(p => <option key={p}>{p}</option>)}</select><Link to={`/dealers${province ? `?provincia=${encodeURIComponent(province)}` : ''}`} aria-label="Buscar distribuidores"><ArrowRight size={22} /></Link></div><TextLink to="/contacto?necesidad=ser-dealer">Quiero ser distribuidor ACEG</TextLink></div><div className="network-map"><img src={asset('argentina.svg')} alt="Mapa de la red de distribuidores de ACEG en Argentina" loading="lazy" /><div className="map-label"><span className="signal-dot" /><strong>Conectados en Argentina</strong><span>+100 dealers · 20 provincias</span></div><span className="map-caption">Presencia local. Una misma red.</span></div></div></section>;
}
function ArticlesSection({ full = false }: { full?: boolean }) {
  return <section className="section articles-section"><div className="container">{!full && <div className="section-heading"><div><Eyebrow>Perspectivas ACEG</Eyebrow><h2>Ideas que conectan.</h2></div><TextLink to="/novedades">Todas las perspectivas</TextLink></div>}<div className="article-grid">{articles.map(a => <Link className="article-card" key={a.slug} to={`/novedades/${a.slug}`}><div className={`article-image ${a.slug.includes('accesorios') ? 'contain' : ''}`}><img src={asset(a.image)} alt="" loading="lazy" /></div><p className="eyebrow">{a.category}</p><h3>{a.title}</h3><p>{a.excerpt}</p><span className="text-link">Leer perspectiva<ArrowUpRight size={17} /></span></Link>)}</div></div></section>;
}
function ClosingCTA() {
  return <section className="closing-cta"><div className="container"><div><Eyebrow light>El próximo paso, juntos.</Eyebrow><h2>Tu operación puede<br />estar mejor conectada.</h2></div><div><p>Contanos el desafío.<br />Diseñemos la solución.</p><Action to="/contacto" variant="white">Hablemos de tu proyecto</Action></div></div><div className="cta-line" /></section>;
}
function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Link to="/" className="brand"><img src={asset('aceg.webp')} alt="ACEG" /><span>COMUNICACIONES</span></Link><p>De comunicar mejor<br />a operar mejor.</p><img className="footer-motorola" src={asset('motorola.webp')} alt="Distribuidor oficial Motorola Solutions" /></div><div><h3>Explorá ACEG</h3><Link to="/soluciones">Soluciones</Link><Link to="/productos">Productos</Link><Link to="/industrias">Industrias</Link><Link to="/dealers">Distribuidores</Link></div><div><h3>Nosotros</h3><Link to="/nosotros">Somos ACEG</Link><Link to="/novedades">Perspectivas</Link><Link to="/contacto?necesidad=ser-dealer">Sumate a nuestra red</Link><a href="https://www.linkedin.com/company/aceg-comunicaciones-sa/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a></div><div className="footer-contact"><h3>Conversemos</h3><a href={contact.phoneHref}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><p>{contact.address}<br />Buenos Aires, Argentina.</p><span>{contact.hours}</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} ACEG Comunicaciones S.A.</span><Link to="/privacidad">Privacidad</Link><span>Personas. Tecnología. Respaldo.</span></div></footer>;
}
function Home() {
  return <><Hero /><Stats /><Ecosystem /><Featured /><IndustrySection /><NetworkSection /><ArticlesSection /><ClosingCTA /></>;
}

function ProductsPage() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const industry = params.get('industria') || '';
  const current = categories.find(c => c.slug === category);
  if (category && !current) return <NotFound />;
  if (category === 'wave-ptx') return <WavePage />;
  if (category === 'accesorios') return <AccessoriesPage />;
  const filtered = products.filter(p => (!category || p.category === category) && (!industry || p.industries.includes(industry)) && normalize(`${p.name} ${p.description} ${p.tags.join(' ')}`).includes(normalize(query)));
  const setFilter = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); };
  return <><PageIntro eyebrow="Productos y tecnología" title={current?.name || 'La tecnología. Tu equipo. Una conexión.'}>{current?.description || 'Equipos y sistemas Motorola Solutions para acompañar cada momento de tu operación.'}</PageIntro><section className="section catalog-section"><div className="container catalog-layout"><aside className="catalog-sidebar"><h2>Portfolio</h2><NavLink to="/productos" end>Todos los equipos<ChevronRight size={15} /></NavLink>{categories.map(c => <NavLink key={c.slug} to={`/productos/${c.slug}`}>{c.name}<ChevronRight size={15} /></NavLink>)}<div className="sidebar-help"><Headphones size={25} /><h3>Encontrá tu solución.</h3><p>Te ayudamos a elegir según tu operación.</p><TextLink to="/contacto">Consultá con ACEG</TextLink></div></aside><div><div className="catalog-toolbar"><div className="input-search"><Search size={18} /><input aria-label="Buscar equipos" placeholder="Buscar un equipo" value={query} onChange={e => setFilter('q', e.target.value)} />{query && <button className="icon-button" aria-label="Limpiar búsqueda de equipos" onClick={() => setFilter('q', '')}><X size={16} /></button>}</div><label className="select-filter"><SlidersHorizontal size={17} /><select aria-label="Filtrar equipos por industria" value={industry} onChange={e => setFilter('industria', e.target.value)}><option value="">Todas las industrias</option>{industries.map(i => <option value={i.slug} key={i.slug}>{i.name}</option>)}</select></label></div><p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'equipo' : 'equipos'}{current ? ` · ${current.name}` : ''}</p>{filtered.length ? <div className="product-grid catalog-grid">{filtered.map(p => <ProductCard key={p.slug} product={p} />)}</div> : <div className="empty"><Search size={30} /><h2>No encontramos equipos con esos filtros.</h2><p>Probá otra búsqueda o consultanos por una necesidad específica.</p><button className="button" onClick={() => setParams({})}>Restablecer filtros <X size={17} /></button></div>}<div className="catalog-note"><Signal size={21} /><p>La solución se define con tu operación. Consultá disponibilidad, configuración y accesorios con un distribuidor.</p></div></div></div></section><ClosingCTA /></>;
}
function ProductDetail() {
  const { slug, category } = useParams();
  const p = products.find(p => p.slug === slug && p.category === category);
  const [tab, setTab] = useState(0);
  useEffect(() => setTab(0), [slug]);
  if (!p) return <NotFound />;
  return <><div className="container"><Breadcrumb current={p.name} /></div><section className="product-detail container"><div className="detail-image"><span className="small-label">MOTOROLA SOLUTIONS</span><img src={asset(p.image)} alt={p.name} /><span className="detail-image-caption">Tecnología para tu operación.</span></div><div className="detail-copy"><Eyebrow>{p.label}</Eyebrow><h1>{p.name}</h1><p className="detail-lead">{p.description}</p><p>{p.detail}</p><ul className="check-list">{p.tags.map(t => <li key={t}><Check size={17} />{t}</li>)}</ul><Action to={`/contacto?equipo=${p.slug}`}>Consultá por este equipo</Action><TextLink to="/dealers">Encontrá un distribuidor</TextLink><div className="detail-support"><ShieldCheck size={21} /><span>Asesoramiento técnico y respaldo ACEG.</span></div></div></section><section className="section detail-tabs-section"><div className="container"><div className="tabs" role="tablist" aria-label="Información del producto">{['Descripción', 'Especificaciones', 'Accesorios', 'Documentación'].map((t, i) => <button role="tab" id={`product-tab-${i}`} aria-controls="product-panel" aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} key={t} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const next = (tab + (e.key === 'ArrowRight' ? 1 : 3)) % 4; setTab(next); document.getElementById(`product-tab-${next}`)?.focus(); } }} onClick={() => setTab(i)}>{t}</button>)}</div><div className="tab-panel" id="product-panel" role="tabpanel" aria-labelledby={`product-tab-${tab}`}>{tab === 0 ? <div className="prose"><h2>Pensado para el trabajo real.</h2><p>{p.detail}</p><p>El equipo adecuado se elige según el entorno, los usuarios y la arquitectura. En ACEG te acompañamos para evaluar qué configuración necesita tu operación.</p></div> : tab === 1 ? <dl className="spec-list">{p.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl> : tab === 2 ? <div className="prose"><h2>Completá tu solución.</h2><p>Consultá por accesorios de audio, energía e instalación compatibles con este modelo. La compatibilidad se valida por referencia y configuración.</p><Action to={`/contacto?equipo=${p.slug}&necesidad=accesorios`}>Consultar accesorios compatibles</Action></div> : <div className="prose"><h2>Información de referencia.</h2><p>Accedé a la información pública del fabricante o de ACEG. Las características y opciones pueden variar según la versión.</p><a className="button" href={p.source} target="_blank" rel="noreferrer">Ver documentación del producto <ExternalLink size={17} /></a></div>}</div></div></section><Featured title="La conexión continúa." /><ClosingCTA /></>;
}
function WavePage() {
  return <><section className="wide-image-hero"><img src={asset('logistica.jpg')} alt="Centro de distribución" /><div className="wide-image-overlay" /><div className="container"><Eyebrow light>Push-to-talk de banda ancha</Eyebrow><h1>WAVE PTX.<br />Una misma conversación.</h1><p>Tu equipo conectado a través de redes celulares y Wi-Fi, en distintos dispositivos y lugares.</p><Action to="/contacto?necesidad=wave-ptx" variant="white">Conversemos sobre WAVE PTX</Action></div></section><section className="section"><div className="container"><div className="section-heading"><div><Eyebrow>Personas conectadas</Eyebrow><h2>La operación va más allá<br />de un solo lugar.</h2></div><p>Definimos con vos los grupos, los dispositivos y las condiciones de red que necesita tu equipo.</p></div><div className="connection-flow">{[{ icon: Radio, title: 'Radios', copy: 'El equipo que trabaja en campo.' }, { icon: Network, title: 'Integración', copy: 'Una arquitectura según tu operación.' }, { icon: Smartphone, title: 'Banda ancha', copy: 'Push-to-talk en redes celulares y Wi-Fi.' }].map(({ icon: Icon, title, copy }, i) => <div key={title}><span className="flow-number">0{i + 1}</span><Icon size={45} /><h3>{title}</h3><p>{copy}</p>{i < 2 && <ArrowRight className="flow-arrow" />}</div>)}</div><p className="source-note">La integración está sujeta a evaluación técnica, redes, dispositivos y licencias. <a href="https://www.motorolasolutions.com/es_xl/products/wave-ptx.html" target="_blank" rel="noreferrer">Referencia: Motorola Solutions <ExternalLink size={12} /></a></p></div></section><ClosingCTA /></>;
}
function AccessoriesPage() {
  return <><PageIntro eyebrow="Accesorios" title="Los detalles también conectan.">Audio, energía y ergonomía: completá el equipo según la tarea y el entorno de trabajo.</PageIntro><section className="section"><div className="container accessory-grid">{[{ icon: Headphones, title: 'Audio', text: 'Micrófonos, auriculares y soluciones para distintos entornos de ruido.' }, { icon: BatteryCharging, title: 'Energía', text: 'Baterías y cargadores compatibles con los equipos de tu flota.' }, { icon: Radio, title: 'Uso e instalación', text: 'Antenas, sistemas de portación y componentes para cada configuración.' }].map(({ icon: Icon, title, text }) => <div className="accessory-item" key={title}><Icon size={38} /><h2>{title}</h2><p>{text}</p><TextLink to={`/contacto?necesidad=accesorios&tipo=${title}`}>Consultar compatibilidad</TextLink></div>)}</div><div className="container accessory-photo"><img src={asset('r7.webp')} alt="Radio Motorola MOTOTRBO R7" /><div><Eyebrow>Elegí con respaldo</Eyebrow><h2>Cada equipo tiene<br />su configuración.</h2><p>Contanos qué modelo usás y qué tarea realiza tu equipo. Te ayudamos a evaluar las referencias compatibles.</p><Action to="/contacto?necesidad=accesorios">Consultá por accesorios</Action></div></div></section><ClosingCTA /></>;
}
function IndustriesPage() {
  return <><PageIntro eyebrow="Industrias" title="Cada operación tiene su forma de conectar.">Partimos de tus desafíos para pensar una solución de comunicaciones con sentido para tu equipo.</PageIntro><section className="section"><div className="container industry-grid all-industries">{industries.map(i => <IndustryCard key={i.slug} industry={i} />)}</div></section><ClosingCTA /></>;
}
function IndustryPage() {
  const { slug } = useParams(); const i = industries.find(i => i.slug === slug);
  if (!i) return <NotFound />;
  return <><section className="wide-image-hero industry-hero"><img src={asset(i.image)} alt={i.name} /><div className="wide-image-overlay" /><div className="container"><Eyebrow light>{i.name}</Eyebrow><h1>{i.title}</h1><p>{i.text}</p><Action to={`/contacto?industria=${i.slug}`} variant="white">Hablemos de tu operación</Action></div></section><nav className="anchor-nav" aria-label="Secciones de industria"><div className="container"><strong>{i.name}</strong><a href="#desafios">El desafío</a><a href="#equipos">Equipos</a><a href="#enfoque">Nuestro enfoque</a><Link to={`/contacto?industria=${i.slug}`}>Conversemos<ArrowUpRight size={15} /></Link></div></nav><section className="section" id="desafios"><div className="container"><div className="section-heading"><div><Eyebrow>Entender para conectar</Eyebrow><h2>La solución empieza<br />en el terreno.</h2></div><p>{i.text}</p></div><div className="benefit-grid">{i.benefits.map((b, n) => <div key={b}><span>0{n + 1}</span><h3>{b}</h3><p>{['Relevamos las condiciones de trabajo y las necesidades de cada usuario.', 'Evaluamos la arquitectura y los recursos que necesita tu operación.', 'Acompañamos la elección de equipos y la planificación del sistema.'][n]}</p></div>)}</div></div></section><Featured filter={slug} title="Tecnología para tu entorno." /><Process /><ClosingCTA /></>;
}
function Process() {
  return <section className="section process-section" id="enfoque"><div className="container"><div className="section-heading"><div><Eyebrow>El enfoque ACEG</Eyebrow><h2>Del primer desafío<br />a la próxima conexión.</h2></div><p>Te acompañamos con una mirada de sistema y el conocimiento de quienes trabajan todos los días con esta tecnología.</p></div><div className="process-grid">{[['Escuchamos', 'Entendemos el entorno, los usuarios y los objetivos de la operación.'], ['Diseñamos', 'Definimos una arquitectura y evaluamos la tecnología adecuada.'], ['Conectamos', 'Acompañamos a nuestra red de distribuidores en la implementación.'], ['Acompañamos', 'Damos respaldo técnico y servicio de laboratorio a la solución.']].map(([title, copy], i) => <div key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section>;
}
function SolutionsPage() {
  return <><PageIntro eyebrow="Soluciones integradas" title="Cada parte importa. La conexión hace la diferencia.">Integramos tecnología y conocimiento para que las personas puedan coordinarse mejor en el trabajo.</PageIntro><div className="solutions-photo"><img src={asset('industria.jpg')} alt="Personal operativo en una instalación industrial" /></div><section className="section"><div className="container solutions-list">{portfolio.map((p, i) => { const Icon = [Radio, Network, Smartphone, Wrench][i]; return <article key={p.title}><span className="solution-number">0{i + 1}</span><div><Icon size={30} /><h2>{p.title}</h2><p>{p.text}</p><ul className="check-list">{p.points.map(t => <li key={t}><Check size={16} />{t}</li>)}</ul></div><Action to={i === 3 ? '/contacto?necesidad=proyecto' : p.route}>Conocé más</Action></article>; })}</div></section><Process /><ClosingCTA /></>;
}
function DealersPage() {
  const [params, setParams] = useSearchParams();
  const province = params.get('provincia') || '';
  const query = params.get('q') || '';
  const filtered = dealers.filter(d => (!province || province === d.province) && normalize(`${d.name} ${d.province}`).includes(normalize(query)));
  const setFilter = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); };
  const phoneHref = (d: typeof dealers[number]) => {
    const mobile = d.phone.match(/(?:\+54\s*9|\+549)[\d\s-]+/);
    if (mobile) return `tel:+${mobile[0].replace(/\D/g, '')}`;
    const first = d.phone.split('/')[0].replace(/\D/g, '');
    if (first.startsWith('0')) return `tel:+54${first.slice(1)}`;
    if (d.province === 'CABA' || d.province === 'Buenos Aires') return `tel:+5411${first}`;
    return '';
  };
  return <><PageIntro eyebrow="Red de distribuidores" title="El respaldo de una red. La cercanía de un aliado.">Encontrá a los distribuidores de ACEG en Argentina y conectá tu operación con asesoramiento local.</PageIntro><section className="section dealers-section"><div className="container dealers-layout"><div><div className="dealer-filters"><label>Provincia<select value={province} onChange={e => setFilter('provincia', e.target.value)}><option value="">Todas las provincias</option>{provinces.map(p => <option key={p}>{p}</option>)}</select></label><label>Distribuidor o localidad<div className="input-search"><Search size={17} /><input placeholder="Buscá por nombre o localidad" value={query} onChange={e => setFilter('q', e.target.value)} /></div></label></div><div className="results-heading"><span aria-live="polite">{filtered.length} distribuidores{province ? ` en ${province}` : ' en nuestra red'}</span>{(province || query) && <button className="text-button" onClick={() => setParams({})}>Limpiar filtros <X size={13} /></button>}</div>{filtered.length ? <div className="dealer-results">{filtered.map((d, index) => <article className="dealer-item" key={`${d.name}-${index}`}><div><p className="small-label"><MapPin size={12} />{d.province}</p><h2>{d.name}</h2><p className="dealer-phone">{d.phone}</p></div>{phoneHref(d) && <a className="icon-button" title={`Llamar a ${d.name}`} aria-label={`Llamar a ${d.name}`} href={phoneHref(d)}><Phone size={19} /></a>}</article>)}</div> : <div className="empty"><MapPin size={30} /><h2>No encontramos distribuidores con esos filtros.</h2><p>Probá otra localidad o consultá con nuestro equipo.</p><button className="button" onClick={() => setParams({})}>Limpiar filtros <X size={17} /></button></div>}<p className="source-note">Directorio de la <a href="https://acegcomunicaciones.com.ar/dealers" target="_blank" rel="noreferrer">web pública de ACEG</a>. Consultá por la disponibilidad y el alcance de cada distribuidor.</p></div><aside className="dealer-map"><img src={asset('argentina.svg')} alt="Red de distribuidores en Argentina" /><div><strong>+100</strong><span>conexiones que nos acercan.</span></div></aside></div></section><section className="join-network"><div className="container"><div><Eyebrow>Crezcamos juntos</Eyebrow><h2>Sumá tu experiencia<br />a nuestra red.</h2><p>¿Sos distribuidor o integrador? Conversemos sobre cómo trabajar juntos.</p></div><Action to="/contacto?necesidad=ser-dealer">Quiero ser dealer ACEG</Action></div></section></>;
}
function AboutPage() {
  return <><PageIntro eyebrow="Somos ACEG" title="Conectamos personas desde 1980.">Una trayectoria en radiocomunicaciones y una convicción: la tecnología tiene sentido cuando ayuda a trabajar mejor.</PageIntro><Stats /><section className="section"><div className="container about-grid"><div><Eyebrow>De comunicar mejor a operar mejor</Eyebrow><h2>La experiencia nos conecta.<br />El desafío nos mueve.</h2><p>Somos ACEG Comunicaciones. Trabajamos con tecnología Motorola Solutions y una red de distribuidores en Argentina para acompañar las necesidades de comunicación de empresas y organizaciones.</p><p>Combinamos asesoramiento técnico, conocimiento de productos y laboratorio de reparaciones. Nuestra mirada parte del sistema: las personas, la cobertura, los dispositivos y la continuidad de la operación.</p><Action to="/contacto">Conversemos</Action></div><img src={asset('laboratorio.jpg')} alt="Trabajo técnico de ingeniería y mantenimiento" loading="lazy" /></div></section><Process /><NetworkSection /><ClosingCTA /></>;
}
function ContactPage() {
  const [params] = useSearchParams();
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState('');
  const [data, setData] = useState({ name: '', company: '', email: '', phone: '', province: '', industry: params.get('industria') || '', need: params.get('necesidad') || 'proyecto', message: params.get('equipo') ? `Quisiera consultar por ${products.find(p => p.slug === params.get('equipo'))?.name || params.get('equipo')}.` : '' });
  const update = (key: keyof typeof data, value: string) => { setData(d => ({ ...d, [key]: value })); setReady(false); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); const text = `Nombre: ${data.name}\nEmpresa: ${data.company}\nEmail: ${data.email}\nTeléfono: ${data.phone}\nProvincia: ${data.province}\nIndustria: ${data.industry}\nNecesidad: ${data.need}\n\n${data.message}`; setDraft(`mailto:${contact.email}?subject=${encodeURIComponent(`Consulta web ACEG · ${data.company}`)}&body=${encodeURIComponent(text)}`); setReady(true); };
  return <><PageIntro eyebrow="Conversemos" title="Contanos tu desafío.">Un equipo, una expansión o un sistema completo. La próxima conexión empieza con una conversación.</PageIntro><section className="section contact-section"><div className="container contact-layout"><form className="contact-form" onSubmit={submit}><Eyebrow>Hablemos de tu operación</Eyebrow><div className="form-grid"><label>Nombre y apellido *<input required name="name" autoComplete="name" maxLength={150} value={data.name} onChange={e => update('name', e.target.value)} /></label><label>Empresa *<input required name="organization" autoComplete="organization" maxLength={150} value={data.company} onChange={e => update('company', e.target.value)} /></label><label>Email de trabajo *<input required type="email" name="email" autoComplete="email" maxLength={254} value={data.email} onChange={e => update('email', e.target.value)} /></label><label>Teléfono<input type="tel" name="tel" autoComplete="tel" value={data.phone} onChange={e => update('phone', e.target.value)} /></label><label>Provincia<select value={data.province} onChange={e => update('province', e.target.value)}><option value="">Seleccioná una provincia</option>{['CABA', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'].map(p => <option key={p}>{p}</option>)}</select></label><label>Industria<select value={data.industry} onChange={e => update('industry', e.target.value)}><option value="">Seleccioná tu industria</option>{industries.map(i => <option key={i.slug} value={i.slug}>{i.name}</option>)}<option value="otra">Otra</option></select></label><label className="full-field">¿Qué necesitás?<select value={data.need} onChange={e => update('need', e.target.value)}><option value="proyecto">Diseñar un proyecto o sistema</option><option value="equipos">Consultar por equipos</option><option value="accesorios">Accesorios y repuestos</option><option value="wave-ptx">Conocer WAVE PTX</option><option value="ser-dealer">Ser distribuidor ACEG</option><option value="otra">Otra consulta</option></select></label><label className="full-field">Tu consulta *<textarea required rows={5} maxLength={3000} value={data.message} onChange={e => update('message', e.target.value)} placeholder="¿Cómo trabaja tu equipo? ¿Qué necesitan resolver?" /></label></div><p className="form-note">Prepararemos tu consulta para enviarla desde tu correo a {contact.email}. <Link to="/privacidad">Privacidad</Link>.</p><button className="button" type="submit">Preparar consulta <ArrowUpRight size={18} /></button>{ready && <div className="form-success" role="status"><Check size={23} /><div><h3>Tu consulta está lista.</h3><p>Revisá los datos y abrí tu correo para enviarla al equipo de ACEG.</p><a className="text-link" href={draft}>Abrir correo con mi consulta <ArrowUpRight size={17} /></a><p className="small-note">Todavía no se envió ningún mensaje.</p></div></div>}</form><aside className="contact-info"><h2>Del otro lado,<br />un equipo.</h2><p>Asesoramiento para elegir tecnología y acompañar tu operación.</p><a href={contact.phoneHref}><Phone size={20} /><span><small>Llamanos</small>{contact.phone}</span><ArrowUpRight size={17} /></a><a href={`mailto:${contact.email}`}><Mail size={20} /><span><small>Escribinos</small>{contact.email}</span><ArrowUpRight size={17} /></a><div><MapPin size={20} /><span><small>Encontranos</small>{contact.address}<br />Buenos Aires, Argentina.</span></div><div><Clock3 size={20} /><span><small>Horario de atención</small>{contact.hours}</span></div><div className="contact-dealer"><Network size={27} /><h3>¿Buscás un distribuidor?</h3><p>Encontrá un aliado cercano a tu operación.</p><TextLink to="/dealers">Explorá nuestra red</TextLink></div></aside></div></section></>;
}
function ArticlePage() {
  const { slug } = useParams(); const article = articles.find(a => a.slug === slug);
  if (!article) return <NotFound />;
  return <><PageIntro eyebrow={`Perspectivas · ${article.category}`} title={article.title}>{article.excerpt}</PageIntro><article className="article-detail container"><img className={article.image === 'r7.webp' ? 'article-detail-contain' : ''} src={asset(article.image)} alt="" /><div className="prose">{article.paragraphs.map(p => <p key={p}>{p}</p>)}<TextLink to="/contacto">Hablemos de tu operación</TextLink></div></article><ArticlesSection /><ClosingCTA /></>;
}
function PrivacyPage() {
  return <><PageIntro eyebrow="Privacidad" title="Tus datos, con claridad." /><section className="section"><div className="container prose"><h2>Consultas de contacto</h2><p>Este sitio prepara la información que ingresás para enviarla mediante tu aplicación de correo a ACEG Comunicaciones. Completar el formulario no envía mensajes ni almacena tus datos en un servidor.</p><p>Al abrir tu correo, podés revisar y decidir si enviás la consulta. La información recibida por ACEG se utiliza para responderte y orientar tu necesidad comercial o técnica.</p><h2>Navegación</h2><p>Esta versión no incorpora herramientas de publicidad o analítica, ni cookies propias de seguimiento. Las tipografías se sirven desde Google Fonts. Los enlaces externos tienen sus propias condiciones de privacidad.</p><h2>Contacto</h2><p>Para consultas sobre los datos que hayas enviado, escribí a <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p></div></section></>;
}
function NotFound() {
  return <section className="section not-found container"><Eyebrow>404 · Conexión por encontrar</Eyebrow><h1>Busquemos<br />otra conexión.</h1><p>La página que buscás no está disponible. Podés volver al inicio o explorar nuestras soluciones.</p><Action to="/">Volver al inicio</Action><TextLink to="/productos">Explorar productos</TextLink></section>;
}
function PageEffects() {
  const { pathname: rawPathname, hash } = useLocation();
  const pathname = rawPathname.replace(/\/+$/, '') || '/';
  useEffect(() => {
    if (hash) { requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView()); } else window.scrollTo(0, 0);
    const product = products.find(p => pathname.endsWith(`/${p.slug}`));
    const industry = industries.find(i => pathname === `/industrias/${i.slug}`);
    const article = articles.find(a => pathname === `/novedades/${a.slug}`);
    const titles: Record<string, string> = { '/': 'De comunicar mejor a operar mejor', '/productos': 'Productos y tecnología', '/soluciones': 'Soluciones integradas', '/industrias': 'Soluciones por industria', '/dealers': 'Red de distribuidores', '/nosotros': 'Conectamos personas desde 1980', '/novedades': 'Perspectivas', '/contacto': 'Hablemos de tu operación', '/privacidad': 'Privacidad' };
    const title = product?.name || industry?.name || article?.title || titles[pathname] || categories.find(c => pathname === `/productos/${c.slug}`)?.name || 'Página no encontrada';
    document.title = `${title} | ACEG Comunicaciones`;
    const description = product?.description || industry?.text || article?.excerpt || 'Comunicaciones críticas, tecnología Motorola Solutions y respaldo ACEG para conectar personas y operaciones en Argentina.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    let schema = document.getElementById('page-schema');
    if (!schema) { schema = document.createElement('script'); schema.id = 'page-schema'; schema.setAttribute('type', 'application/ld+json'); document.head.appendChild(schema); }
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', new URL(pathname.slice(1), siteUrl).href);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', new URL(pathname.slice(1), siteUrl).href);
    schema.textContent = JSON.stringify(product ? { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, image: new URL(asset(product.image), window.location.origin).href, brand: { '@type': 'Brand', name: 'Motorola Solutions' } } : { '@context': 'https://schema.org', '@type': 'Organization', name: 'ACEG Comunicaciones S.A.', url: siteUrl, telephone: '+541147010985', email: contact.email, address: { '@type': 'PostalAddress', streetAddress: 'Av. del Libertador 8156', addressLocality: 'Buenos Aires', addressCountry: 'AR' } });
  }, [pathname, hash]);
  return null;
}
function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><PageEffects /><Header /><main id="contenido"><Routes><Route path="/" element={<Home />} /><Route path="/productos" element={<ProductsPage />} /><Route path="/productos/:category" element={<ProductsPage />} /><Route path="/productos/:category/:slug" element={<ProductDetail />} /><Route path="/soluciones" element={<SolutionsPage />} /><Route path="/industrias" element={<IndustriesPage />} /><Route path="/industrias/:slug" element={<IndustryPage />} /><Route path="/dealers" element={<DealersPage />} /><Route path="/nosotros" element={<AboutPage />} /><Route path="/novedades" element={<><PageIntro eyebrow="Perspectivas ACEG" title="Ideas que conectan.">Una mirada sobre tecnología, ingeniería y las decisiones que ayudan a operar mejor.</PageIntro><ArticlesSection full /><ClosingCTA /></>} /><Route path="/novedades/:slug" element={<ArticlePage />} /><Route path="/contacto" element={<ContactPage />} /><Route path="/privacidad" element={<PrivacyPage />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /><Link className="floating-contact" to="/contacto" title="Hablemos de tu proyecto" aria-label="Contactar a ACEG"><MessageCircle size={23} /></Link></BrowserRouter>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

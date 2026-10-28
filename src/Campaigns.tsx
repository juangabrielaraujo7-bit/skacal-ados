import { ArrowRight } from '@phosphor-icons/react';
import { PageLink } from './Storefront';

export function BootCampaign() {
  return <section className="campaign-hero container" aria-label="Seleção de botas SKA">
    <h1>BOTAS</h1>
    <img className="campaign-boot" src="/assets/campaigns/bota-editorial.webp" alt="Bota marrom de cadarço da seleção masculina" fetchPriority="high" width="1254" height="1254"/>
    <div className="campaign-copy"><p className="campaign-lead">Presença em cada passo.</p><p>Encontre a bota que combina com o seu ritmo.</p><PageLink to="/categoria/botas" className="campaign-button">Explorar botas<ArrowRight size={18}/></PageLink></div>
  </section>;
}

export function SandalCampaign() {
  return <section className="campaign-lifestyle container" aria-labelledby="sandal-campaign-title">
    <img src="/assets/campaigns/sandalias-editorial.webp" alt="Campanha ilustrativa de sandálias douradas em uso, com cenário em tons de café" width="1774" height="887" loading="lazy"/>
    <div className="campaign-lifestyle-copy"><h2 id="sandal-campaign-title">O detalhe<br/> que fica.</h2><p>Sandálias para dar um novo passo<br/>nas suas combinações.</p><PageLink to="/categoria/sandalias" className="campaign-button campaign-button-light">Descobrir sandálias<ArrowRight size={18}/></PageLink></div>
  </section>;
}

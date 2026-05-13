import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const secties = [
  { to: '/tijdlijn', icon: '📅', title: 'Tijdlijn', desc: 'Chronologisch overzicht van de gebeurtenissen' },
  { to: '/verhalen', icon: '📖', title: 'Verhalen', desc: 'Ooggetuigen en nabestaanden aan het woord' },
  { to: '/archief', icon: '🗄️', title: 'Archief', desc: "Foto's, video's, audio en documenten" },
  { to: '/kaart', icon: '🗺️', title: 'Kaart', desc: 'Interactieve kaart van historische locaties' },
  { to: '/publicaties', icon: '📚', title: 'Publicaties', desc: 'Boeken, toneelstukken en films' },
  { to: '/herdenking', icon: '🕯️', title: 'Herdenking', desc: 'Jaarlijkse herdenkingsplechtigheid' },
  { to: '/onderwijs', icon: '🏫', title: 'Onderwijs', desc: 'Lesmateriaal voor scholen' },
  { to: '/gastboek', icon: '✍️', title: 'Gastboek', desc: 'Deel uw herinnering of reactie' },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [verhalen, setVerhalen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.events.all(), api.verhalen.all()])
      .then(([ev, vh]) => { setEvents(ev.slice(0, 3)); setVerhalen(vh.slice(0, 3)); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-year">28 april 1945 — Rijsbergen</div>
            <h1>Oorlogsdrama op de Vloeiweide</h1>
            <p>
              Een historisch platform over een van de pijnlijkste gebeurtenissen in de geschiedenis van Rijsbergen.
              Bewaar de herinnering. Ken het verleden. Eer de gevallenen.
            </p>
            <div className="hero-actions">
              <Link to="/tijdlijn" className="btn btn-primary">Bekijk de tijdlijn</Link>
              <Link to="/verhalen" className="btn btn-outline">Lees de verhalen</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Ontdek het platform</h2>
          <p className="section-subtitle">Alles over het oorlogsdrama op de Vloeiweide</p>
          <div className="quick-links">
            {secties.map(s => (
              <Link key={s.to} to={s.to} className="quick-link-card">
                <span className="quick-link-icon">{s.icon}</span>
                <div className="quick-link-title">{s.title}</div>
                <div className="quick-link-desc">{s.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 className="section-title">De Vloeiweide</h2>
              <div className="gold-line" />
              <p style={{ color: 'var(--text-mid)', marginBottom: '1rem' }}>
                Op 28 april 1945, slechts dagen voor de definitieve bevrijding van Nederland,
                vond op de Vloeiweide bij Rijsbergen een dramatische gebeurtenis plaats.
                Gevangenen werden er gefusilleerd door de Duitse bezetter.
              </p>
              <p style={{ color: 'var(--text-mid)', marginBottom: '1.5rem' }}>
                Dit platform bewaart de herinneringen, de verhalen en de documenten over dit
                oorlogsdrama — voor de huidige generatie en voor de toekomst.
              </p>
              <Link to="/tijdlijn" className="btn btn-primary">Lees de volledige tijdlijn</Link>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
              borderRadius: '16px',
              padding: '2.5rem',
              color: 'white',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✦</div>
              <blockquote style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem',
                fontStyle: 'italic',
                lineHeight: '1.6',
                color: 'rgba(255,255,255,0.9)',
              }}>
                "Wie de geschiedenis vergeet, is gedoemd haar te herhalen."
              </blockquote>
              <div style={{ color: 'var(--gold-light)', marginTop: '1rem', fontSize: '0.85rem' }}>
                In herdenking aan de slachtoffers van de Vloeiweide
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? <LoadingSpinner /> : (
        <>
          {events.length > 0 && (
            <section className="section">
              <div className="container">
                <h2 className="section-title">Recente tijdlijn</h2>
                <p className="section-subtitle">Enkele belangrijke momenten uit de geschiedenis</p>
                <div className="grid-3">
                  {events.map(e => (
                    <div key={e.id} className="card">
                      <div className="card-body">
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span className={`badge badge-${e.categorie}`}>{e.categorie}</span>
                        </div>
                        <h3 className="card-title">{e.titel}</h3>
                        <p className="card-text" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {e.beschrijving}
                        </p>
                        <p className="card-meta">📅 {new Date(e.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link to="/tijdlijn" className="btn btn-secondary">Volledige tijdlijn →</Link>
                </div>
              </div>
            </section>
          )}

          {verhalen.length > 0 && (
            <section className="section section-alt">
              <div className="container">
                <h2 className="section-title">Verhalen & getuigenissen</h2>
                <p className="section-subtitle">Persoonlijke herinneringen aan de oorlogsjaren</p>
                <div className="grid-3">
                  {verhalen.map(v => (
                    <Link key={v.id} to={`/verhalen/${v.id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                      <div className="card-body">
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span className={`badge badge-${v.categorie}`}>{v.categorie}</span>
                        </div>
                        <h3 className="card-title">{v.titel}</h3>
                        <p className="card-text" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {v.samenvatting || v.inhoud}
                        </p>
                        <p className="card-meta">✍️ {v.auteur}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link to="/verhalen" className="btn btn-secondary">Alle verhalen →</Link>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <section className="section" style={{ background: 'var(--navy-dark)', color: 'white', marginTop: 0 }}>
        <div className="container text-center">
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Herdenk met ons</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '560px', margin: '0 auto 2rem' }}>
            Elk jaar op 28 april vindt de herdenkingsplechtigheid plaats op de Vloeiweide.
            Kom langs, leg bloemen neer, en eer de gevallenen.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/herdenking" className="btn btn-primary">Herdenkingskalender</Link>
            <Link to="/gastboek" className="btn btn-outline">Schrijf in het gastboek</Link>
          </div>
        </div>
      </section>
    </>
  );
}

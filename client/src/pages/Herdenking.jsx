import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

function parseDatumLabel(datum) {
  const maanden = ['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];
  const parts = datum.split(' ');
  if (parts.length === 2) {
    const dag = parts[0];
    const m = parseInt(parts[1]) - 1;
    return { dag, maand: maanden[m] || parts[1] };
  }
  const d = new Date(datum);
  if (!isNaN(d)) return { dag: d.getDate().toString(), maand: maanden[d.getMonth()] };
  return { dag: datum.slice(0, 2), maand: datum.slice(3) || datum };
}

export default function Herdenking() {
  const [herdenkingen, setHerdenkingen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.herdenkingen.all().then(setHerdenkingen).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Herdenking</h1>
          <div className="gold-line" />
          <p>Jaarlijkse herdenkingsplechtigheid en andere momenten van herinnering aan de slachtoffers van de Vloeiweide.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            <div>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.6rem' }}>Herdenkingskalender</h2>
              {loading ? <LoadingSpinner /> : (
                herdenkingen.length === 0 ? (
                  <p style={{ color: 'var(--text-light)' }}>Geen herdenkingen gevonden.</p>
                ) : (
                  herdenkingen.map(h => {
                    const { dag, maand } = parseDatumLabel(h.datum);
                    return (
                      <div key={h.id} className="herdenking-card">
                        <div className="herdenking-datum">
                          <div className="dag">{dag}</div>
                          <div className="maand">{maand}</div>
                          {h.jaarlijks === 1 && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>jaarlijks</div>}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{h.titel}</h3>
                          {h.locatie && <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>📍 {h.locatie}</p>}
                          {h.beschrijving && <p style={{ fontSize: '0.92rem', color: 'var(--text-mid)', lineHeight: '1.65' }}>{h.beschrijving}</p>}
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </div>
            <div>
              <div style={{ background: 'var(--navy-dark)', color: 'white', borderRadius: '16px', padding: '2rem', textAlign: 'center', position: 'sticky', top: '80px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🕯️</div>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Eerste zondag na 4 oktober</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  Elk jaar op de eerste zondag na 4 oktober herdenken wij de slachtoffers van het drama op de Vloeiweide.
                  Wij nodigen iedereen uit om aanwezig te zijn bij de plechtigheid.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem' }}>
                  <p style={{ color: 'var(--gold-light)', fontWeight: 600, marginBottom: '0.3rem' }}>Locatie</p>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>De Vloeiweide, Rijsbergen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.6rem' }}>Het belang van herdenken</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            {[
              { icon: '🌹', title: 'Eer bewijzen', text: 'Wij herdenken de slachtoffers om hen de eer te geven die zij verdienen. Zij stierven voor onze vrijheid.' },
              { icon: '📚', title: 'Kennis doorgeven', text: 'Door te herdenken geven we de kennis door aan de volgende generatie. Zodat zij weten wat er hier is gebeurd.' },
              { icon: '🕊️', title: 'Vrede bewaren', text: 'Herdenken is ook een oproep tot vrede. Nooit meer oorlog — dat is de boodschap van de Vloeiweide.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: '1.65' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

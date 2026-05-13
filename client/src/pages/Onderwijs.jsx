import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const typen = ['alle', 'lesmateriaal', 'activiteit', 'project'];
const typeIcons = { lesmateriaal: '📄', activiteit: '🏃', project: '🔬', default: '📚' };

export default function Onderwijs() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('alle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.onderwijs.all().then(setItems).finally(() => setLoading(false));
  }, []);

  const gefilterd = filter === 'alle' ? items : items.filter(i => i.type === filter);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Onderwijs</h1>
          <div className="gold-line" />
          <p>Lespakketten, excursies en projecten voor scholen. Wij helpen leerlingen de geschiedenis van de Vloeiweide te leren kennen.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginBottom: '3rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Onderwijs over de Vloeiweide</h2>
              <p style={{ color: 'var(--text-mid)', lineHeight: '1.75' }}>
                Wij bieden verschillende educatieve materialen aan voor scholen in Rijsbergen en omgeving.
                Van lespakketten voor basisscholen tot projecten voor middelbare scholen.
                Neem contact op via het gastboek om meer informatie aan te vragen of een excursie te boeken.
              </p>
            </div>
            <div style={{ background: 'var(--navy-dark)', color: 'white', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏫</div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                Excursie aanvragen of lespakket bestellen?
              </p>
              <a href="/gastboek" className="btn btn-outline btn-sm">Neem contact op</a>
            </div>
          </div>

          <div className="filter-bar">
            {typen.map(t => (
              <button key={t} className={`filter-btn${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>
                {t !== 'alle' && (typeIcons[t] || '') + ' '}{t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : (
            gefilterd.length === 0 ? (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '3rem' }}>Geen materialen gevonden.</p>
            ) : (
              <div>
                {gefilterd.map(item => (
                  <div key={item.id} className="onderwijs-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.5rem' }}>{typeIcons[item.type] || typeIcons.default}</span>
                          <span className={`badge badge-${item.type}`}>{item.type}</span>
                          {item.doelgroep && <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>🎯 {item.doelgroep}</span>}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.titel}</h3>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-mid)', lineHeight: '1.65' }}>{item.beschrijving}</p>
                      </div>
                      {item.download_url && (
                        <div>
                          <a href={item.download_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                            ⬇️ Download
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', textAlign: 'center' }}>Waarom dit onderwerp in de klas?</h2>
          <div className="grid-3">
            {[
              { icon: '🌍', title: 'Wereldgeschiedenis lokaal', text: 'De Tweede Wereldoorlog was een wereldwijde gebeurtenis, maar ze had ook een concrete impact op kleine gemeenschappen als Rijsbergen. Dat maakt de geschiedenis tastbaar.' },
              { icon: '💬', title: 'Gesprek over waarden', text: 'Het verhaal van de Vloeiweide biedt de gelegenheid om met leerlingen te spreken over moed, verrraad, vrijheid en de gevolgen van oorlog.' },
              { icon: '🔍', title: 'Onderzoeksvaardigheden', text: 'Leerlingen leren bronnen te beoordelen, interviews af te nemen en historisch onderzoek te doen — met de Vloeiweide als casus.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
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

import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const categorieen = ['alle', 'drama', 'bezetting', 'bevrijding', 'verzet', 'arrestaties', 'herdenking', 'monument', 'publicatie'];

function formatDatum(d) {
  try {
    return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return d; }
}

export default function Tijdlijn() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('alle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.events.all().then(setEvents).finally(() => setLoading(false));
  }, []);

  const gefilterd = filter === 'alle' ? events : events.filter(e => e.categorie === filter);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Tijdlijn</h1>
          <div className="gold-line" />
          <p>Een chronologisch overzicht van de belangrijkste gebeurtenissen — van de bezetting tot de herdenking.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            {categorieen.map(c => (
              <button
                key={c}
                className={`filter-btn${filter === c ? ' active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : (
            gefilterd.length === 0 ? (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '3rem' }}>
                Geen gebeurtenissen gevonden voor deze categorie.
              </p>
            ) : (
              <div className="timeline">
                {gefilterd.map((e, i) => (
                  <div key={e.id} className="timeline-item">
                    <div className={`timeline-dot ${e.categorie}`} />
                    <div className="timeline-card">
                      <div className="timeline-date">{formatDatum(e.datum)}</div>
                      <h3>{e.titel}</h3>
                      <p>{e.beschrijving}</p>
                      {e.foto_url && (
                        <img src={e.foto_url} alt={e.titel} style={{ marginTop: '0.75rem', borderRadius: '6px', width: '100%', maxHeight: '180px', objectFit: 'cover' }} />
                      )}
                      <div style={{ marginTop: '0.75rem' }}>
                        <span className={`badge badge-${e.categorie}`}>{e.categorie}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}

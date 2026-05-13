import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const typen = ['alle', 'boek', 'toneelstuk', 'film', 'artikel'];
const typeIcons = { boek: '📚', toneelstuk: '🎭', film: '🎬', artikel: '📰', default: '📄' };

export default function Publicaties() {
  const [publicaties, setPublicaties] = useState([]);
  const [filter, setFilter] = useState('alle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.publicaties.all().then(setPublicaties).finally(() => setLoading(false));
  }, []);

  const gefilterd = filter === 'alle' ? publicaties : publicaties.filter(p => p.type === filter);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Boeken & Publicaties</h1>
          <div className="gold-line" />
          <p>Overzicht van boeken, toneelstukken, films en artikelen over het oorlogsdrama op de Vloeiweide en de bezettingstijd in Rijsbergen.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            {typen.map(t => (
              <button key={t} className={`filter-btn${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>
                {t !== 'alle' && (typeIcons[t] || '') + ' '}{t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : (
            gefilterd.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <p>Geen publicaties in deze categorie.</p>
              </div>
            ) : (
              <div>
                {gefilterd.map(p => (
                  <div key={p.id} className="publicatie-card">
                    <div className="publicatie-cover">
                      {p.cover_url
                        ? <img src={p.cover_url} alt={p.titel} />
                        : <span>{typeIcons[p.type] || typeIcons.default}</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span className={`badge badge-${p.type}`}>{p.type}</span>
                        {p.jaar && <span style={{ marginLeft: '0.5rem', fontSize: '0.82rem', color: 'var(--text-light)' }}>{p.jaar}</span>}
                      </div>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: '0.3rem' }}>{p.titel}</h3>
                      {p.auteur && <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Door: <em>{p.auteur}</em></p>}
                      {p.beschrijving && <p style={{ fontSize: '0.92rem', color: 'var(--text-mid)', lineHeight: '1.65' }}>{p.beschrijving}</p>}
                      {p.isbn && <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-light)' }}>ISBN: {p.isbn}</p>}
                      {p.koop_url && (
                        <a href={p.koop_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                          Meer informatie →
                        </a>
                      )}
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

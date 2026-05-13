import { useEffect, useState } from 'react';
import { api } from '../api';
import MediaEmbed from '../components/MediaEmbed';
import LoadingSpinner from '../components/LoadingSpinner';

const typen = ['alle', 'foto', 'video', 'audio', 'document'];
const typeIcons = { foto: '🖼️', video: '🎬', audio: '🎙️', document: '📄', default: '📁' };

export default function Archief() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('alle');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.archief.all().then(setItems).finally(() => setLoading(false));
  }, []);

  const gefilterd = filter === 'alle' ? items : items.filter(i => i.type === filter);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Archief</h1>
          <div className="gold-line" />
          <p>Foto's, video's, audio-opnames en documenten over het oorlogsdrama op de Vloeiweide en de bezettingstijd in Rijsbergen.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            {typen.map(t => (
              <button key={t} className={`filter-btn${filter === t ? ' active' : ''}`} onClick={() => setFilter(t)}>
                {t !== 'alle' && typeIcons[t] + ' '}{t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : (
            gefilterd.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗄️</div>
                <p>Nog geen archiefitems in deze categorie.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>U kunt items toevoegen via de <a href="/beheer">beheerpagina</a>.</p>
              </div>
            ) : (
              <div className="grid-4">
                {gefilterd.map(item => (
                  <div key={item.id} className="card archive-card" onClick={() => setSelected(item)}>
                    {item.thumbnail_url ? (
                      <img className="card-img" src={item.thumbnail_url} alt={item.titel} />
                    ) : (
                      <div className="archive-type-icon">
                        <span>{typeIcons[item.type] || typeIcons.default}</span>
                      </div>
                    )}
                    <div className="card-body">
                      <span className={`badge badge-${item.type}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{item.type}</span>
                      <h3 className="card-title" style={{ fontSize: '0.95rem' }}>{item.titel}</h3>
                      {item.jaar && <p className="card-meta">📅 {item.jaar}</p>}
                      {item.bron && <p className="card-meta">📌 {item.bron}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '760px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{selected.titel}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <MediaEmbed type={selected.type} url={selected.url} embedUrl={selected.embed_url} title={selected.titel} />
              {selected.beschrijving && <p style={{ marginTop: '1rem', color: 'var(--text-mid)' }}>{selected.beschrijving}</p>}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {selected.jaar && <span className="card-meta">📅 {selected.jaar}</span>}
                {selected.bron && <span className="card-meta">📌 Bron: {selected.bron}</span>}
                <span className={`badge badge-${selected.type}`}>{selected.type}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

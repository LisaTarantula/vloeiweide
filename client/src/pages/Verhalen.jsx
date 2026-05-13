import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const categorieen = ['alle', 'ooggetuige', 'nabestaande', 'verhaal', 'informatie'];

export default function Verhalen() {
  const [verhalen, setVerhalen] = useState([]);
  const [filter, setFilter] = useState('alle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.verhalen.all().then(setVerhalen).finally(() => setLoading(false));
  }, []);

  const gefilterd = filter === 'alle' ? verhalen : verhalen.filter(v => v.categorie === filter);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Verhalen & Getuigenissen</h1>
          <div className="gold-line" />
          <p>Persoonlijke herinneringen van ooggetuigen, nabestaanden en betrokkenen aan het oorlogsdrama op de Vloeiweide.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            {categorieen.map(c => (
              <button key={c} className={`filter-btn${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : (
            gefilterd.length === 0 ? (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '3rem' }}>Geen verhalen gevonden.</p>
            ) : (
              <div className="grid-3">
                {gefilterd.map(v => (
                  <Link key={v.id} to={`/verhalen/${v.id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    {v.foto_url && <img className="card-img" src={v.foto_url} alt={v.titel} />}
                    {!v.foto_url && (
                      <div style={{ height: '140px', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                        📖
                      </div>
                    )}
                    <div className="card-body">
                      <span className={`badge badge-${v.categorie}`} style={{ marginBottom: '0.6rem', display: 'inline-block' }}>{v.categorie}</span>
                      <h3 className="card-title">{v.titel}</h3>
                      <p className="card-text" style={{ WebkitLineClamp: 4, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {v.samenvatting || v.inhoud}
                      </p>
                      <p className="card-meta" style={{ marginTop: '0.75rem' }}>✍️ {v.auteur}</p>
                      <p className="card-meta">📅 {new Date(v.created_at).toLocaleDateString('nl-NL')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}

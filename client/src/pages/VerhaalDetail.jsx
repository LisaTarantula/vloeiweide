import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function VerhaalDetail() {
  const { id } = useParams();
  const [verhaal, setVerhaal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.verhalen.get(id)
      .then(setVerhaal)
      .catch(() => setErr('Dit verhaal kon niet worden geladen.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (err) return <div className="container section"><div className="alert alert-error">{err}</div></div>;
  if (!verhaal) return null;

  const alineas = verhaal.inhoud.split('\n\n').filter(Boolean);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <Link to="/verhalen" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', display: 'block', marginBottom: '1rem' }}>
            ← Terug naar verhalen
          </Link>
          <span className={`badge badge-${verhaal.categorie}`} style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{verhaal.categorie}</span>
          <h1>{verhaal.titel}</h1>
          <div className="gold-line" />
          <p>Door: <strong>{verhaal.auteur}</strong></p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {verhaal.foto_url && (
              <img src={verhaal.foto_url} alt={verhaal.titel} style={{ width: '100%', borderRadius: '12px', marginBottom: '2rem', maxHeight: '420px', objectFit: 'cover' }} />
            )}
            <div className="story-content">
              {alineas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--cream-dark)', borderRadius: '10px', borderLeft: '4px solid var(--gold)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>
                <strong>{verhaal.auteur}</strong> · Gepubliceerd op {new Date(verhaal.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/verhalen" className="btn btn-secondary">← Meer verhalen</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

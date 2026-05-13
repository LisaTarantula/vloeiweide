import { Link } from 'react-router-dom';

export default function NietGevonden() {
  return (
    <section className="section">
      <div className="container text-center" style={{ padding: '5rem 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Pagina niet gevonden</h1>
        <p style={{ color: 'var(--text-mid)', marginBottom: '2rem' }}>
          De pagina die u zoekt bestaat niet of is verplaatst.
        </p>
        <Link to="/" className="btn btn-primary">Terug naar de homepage</Link>
      </div>
    </section>
  );
}

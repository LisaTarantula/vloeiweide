import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Gastboek() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ naam: '', woonplaats: '', bericht: '', email: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.gastboek.all().then(setEntries).finally(() => setLoading(false));
  }, []);

  async function verstuur(e) {
    e.preventDefault();
    if (!form.naam.trim() || !form.bericht.trim()) {
      setError('Vul uw naam en bericht in.');
      return;
    }
    setSending(true);
    setError('');
    try {
      const r = await api.gastboek.stuur(form);
      setSuccess(r.bericht || 'Uw bericht is ontvangen en wacht op goedkeuring.');
      setForm({ naam: '', woonplaats: '', bericht: '', email: '' });
    } catch (err) {
      setError(err.message || 'Er is een fout opgetreden.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Gastboek</h1>
          <div className="gold-line" />
          <p>Deel uw herinnering, reactie of groet. Uw bericht wordt zichtbaar na goedkeuring door de beheerder.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            <div>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Berichten van bezoekers</h2>
              {loading ? <LoadingSpinner /> : (
                entries.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)', background: 'white', borderRadius: '12px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
                    <p>Nog geen berichten. Wees de eerste die schrijft!</p>
                  </div>
                ) : (
                  entries.map(entry => (
                    <div key={entry.id} className="guestbook-entry">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <span className="guestbook-name">{entry.naam}</span>
                          {entry.woonplaats && <span className="guestbook-place"> · {entry.woonplaats}</span>}
                        </div>
                        <span className="guestbook-date">
                          {new Date(entry.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="guestbook-text">{entry.bericht}</p>
                    </div>
                  ))
                )
              )}
            </div>

            <div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', boxShadow: 'var(--shadow)', position: 'sticky', top: '80px' }}>
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>✍️ Schrijf een bericht</h3>
                {success ? (
                  <div className="alert alert-success">{success}</div>
                ) : (
                  <form onSubmit={verstuur}>
                    {error && <div className="alert alert-error">{error}</div>}
                    <div className="form-group">
                      <label>Naam *</label>
                      <input className="form-control" value={form.naam} onChange={e => setForm(f => ({ ...f, naam: e.target.value }))} placeholder="Uw naam" />
                    </div>
                    <div className="form-group">
                      <label>Woonplaats</label>
                      <input className="form-control" value={form.woonplaats} onChange={e => setForm(f => ({ ...f, woonplaats: e.target.value }))} placeholder="Uw woonplaats (optioneel)" />
                    </div>
                    <div className="form-group">
                      <label>E-mailadres</label>
                      <input type="email" className="form-control" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Optioneel, niet zichtbaar" />
                    </div>
                    <div className="form-group">
                      <label>Bericht *</label>
                      <textarea className="form-control" rows={5} value={form.bericht} onChange={e => setForm(f => ({ ...f, bericht: e.target.value }))} placeholder="Uw herinnering, reactie of groet..." />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={sending}>
                      {sending ? 'Versturen...' : 'Bericht versturen'}
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.75rem', textAlign: 'center' }}>
                      Uw bericht wordt zichtbaar na goedkeuring.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

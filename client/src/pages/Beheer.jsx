import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

function LoginForm({ onLogin }) {
  const [ww, setWw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const { token } = await api.auth.login(ww);
      localStorage.setItem('vloeiweide_token', token);
      onLogin();
    } catch { setErr('Onjuist wachtwoord.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.4rem' }}>Beheerder inloggen</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Vloeiweide Platform</p>
        </div>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Wachtwoord</label>
            <input type="password" className="form-control" value={ww} onChange={e => setWw(e.target.value)} autoFocus placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Inloggen...' : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  );
}

function EventsTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ datum: '', titel: '', beschrijving: '', categorie: 'algemeen', foto_url: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const laad = () => api.events.all().then(setItems);
  useEffect(() => { laad(); }, []);

  async function sla(e) {
    e.preventDefault();
    try {
      if (editing) await api.events.update(editing, form);
      else await api.events.create(form);
      setMsg('Opgeslagen!'); setEditing(null);
      setForm({ datum: '', titel: '', beschrijving: '', categorie: 'algemeen', foto_url: '' });
      laad();
    } catch (err) { setMsg('Fout: ' + err.message); }
  }

  async function verwijder(id) {
    if (!confirm('Weet u zeker dat u dit wilt verwijderen?')) return;
    await api.events.verwijder(id); laad();
  }

  function bewerk(item) {
    setEditing(item.id);
    setForm({ datum: item.datum, titel: item.titel, beschrijving: item.beschrijving, categorie: item.categorie, foto_url: item.foto_url || '' });
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <h2>Tijdlijn beheren</h2>
      <div className="admin-form">
        <h3>{editing ? 'Bewerk gebeurtenis' : 'Nieuwe gebeurtenis'}</h3>
        {msg && <div className={`alert ${msg.startsWith('Fout') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}
        <form onSubmit={sla}>
          <div className="form-row">
            <div className="form-group">
              <label>Datum *</label>
              <input type="date" className="form-control" value={form.datum} onChange={e => setForm(f => ({ ...f, datum: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Categorie</label>
              <select className="form-control" value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
                {['algemeen','drama','bezetting','bevrijding','verzet','arrestaties','herdenking','monument','publicatie'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Titel *</label>
            <input className="form-control" value={form.titel} onChange={e => setForm(f => ({ ...f, titel: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Beschrijving *</label>
            <textarea className="form-control" rows={4} value={form.beschrijving} onChange={e => setForm(f => ({ ...f, beschrijving: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Foto-URL (optioneel)</label>
            <input className="form-control" value={form.foto_url} onChange={e => setForm(f => ({ ...f, foto_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Opslaan</button>
            {editing && <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(null); setForm({ datum: '', titel: '', beschrijving: '', categorie: 'algemeen', foto_url: '' }); }}>Annuleren</button>}
          </div>
        </form>
      </div>
      <table className="admin-table">
        <thead><tr><th>Datum</th><th>Titel</th><th>Categorie</th><th>Acties</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ whiteSpace: 'nowrap' }}>{item.datum}</td>
              <td>{item.titel}</td>
              <td><span className={`badge badge-${item.categorie}`}>{item.categorie}</span></td>
              <td><div className="admin-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => bewerk(item)}>Bewerken</button>
                <button className="btn btn-danger btn-sm" onClick={() => verwijder(item.id)}>Verwijderen</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VerhalenTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ titel: '', auteur: '', samenvatting: '', inhoud: '', categorie: 'verhaal', foto_url: '', gepubliceerd: 1 });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const laad = () => api.verhalen.alle().then(setItems);
  useEffect(() => { laad(); }, []);

  async function sla(e) {
    e.preventDefault();
    try {
      if (editing) await api.verhalen.update(editing, form);
      else await api.verhalen.create(form);
      setMsg('Opgeslagen!'); setEditing(null);
      setForm({ titel: '', auteur: '', samenvatting: '', inhoud: '', categorie: 'verhaal', foto_url: '', gepubliceerd: 1 });
      laad();
    } catch (err) { setMsg('Fout: ' + err.message); }
  }

  async function verwijder(id) {
    if (!confirm('Weet u zeker dat u dit wilt verwijderen?')) return;
    await api.verhalen.verwijder(id); laad();
  }

  function bewerk(item) {
    setEditing(item.id);
    setForm({ titel: item.titel, auteur: item.auteur, samenvatting: item.samenvatting || '', inhoud: item.inhoud, categorie: item.categorie, foto_url: item.foto_url || '', gepubliceerd: item.gepubliceerd });
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <h2>Verhalen beheren</h2>
      <div className="admin-form">
        <h3>{editing ? 'Bewerk verhaal' : 'Nieuw verhaal'}</h3>
        {msg && <div className={`alert ${msg.startsWith('Fout') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}
        <form onSubmit={sla}>
          <div className="form-row">
            <div className="form-group">
              <label>Titel *</label>
              <input className="form-control" value={form.titel} onChange={e => setForm(f => ({ ...f, titel: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Auteur *</label>
              <input className="form-control" value={form.auteur} onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Categorie</label>
              <select className="form-control" value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
                {['verhaal','ooggetuige','nabestaande','informatie'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.gepubliceerd} onChange={e => setForm(f => ({ ...f, gepubliceerd: parseInt(e.target.value) }))}>
                <option value={1}>Gepubliceerd</option>
                <option value={0}>Concept</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Korte samenvatting</label>
            <textarea className="form-control" rows={2} value={form.samenvatting} onChange={e => setForm(f => ({ ...f, samenvatting: e.target.value }))} placeholder="Optioneel — wordt gebruikt als voorvertoning" />
          </div>
          <div className="form-group">
            <label>Verhaal (volledige tekst) *</label>
            <textarea className="form-control" rows={8} value={form.inhoud} onChange={e => setForm(f => ({ ...f, inhoud: e.target.value }))} required placeholder="Gebruik lege regels om alinea's te scheiden." />
          </div>
          <div className="form-group">
            <label>Foto-URL</label>
            <input className="form-control" value={form.foto_url} onChange={e => setForm(f => ({ ...f, foto_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Opslaan</button>
            {editing && <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(null); setForm({ titel: '', auteur: '', samenvatting: '', inhoud: '', categorie: 'verhaal', foto_url: '', gepubliceerd: 1 }); }}>Annuleren</button>}
          </div>
        </form>
      </div>
      <table className="admin-table">
        <thead><tr><th>Titel</th><th>Auteur</th><th>Categorie</th><th>Status</th><th>Acties</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.titel}</td>
              <td>{item.auteur}</td>
              <td><span className={`badge badge-${item.categorie}`}>{item.categorie}</span></td>
              <td>{item.gepubliceerd ? '✅ Gepubliceerd' : '⏳ Concept'}</td>
              <td><div className="admin-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => bewerk(item)}>Bewerken</button>
                <button className="btn btn-danger btn-sm" onClick={() => verwijder(item.id)}>Verwijderen</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ArchiefTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ titel: '', type: 'foto', beschrijving: '', url: '', embed_url: '', thumbnail_url: '', jaar: '', bron: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const laad = () => api.archief.all().then(setItems);
  useEffect(() => { laad(); }, []);

  async function sla(e) {
    e.preventDefault();
    try {
      if (editing) await api.archief.update(editing, form);
      else await api.archief.create(form);
      setMsg('Opgeslagen!'); setEditing(null);
      setForm({ titel: '', type: 'foto', beschrijving: '', url: '', embed_url: '', thumbnail_url: '', jaar: '', bron: '' });
      laad();
    } catch (err) { setMsg('Fout: ' + err.message); }
  }

  async function verwijder(id) {
    if (!confirm('Verwijderen?')) return;
    await api.archief.verwijder(id); laad();
  }

  function bewerk(item) {
    setEditing(item.id);
    setForm({ titel: item.titel, type: item.type, beschrijving: item.beschrijving || '', url: item.url || '', embed_url: item.embed_url || '', thumbnail_url: item.thumbnail_url || '', jaar: item.jaar || '', bron: item.bron || '' });
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <h2>Archief beheren</h2>
      <div className="admin-form">
        <h3>{editing ? 'Bewerk archiefitem' : 'Nieuw archiefitem'}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
          Voor YouTube-video's: plak de gewone YouTube-URL in het URL-veld. Het platform herkent automatisch YouTube-links.
        </p>
        {msg && <div className={`alert ${msg.startsWith('Fout') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}
        <form onSubmit={sla}>
          <div className="form-row">
            <div className="form-group">
              <label>Titel *</label>
              <input className="form-control" value={form.titel} onChange={e => setForm(f => ({ ...f, titel: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select className="form-control" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {['foto','video','audio','document'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Jaar</label>
              <input type="number" className="form-control" value={form.jaar} onChange={e => setForm(f => ({ ...f, jaar: e.target.value }))} placeholder="bijv. 1945" />
            </div>
            <div className="form-group">
              <label>Bron</label>
              <input className="form-control" value={form.bron} onChange={e => setForm(f => ({ ...f, bron: e.target.value }))} placeholder="bijv. Gemeentearchief Zundert" />
            </div>
          </div>
          <div className="form-group">
            <label>URL (link naar media)</label>
            <input className="form-control" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Thumbnail-URL (voorbeeldafbeelding)</label>
            <input className="form-control" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Beschrijving</label>
            <textarea className="form-control" rows={3} value={form.beschrijving} onChange={e => setForm(f => ({ ...f, beschrijving: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Opslaan</button>
            {editing && <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(null); setForm({ titel: '', type: 'foto', beschrijving: '', url: '', embed_url: '', thumbnail_url: '', jaar: '', bron: '' }); }}>Annuleren</button>}
          </div>
        </form>
      </div>
      <table className="admin-table">
        <thead><tr><th>Titel</th><th>Type</th><th>Jaar</th><th>Acties</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.titel}</td>
              <td><span className={`badge badge-${item.type}`}>{item.type}</span></td>
              <td>{item.jaar || '—'}</td>
              <td><div className="admin-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => bewerk(item)}>Bewerken</button>
                <button className="btn btn-danger btn-sm" onClick={() => verwijder(item.id)}>Verwijderen</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GastboekTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const laad = () => api.gastboek.alle().then(setItems).finally(() => setLoading(false));
  useEffect(() => { laad(); }, []);

  async function keur(id) {
    await api.gastboek.goedkeuren(id); laad();
  }
  async function verwijder(id) {
    if (!confirm('Verwijderen?')) return;
    await api.gastboek.verwijder(id); laad();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Gastboek modereren</h2>
      <p style={{ color: 'var(--text-mid)', marginBottom: '1.5rem' }}>
        Berichten wachten op goedkeuring voordat ze zichtbaar zijn voor bezoekers.
      </p>
      {items.length === 0 ? <p>Geen berichten.</p> : (
        <table className="admin-table">
          <thead><tr><th>Naam</th><th>Woonplaats</th><th>Bericht</th><th>Datum</th><th>Status</th><th>Acties</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.naam}</td>
                <td>{item.woonplaats || '—'}</td>
                <td style={{ maxWidth: '280px' }}><span style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{item.bericht}</span></td>
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{new Date(item.created_at).toLocaleDateString('nl-NL')}</td>
                <td>{item.goedgekeurd ? '✅ Goedgekeurd' : '⏳ Wacht'}</td>
                <td><div className="admin-actions">
                  {!item.goedgekeurd && <button className="btn btn-success btn-sm" onClick={() => keur(item.id)}>Goedkeuren</button>}
                  <button className="btn btn-danger btn-sm" onClick={() => verwijder(item.id)}>Verwijderen</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function LocatiesTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ naam: '', beschrijving: '', lat: '', lng: '', categorie: 'locatie', foto_url: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const laad = () => api.locaties.all().then(setItems);
  useEffect(() => { laad(); }, []);

  async function sla(e) {
    e.preventDefault();
    try {
      const data = { ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) };
      if (editing) await api.locaties.update(editing, data);
      else await api.locaties.create(data);
      setMsg('Opgeslagen!'); setEditing(null);
      setForm({ naam: '', beschrijving: '', lat: '', lng: '', categorie: 'locatie', foto_url: '' });
      laad();
    } catch (err) { setMsg('Fout: ' + err.message); }
  }

  async function verwijder(id) {
    if (!confirm('Verwijderen?')) return;
    await api.locaties.verwijder(id); laad();
  }

  function bewerk(item) {
    setEditing(item.id);
    setForm({ naam: item.naam, beschrijving: item.beschrijving || '', lat: item.lat.toString(), lng: item.lng.toString(), categorie: item.categorie, foto_url: item.foto_url || '' });
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <h2>Kaartlocaties beheren</h2>
      <div className="admin-form">
        <h3>{editing ? 'Bewerk locatie' : 'Nieuwe locatie'}</h3>
        {msg && <div className={`alert ${msg.startsWith('Fout') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}
        <form onSubmit={sla}>
          <div className="form-row">
            <div className="form-group">
              <label>Naam *</label>
              <input className="form-control" value={form.naam} onChange={e => setForm(f => ({ ...f, naam: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Categorie</label>
              <select className="form-control" value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
                {['locatie','drama','monument','kerk','gebouw','verzet'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Breedtegraad (lat) *</label>
              <input type="number" step="0.0001" className="form-control" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} placeholder="bijv. 51.5103" required />
            </div>
            <div className="form-group">
              <label>Lengtegraad (lng) *</label>
              <input type="number" step="0.0001" className="form-control" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} placeholder="bijv. 4.7011" required />
            </div>
          </div>
          <div className="form-group">
            <label>Beschrijving</label>
            <textarea className="form-control" rows={3} value={form.beschrijving} onChange={e => setForm(f => ({ ...f, beschrijving: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Opslaan</button>
            {editing && <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(null); setForm({ naam: '', beschrijving: '', lat: '', lng: '', categorie: 'locatie', foto_url: '' }); }}>Annuleren</button>}
          </div>
        </form>
      </div>
      <table className="admin-table">
        <thead><tr><th>Naam</th><th>Categorie</th><th>Coördinaten</th><th>Acties</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.naam}</td>
              <td><span className={`badge badge-${item.categorie}`}>{item.categorie}</span></td>
              <td style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</td>
              <td><div className="admin-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => bewerk(item)}>Bewerken</button>
                <button className="btn btn-danger btn-sm" onClick={() => verwijder(item.id)}>Verwijderen</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleTab({ title, apiObj, velden, categorieen = [], typeLabel = 'type' }) {
  const [items, setItems] = useState([]);
  const leegForm = Object.fromEntries(velden.map(v => [v.name, '']));
  const [form, setForm] = useState(leegForm);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const laad = () => apiObj.all().then(setItems);
  useEffect(() => { laad(); }, []);

  async function sla(e) {
    e.preventDefault();
    try {
      if (editing) await apiObj.update(editing, form);
      else await apiObj.create(form);
      setMsg('Opgeslagen!'); setEditing(null); setForm(leegForm); laad();
    } catch (err) { setMsg('Fout: ' + err.message); }
  }

  async function verwijder(id) {
    if (!confirm('Verwijderen?')) return;
    await apiObj.verwijder(id); laad();
  }

  function bewerk(item) {
    setEditing(item.id);
    setForm(Object.fromEntries(velden.map(v => [v.name, item[v.name] ?? ''])));
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <h2>{title}</h2>
      <div className="admin-form">
        <h3>{editing ? 'Bewerken' : 'Nieuw item'}</h3>
        {msg && <div className={`alert ${msg.startsWith('Fout') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}
        <form onSubmit={sla}>
          {velden.map(v => (
            <div key={v.name} className="form-group">
              <label>{v.label}{v.required ? ' *' : ''}</label>
              {v.type === 'textarea' ? (
                <textarea className="form-control" rows={v.rows || 3} value={form[v.name]} onChange={e => setForm(f => ({ ...f, [v.name]: e.target.value }))} required={v.required} placeholder={v.placeholder} />
              ) : v.type === 'select' ? (
                <select className="form-control" value={form[v.name]} onChange={e => setForm(f => ({ ...f, [v.name]: e.target.value }))}>
                  {v.opties.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : v.type === 'checkbox' ? (
                <input type="checkbox" checked={!!form[v.name]} onChange={e => setForm(f => ({ ...f, [v.name]: e.target.checked ? 1 : 0 }))} style={{ width: 'auto', marginLeft: '0' }} />
              ) : (
                <input type={v.type || 'text'} className="form-control" value={form[v.name]} onChange={e => setForm(f => ({ ...f, [v.name]: e.target.value }))} required={v.required} placeholder={v.placeholder} />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">Opslaan</button>
            {editing && <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(null); setForm(leegForm); }}>Annuleren</button>}
          </div>
        </form>
      </div>
      <table className="admin-table">
        <thead><tr><th>Titel</th><th>Type/Datum</th><th>Acties</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.titel}</td>
              <td>{item[typeLabel] || item.datum || item.type || '—'}</td>
              <td><div className="admin-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => bewerk(item)}>Bewerken</button>
                <button className="btn btn-danger btn-sm" onClick={() => verwijder(item.id)}>Verwijderen</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tabs = [
  { id: 'tijdlijn', label: '📅 Tijdlijn' },
  { id: 'verhalen', label: '📖 Verhalen' },
  { id: 'archief', label: '🗄️ Archief' },
  { id: 'locaties', label: '🗺️ Locaties' },
  { id: 'gastboek', label: '✍️ Gastboek' },
  { id: 'publicaties', label: '📚 Publicaties' },
  { id: 'herdenkingen', label: '🕯️ Herdenkingen' },
  { id: 'onderwijs', label: '🏫 Onderwijs' },
];

export default function Beheer() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('vloeiweide_token'));
  const [activeTab, setActiveTab] = useState('tijdlijn');

  function uitloggen() {
    localStorage.removeItem('vloeiweide_token');
    setLoggedIn(false);
  }

  if (!loggedIn) return (
    <>
      <div className="page-header"><div className="container"><h1>Beheerpaneel</h1><div className="gold-line" /><p>Log in om content te beheren.</p></div></div>
      <section className="section"><div className="container"><LoginForm onLogin={() => setLoggedIn(true)} /></div></section>
    </>
  );

  return (
    <>
      <div className="page-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div><h1>Beheerpaneel</h1><div className="gold-line" /><p>Beheer de inhoud van het Vloeiweide platform.</p></div>
          <button className="btn btn-outline" onClick={uitloggen}>Uitloggen</button>
        </div>
      </div>
      <div className="admin-wrap">
        <div className="admin-sidebar">
          <div className="admin-sidebar-title">Secties</div>
          {tabs.map(t => (
            <button key={t.id} className={`admin-nav-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="admin-content">
          {activeTab === 'tijdlijn' && <EventsTab />}
          {activeTab === 'verhalen' && <VerhalenTab />}
          {activeTab === 'archief' && <ArchiefTab />}
          {activeTab === 'locaties' && <LocatiesTab />}
          {activeTab === 'gastboek' && <GastboekTab />}
          {activeTab === 'publicaties' && <SimpleTab
            title="Publicaties beheren"
            apiObj={api.publicaties}
            typeLabel="type"
            velden={[
              { name: 'titel', label: 'Titel', required: true },
              { name: 'type', label: 'Type', type: 'select', opties: ['boek','toneelstuk','film','artikel'] },
              { name: 'auteur', label: 'Auteur' },
              { name: 'jaar', label: 'Jaar', type: 'number', placeholder: '1985' },
              { name: 'beschrijving', label: 'Beschrijving', type: 'textarea', rows: 3 },
              { name: 'isbn', label: 'ISBN' },
              { name: 'cover_url', label: 'Cover URL', placeholder: 'https://...' },
              { name: 'koop_url', label: 'Link URL', placeholder: 'https://...' },
            ]}
          />}
          {activeTab === 'herdenkingen' && <SimpleTab
            title="Herdenkingen beheren"
            apiObj={api.herdenkingen}
            typeLabel="datum"
            velden={[
              { name: 'titel', label: 'Titel', required: true },
              { name: 'datum', label: 'Datum', required: true, placeholder: 'bijv. 28 april of 2025-04-28' },
              { name: 'locatie', label: 'Locatie', placeholder: 'De Vloeiweide, Rijsbergen' },
              { name: 'beschrijving', label: 'Beschrijving', type: 'textarea', rows: 3 },
              { name: 'jaarlijks', label: 'Jaarlijks terugkerend', type: 'checkbox' },
            ]}
          />}
          {activeTab === 'onderwijs' && <SimpleTab
            title="Onderwijsmateriaal beheren"
            apiObj={api.onderwijs}
            typeLabel="type"
            velden={[
              { name: 'titel', label: 'Titel', required: true },
              { name: 'type', label: 'Type', type: 'select', opties: ['lesmateriaal','activiteit','project'] },
              { name: 'doelgroep', label: 'Doelgroep', placeholder: 'bijv. Groep 7-8 basisschool' },
              { name: 'beschrijving', label: 'Beschrijving', type: 'textarea', rows: 4, required: true },
              { name: 'download_url', label: 'Download/Link URL', placeholder: 'https://...' },
            ]}
          />}
        </div>
      </div>
    </>
  );
}

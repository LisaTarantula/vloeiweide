const BASE = '/api';

function token() {
  return localStorage.getItem('vloeiweide_token');
}

function headers(withAuth = false) {
  const h = { 'Content-Type': 'application/json' };
  if (withAuth && token()) h['Authorization'] = `Bearer ${token()}`;
  return h;
}

async function req(method, path, body, auth = false) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(auth),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Fout ${res.status}`);
  return data;
}

export const api = {
  auth: {
    login: (wachtwoord) => req('POST', '/auth/login', { wachtwoord }),
  },
  events: {
    all: () => req('GET', '/events'),
    create: (d) => req('POST', '/events', d, true),
    update: (id, d) => req('PUT', `/events/${id}`, d, true),
    verwijder: (id) => req('DELETE', `/events/${id}`, undefined, true),
  },
  verhalen: {
    all: () => req('GET', '/verhalen'),
    alle: () => req('GET', '/verhalen/alle', undefined, true),
    get: (id) => req('GET', `/verhalen/${id}`),
    create: (d) => req('POST', '/verhalen', d, true),
    update: (id, d) => req('PUT', `/verhalen/${id}`, d, true),
    verwijder: (id) => req('DELETE', `/verhalen/${id}`, undefined, true),
  },
  archief: {
    all: () => req('GET', '/archief'),
    create: (d) => req('POST', '/archief', d, true),
    update: (id, d) => req('PUT', `/archief/${id}`, d, true),
    verwijder: (id) => req('DELETE', `/archief/${id}`, undefined, true),
  },
  locaties: {
    all: () => req('GET', '/locaties'),
    create: (d) => req('POST', '/locaties', d, true),
    update: (id, d) => req('PUT', `/locaties/${id}`, d, true),
    verwijder: (id) => req('DELETE', `/locaties/${id}`, undefined, true),
  },
  gastboek: {
    all: () => req('GET', '/gastboek'),
    alle: () => req('GET', '/gastboek/alle', undefined, true),
    stuur: (d) => req('POST', '/gastboek', d),
    goedkeuren: (id) => req('PUT', `/gastboek/${id}/goedkeuren`, {}, true),
    verwijder: (id) => req('DELETE', `/gastboek/${id}`, undefined, true),
  },
  publicaties: {
    all: () => req('GET', '/publicaties'),
    create: (d) => req('POST', '/publicaties', d, true),
    update: (id, d) => req('PUT', `/publicaties/${id}`, d, true),
    verwijder: (id) => req('DELETE', `/publicaties/${id}`, undefined, true),
  },
  herdenkingen: {
    all: () => req('GET', '/herdenkingen'),
    create: (d) => req('POST', '/herdenkingen', d, true),
    update: (id, d) => req('PUT', `/herdenkingen/${id}`, d, true),
    verwijder: (id) => req('DELETE', `/herdenkingen/${id}`, undefined, true),
  },
  onderwijs: {
    all: () => req('GET', '/onderwijs'),
    create: (d) => req('POST', '/onderwijs', d, true),
    update: (id, d) => req('PUT', `/onderwijs/${id}`, d, true),
    verwijder: (id) => req('DELETE', `/onderwijs/${id}`, undefined, true),
  },
};

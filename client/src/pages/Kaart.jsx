import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

// Fix leaflet icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const catKleuren = {
  drama: '#8b1a1a',
  monument: '#1a5a5a',
  kerk: '#5a1a6b',
  gebouw: '#444',
  verzet: '#1a3a6b',
  locatie: '#666',
};

function gekleurdeMarker(kleur) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${kleur || '#666'};border:3px solid white;border-radius:50%;box-shadow:0 0 0 2px ${kleur || '#666'},0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const legenda = [
  { label: 'Drama/gebeurtenis', kleur: catKleuren.drama },
  { label: 'Monument', kleur: catKleuren.monument },
  { label: 'Kerk', kleur: catKleuren.kerk },
  { label: 'Gebouw', kleur: catKleuren.gebouw },
  { label: 'Verzet', kleur: catKleuren.verzet },
];

export default function Kaart() {
  const [locaties, setLocaties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.locaties.all().then(setLocaties).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Interactieve Kaart</h1>
          <div className="gold-line" />
          <p>Bekijk de historische locaties in en rondom Rijsbergen. Klik op een marker voor meer informatie.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? <LoadingSpinner /> : (
            <div className="map-wrapper" style={{ position: 'relative' }}>
              <MapContainer
                center={[51.5445, 4.7046]}
                zoom={15}
                style={{ height: '540px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> bijdragers'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locaties.map(loc => (
                  <Marker
                    key={loc.id}
                    position={[loc.lat, loc.lng]}
                    icon={gekleurdeMarker(catKleuren[loc.categorie] || catKleuren.locatie)}
                  >
                    <Popup>
                      <div style={{ minWidth: '180px' }}>
                        <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '0.4rem' }}>{loc.naam}</strong>
                        <span className={`badge badge-${loc.categorie}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{loc.categorie}</span>
                        {loc.beschrijving && <p style={{ fontSize: '0.85rem', margin: '0.5rem 0 0', color: '#444', lineHeight: '1.5' }}>{loc.beschrijving}</p>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              <div className="map-legend">
                <h4>Legenda</h4>
                {legenda.map(l => (
                  <div key={l.label} className="legend-item">
                    <div className="legend-dot" style={{ background: l.kleur }} />
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {locaties.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ marginBottom: '1.25rem', fontSize: '1.4rem' }}>Alle locaties</h2>
              <div className="grid-3">
                {locaties.map(loc => (
                  <div key={loc.id} className="card">
                    <div className="card-body">
                      <span className={`badge badge-${loc.categorie}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{loc.categorie}</span>
                      <h3 className="card-title">{loc.naam}</h3>
                      {loc.beschrijving && <p className="card-text">{loc.beschrijving}</p>}
                      <p className="card-meta">📍 {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

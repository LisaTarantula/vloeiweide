import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>Oorlogsdrama op de Vloeiweide</h3>
            <p>
              Een historisch platform over het oorlogsdrama dat plaatsvond op de Vloeiweide
              in Rijsbergen tijdens de Tweede Wereldoorlog. Wij bewaren en delen de herinneringen
              voor de huidige en toekomstige generaties.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Rijsbergen, Noord-Brabant</strong>
            </p>
          </div>
          <div>
            <h3>Navigatie</h3>
            <Link to="/tijdlijn">Tijdlijn</Link>
            <Link to="/verhalen">Verhalen & interviews</Link>
            <Link to="/archief">Archief</Link>
            <Link to="/kaart">Interactieve kaart</Link>
            <Link to="/publicaties">Boeken & publicaties</Link>
            <Link to="/herdenking">Herdenking</Link>
            <Link to="/onderwijs">Onderwijs</Link>
            <Link to="/gastboek">Gastboek</Link>
          </div>
          <div>
            <h3>Over dit platform</h3>
            <p style={{ marginBottom: '1rem' }}>
              Dit platform is opgericht om de herinnering aan het oorlogsdrama op de Vloeiweide
              levend te houden en toegankelijk te maken voor iedereen.
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              Heeft u materiaal, verhalen of foto's om bij te dragen?
              Neem contact op via het gastboek.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Vloeiweide Platform — Rijsbergen</span>
          <span>Nooit vergeten — Altijd herdenken</span>
        </div>
      </div>
    </footer>
  );
}

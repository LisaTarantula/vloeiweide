import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tijdlijn from './pages/Tijdlijn';
import Verhalen from './pages/Verhalen';
import VerhaalDetail from './pages/VerhaalDetail';
import Archief from './pages/Archief';
import Kaart from './pages/Kaart';
import Publicaties from './pages/Publicaties';
import Herdenking from './pages/Herdenking';
import Onderwijs from './pages/Onderwijs';
import Gastboek from './pages/Gastboek';
import Beheer from './pages/Beheer';
import NietGevonden from './pages/NietGevonden';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tijdlijn" element={<Tijdlijn />} />
          <Route path="/verhalen" element={<Verhalen />} />
          <Route path="/verhalen/:id" element={<VerhaalDetail />} />
          <Route path="/archief" element={<Archief />} />
          <Route path="/kaart" element={<Kaart />} />
          <Route path="/publicaties" element={<Publicaties />} />
          <Route path="/herdenking" element={<Herdenking />} />
          <Route path="/onderwijs" element={<Onderwijs />} />
          <Route path="/gastboek" element={<Gastboek />} />
          <Route path="/beheer" element={<Beheer />} />
          <Route path="*" element={<NietGevonden />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

# Oorlogsdrama op de Vloeiweide — Platform

Historisch platform over het oorlogsdrama op de Vloeiweide in Rijsbergen (WOII).

## Technische opbouw

| Laag | Technologie |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Kaart | React Leaflet + OpenStreetMap |
| Auth | JWT (beheerder) |

---

## Installatie & opstarten

### 1. Vereisten
- **Node.js 18+** — download via https://nodejs.org/
- Git (optioneel)

### 2. Afhankelijkheden installeren

Open een terminal in de map `VLOEIWEIDE` en voer uit:

```bash
npm run setup
```

Dit installeert alle pakketten voor de root, server en client in één keer.

### 3. Starten (ontwikkelomgeving)

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

---

## Beheeromgeving

Ga naar **http://localhost:5173/beheer** en log in.

**Standaard wachtwoord**: `admin123`

Het wachtwoord wijzigen: pas `server/.env` aan:
```
ADMIN_PASSWORD=UwEigenWachtwoord
JWT_SECRET=EenLangWillekeurigeString
```

---

## Functies

| Functie | Beschrijving |
|---|---|
| **Tijdlijn** | Chronologisch overzicht van gebeurtenissen, filterbaar op categorie |
| **Verhalen** | Ooggetuigenverslagen en nabestaanden-interviews |
| **Archief** | Foto's, video's (incl. YouTube), audio, documenten |
| **Kaart** | Interactieve kaart met historische locaties (OpenStreetMap) |
| **Publicaties** | Boeken, toneelstukken, films en artikelen |
| **Herdenking** | Jaarlijkse herdenkingen en kalender |
| **Onderwijs** | Lesmateriaal, excursies en projecten voor scholen |
| **Gastboek** | Bezoekers kunnen berichten achterlaten (na goedkeuring) |
| **Beheer** | Volledig CMS voor alle content |

---

## Media embedden

### YouTube-video's
Plak de gewone YouTube-URL in het URL-veld van een archiefitem:
```
https://www.youtube.com/watch?v=VIDEO_ID
```
Het platform herkent dit automatisch en toont een ingebedde speler.

### Andere media
- **Foto's**: directe URL naar een afbeelding (jpg, png, webp)
- **Audio**: directe URL naar een audiobestand (mp3, ogg, wav)
- **Documenten**: URL naar een PDF of ander document
- **Externe links**: elke URL die als link getoond wordt

---

## Database

De SQLite-database staat in `server/data/vloeiweide.db`.

Bij de eerste start wordt deze automatisch aangemaakt met voorbeelddata. U kunt de database bekijken en bewerken met tools zoals [DB Browser for SQLite](https://sqlitebrowser.org/).

### Back-up maken
Kopieer het bestand `server/data/vloeiweide.db` naar een veilige locatie.

---

## Productie (optioneel)

### Frontend bouwen
```bash
npm run build
```
De bestanden komen in `client/dist/`. Serveer deze met een webserver (bijv. Nginx, Apache).

### Server draaien
```bash
cd server
npm start
```

Stel de `PORT` in `server/.env` in op de gewenste poort.

---

## Bestandsstructuur

```
VLOEIWEIDE/
├── package.json          # Root scripts
├── server/
│   ├── server.js         # Express server
│   ├── database.js       # SQLite setup + voorbeelddata
│   ├── .env              # Configuratie (wachtwoord, poort)
│   ├── middleware/
│   │   └── auth.js       # JWT authenticatie
│   ├── routes/           # API endpoints
│   └── data/             # SQLite database (aangemaakt bij start)
└── client/
    ├── src/
    │   ├── App.jsx        # Router
    │   ├── api.js         # API client
    │   ├── index.css      # Stijlen
    │   ├── pages/         # Alle pagina's
    │   └── components/    # Herbruikbare componenten
    └── vite.config.js
```

---

## Toekomstige uitbreidingen

- **Meer media**: voeg video's, audio-interviews en documenten toe via het archief
- **Meer verhalen**: ooggetuigenverslagen en interviews toevoegen
- **Nieuwe locaties**: historische plekken toevoegen aan de kaart
- **Meertaligheid**: toevoeging van Frans of Engels voor Belgische bezoekers
- **PostgreSQL**: vervang SQLite door PostgreSQL voor grotere installaties
- **Afbeelding-upload**: directe upload in plaats van URL-invoer

---

*Nooit vergeten — Altijd herdenken*

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      datum TEXT NOT NULL,
      titel TEXT NOT NULL,
      beschrijving TEXT NOT NULL,
      categorie TEXT DEFAULT 'algemeen',
      foto_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS verhalen (
      id SERIAL PRIMARY KEY,
      titel TEXT NOT NULL,
      auteur TEXT NOT NULL,
      inhoud TEXT NOT NULL,
      samenvatting TEXT,
      foto_url TEXT,
      categorie TEXT DEFAULT 'verhaal',
      gepubliceerd SMALLINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS archief (
      id SERIAL PRIMARY KEY,
      titel TEXT NOT NULL,
      type TEXT NOT NULL,
      beschrijving TEXT,
      url TEXT,
      embed_url TEXT,
      thumbnail_url TEXT,
      jaar INTEGER,
      bron TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS locaties (
      id SERIAL PRIMARY KEY,
      naam TEXT NOT NULL,
      beschrijving TEXT,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      categorie TEXT DEFAULT 'locatie',
      foto_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS gastboek (
      id SERIAL PRIMARY KEY,
      naam TEXT NOT NULL,
      woonplaats TEXT,
      bericht TEXT NOT NULL,
      email TEXT,
      goedgekeurd SMALLINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS publicaties (
      id SERIAL PRIMARY KEY,
      titel TEXT NOT NULL,
      type TEXT NOT NULL,
      auteur TEXT,
      beschrijving TEXT,
      jaar INTEGER,
      isbn TEXT,
      cover_url TEXT,
      koop_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS herdenkingen (
      id SERIAL PRIMARY KEY,
      titel TEXT NOT NULL,
      datum TEXT NOT NULL,
      beschrijving TEXT,
      locatie TEXT,
      foto_url TEXT,
      jaarlijks SMALLINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS onderwijs (
      id SERIAL PRIMARY KEY,
      titel TEXT NOT NULL,
      type TEXT NOT NULL,
      beschrijving TEXT NOT NULL,
      doelgroep TEXT,
      download_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await seed();
  console.log('Database gereed.');
}

async function seed() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM events');
  if (rows[0].count > 0) return;

  for (const [datum, titel, beschrijving, categorie] of [
    ['1940-05-10', 'Inval van Duitsland in Nederland', 'Op 10 mei 1940 viel Duitsland Nederland binnen. Na vijf dagen strijd capituleerde het Nederlandse leger. De bezetting begon - ook voor de inwoners van Rijsbergen en omgeving.', 'bezetting'],
    ['1940-05-15', 'Capitulatie Nederland', 'Het Nederlandse leger capituleerde. Voor de bevolking van Rijsbergen begon een lange periode van bezetting en onzekerheid.', 'bezetting'],
    ['1941-01-01', 'Vorming van de eerste verzetsgroepen', 'In het geheim werden de eerste georganiseerde verzetsgroepen actief in de regio rond Rijsbergen. Mannen en vrouwen riskeerden hun leven om informatie te verzamelen en onderduikers te helpen.', 'verzet'],
    ['1942-06-01', 'Verplichte arbeidsdienst ingevoerd', 'De Duitsers voerden verplichte arbeid in voor jonge Nederlanders. Dit dreef velen de illegaliteit in en versterkte het verzet in de regio.', 'bezetting'],
    ['1944-09-04', 'Bevrijding van Rijsbergen', 'Op 4 september 1944 werd Rijsbergen bevrijd door geallieerde troepen. De bevrijding bracht grote vreugde, maar ook onzekerheid - de oorlog was nog niet voorbij in alle delen van Nederland.', 'bevrijding'],
    ['1944-10-01', 'Reorganisatie van het verzet', 'Na de bevrijding reorganiseerden de verzetsgroepen zich om de geallieerden te ondersteunen bij de bevrijding van de rest van Nederland.', 'verzet'],
    ['1945-03-15', 'Arrestaties door de bezetter', 'Duitse troepen en NSB-ers arresteerden meerdere verzetsmensen in de regio. De gevangenen werden overgebracht voor verhoor.', 'arrestaties'],
    ['1945-04-28', 'Het drama op de Vloeiweide', 'Op de Vloeiweide, een weiland bij Rijsbergen, werden gevangenen gefusilleerd door de Duitse bezetter. Dit drama liet een onuitwisbaar litteken na in de gemeenschap van Rijsbergen.', 'drama'],
    ['1945-05-05', 'Bevrijding van heel Nederland', 'Op 5 mei 1945 tekenden de Duitsers de capitulatie in Nederland. De bevrijding bracht grote vreugde, maar ook diepe rouw om de gevallenen - waaronder de slachtoffers van de Vloeiweide.', 'bevrijding'],
    ['1945-05-10', 'Eerste herdenking op de Vloeiweide', 'Nabestaanden en inwoners van Rijsbergen kwamen samen op de Vloeiweide voor de eerste herdenkingsplechtigheid.', 'herdenking'],
    ['1950-04-28', 'Onthulling herdenkingsmonument', 'Een permanent monument werd onthuld op de Vloeiweide, ter nagedachtenis aan alle slachtoffers van het oorlogsdrama.', 'monument'],
    ['1985-01-01', 'Publicatie eerste historisch boek', 'Het eerste uitgebreide historische boek over het oorlogsdrama op de Vloeiweide werd gepubliceerd, gebaseerd op archiefonderzoek en ooggetuigenverslagen.', 'publicatie'],
  ]) {
    await pool.query(
      'INSERT INTO events (datum, titel, beschrijving, categorie) VALUES ($1,$2,$3,$4)',
      [datum, titel, beschrijving, categorie]
    );
  }

  for (const [titel, auteur, inhoud, samenvatting, categorie] of [
    [
      'De nacht die ik nooit vergat',
      'Jan de Vries (ooggetuige, toenmalig 10 jaar)',
      `Het was een koude aprilnacht in 1945. Als kind van tien jaar verstopte ik me achter de gordijnen van ons huis aan de rand van Rijsbergen. Ik hoorde het - het geluid van soldatenlaarzen op de straat, gevolgd door een stilte die erger was dan elk geluid ooit had kunnen zijn.

Mijn moeder had mijn schouder vastgepakt en fluisterde dat ik stil moest zijn. Haar handen trilden. In haar ogen zag ik iets wat ik nog nooit eerder had gezien: pure angst. Later, pas vele jaren later, begreep ik waarom.

De volgende ochtend, toen de zon opkwam boven de velden van Rijsbergen, hoorden we het nieuws. Op de Vloeiweide... De mensen spraken er niet over in volzinnen. Alleen maar in halve woorden, blikken, plotselinge tranen bij een buurvrouw die net haar boodschappen wilde gaan doen.

Mijn vader zei niets, maar ik zag hoe hij zijn hoofd boog. Hij kende sommigen van hen.

Jaren later ben ik teruggekeerd naar die plek. Het monument staat er nu, stil en waardig in het gras. Ik leg er altijd bloemen neer - niet alleen voor de slachtoffers, maar ook voor de herinneringen die ik meedraag en die nooit zullen vervagen.`,
      'Een ooggetuigenverslag van een toenmalig tienjarig kind over de dramatische nacht van 28 april 1945.',
      'ooggetuige'
    ],
    [
      'Mijn vader was er bij',
      'Maria Verstappen',
      `Mijn vader, Hendrik Verstappen, was actief lid van een verzetsgroep die opereerde vanuit de omgeving van Rijsbergen. Hij heeft mij weinig verteld over zijn ervaringen - dat deden de meeste mensen van zijn generatie niet - maar wat hij deelde, heeft mij diep geraakt.

"We wisten dat er gevaar was," zei hij eens, op een avond in 1972. "We wisten dat er verraders waren. Maar wat kon je doen? Je moest doorgaan."

Enkele van zijn kameraden werden gearresteerd in maart 1945. Mijn vader ontsnapte aan de arrestaties omdat hij die dag ziek was geweest en thuis had moeten blijven. "Dat heeft me mijn leven gered," zei hij, "maar het heeft me ook de rest van mijn leven gekweld."

Hij overleed in 1989. Op zijn grafsteen staat: 'Een man die zijn plicht deed.'`,
      'Dochter van een voormalig verzetsstrijder vertelt over haar vader en zijn herinneringen.',
      'nabestaande'
    ],
    [
      'De Vloeiweide vandaag: een plek van herinnering',
      'Redactie Vloeiweide Platform',
      `De Vloeiweide is vandaag de dag een rustige plek aan de rand van Rijsbergen. Het gras wuift in de wind, vogels zingen in de bomen die de weide omzomen. Voor wie de geschiedenis niet kent, is het gewoon een mooi stuk groen.

Maar voor wie weet wat hier is gebeurd, is de Vloeiweide geladen met herinnering.

Het monument, opgericht in 1950, staat er nog steeds. Elk jaar op 28 april verzamelen inwoners van Rijsbergen en omgeving zich hier. Scholen sturen hun leerlingen om te leren wat er eens is voorgevallen. Nabestaanden leggen bloemen neer bij de namen van hen die hier zijn gevallen.

Dit platform is opgericht om die herinnering levend te houden. Want wie de geschiedenis vergeet, is gedoemd haar te herhalen.`,
      'Een beschrijving van de Vloeiweide als herdenkingsplek vandaag.',
      'informatie'
    ],
  ]) {
    await pool.query(
      'INSERT INTO verhalen (titel, auteur, inhoud, samenvatting, categorie) VALUES ($1,$2,$3,$4,$5)',
      [titel, auteur, inhoud, samenvatting, categorie]
    );
  }

  for (const [naam, beschrijving, lat, lng, categorie] of [
    ['De Vloeiweide', 'De plek waar het oorlogsdrama van 28 april 1945 plaatsvond. Nu een herdenkingsplek met een permanent monument.', 51.5075, 4.7028, 'drama'],
    ['Herdenkingsmonument', 'Het monument opgericht in 1950 ter nagedachtenis aan de slachtoffers van het drama op de Vloeiweide.', 51.5078, 4.7030, 'monument'],
    ['Kerk van Rijsbergen (H. Lambertus)', 'De historische parochiekerk van Rijsbergen, een centraal punt in de gemeenschap tijdens de bezettingsjaren.', 51.5103, 4.7011, 'kerk'],
    ['Gemeentehuis Rijsbergen', 'Het voormalige gemeentehuis van Rijsbergen, nu onderdeel van de gemeente Zundert.', 51.5098, 4.6995, 'gebouw'],
    ['Locatie verzetsactiviteiten', 'Een van de vermoedelijke locaties waar de lokale verzetsgroep bijeenkwam.', 51.5120, 4.7050, 'verzet'],
  ]) {
    await pool.query(
      'INSERT INTO locaties (naam, beschrijving, lat, lng, categorie) VALUES ($1,$2,$3,$4,$5)',
      [naam, beschrijving, lat, lng, categorie]
    );
  }

  for (const [titel, type, auteur, beschrijving, jaar] of [
    ['Oorlogsdrama op de Vloeiweide', 'boek', 'Diverse auteurs', 'Een uitgebreid historisch overzicht van de gebeurtenissen op en rond de Vloeiweide tijdens de Tweede Wereldoorlog.', 1985],
    ['Stille Getuigen', 'toneelstuk', 'Toneel Rijsbergen', 'Een toneelstuk gebaseerd op de ware gebeurtenissen van april 1945 op de Vloeiweide.', 2010],
    ['Rijsbergen in de oorlog', 'boek', 'P. Jansen', 'Een brede historische beschrijving van het leven in Rijsbergen tijdens de bezettingsjaren.', 1978],
    ['Vrij maar niet vergeten', 'film', 'Documentairemakers Rijsbergen', 'Een documentaire over de bevrijding van Rijsbergen en het drama op de Vloeiweide.', 2005],
    ['Namen op de steen', 'boek', 'A. van der Berg', 'Een biografisch overzicht van de slachtoffers van het monument op de Vloeiweide.', 2000],
  ]) {
    await pool.query(
      'INSERT INTO publicaties (titel, type, auteur, beschrijving, jaar) VALUES ($1,$2,$3,$4,$5)',
      [titel, type, auteur, beschrijving, jaar]
    );
  }

  for (const [titel, datum, beschrijving, locatie, jaarlijks] of [
    ['Jaarlijkse herdenking Vloeiweide', '28 april', 'De jaarlijkse herdenkingsplechtigheid op de Vloeiweide. Bloemlegging, toespraken en een moment van stilte.', 'De Vloeiweide, Rijsbergen', 1],
    ['Nationale Dodenherdenking', '4 mei', 'De nationale herdenking waarbij ook stilgestaan wordt bij de slachtoffers van de Vloeiweide. Om 20:00 uur.', 'Monument Vloeiweide, Rijsbergen', 1],
    ['Bevrijdingsdag', '5 mei', 'Viering van de bevrijding met aandacht voor de lokale geschiedenis en de gevallenen.', 'Rijsbergen centrum', 1],
    ['Scholierenherdenking', 'April', 'Speciale herdenkingsbijeenkomst voor scholieren, georganiseerd met lokale scholen.', 'De Vloeiweide, Rijsbergen', 1],
  ]) {
    await pool.query(
      'INSERT INTO herdenkingen (titel, datum, beschrijving, locatie, jaarlijks) VALUES ($1,$2,$3,$4,$5)',
      [titel, datum, beschrijving, locatie, jaarlijks]
    );
  }

  for (const [titel, type, beschrijving, doelgroep] of [
    ['Les: Wat is verzet?', 'lesmateriaal', 'Een volledig lespakket over het Nederlandse verzet tijdens de Tweede Wereldoorlog, met specifieke aandacht voor Rijsbergen en de Vloeiweide. Inclusief werkbladen en discussievragen.', 'Groep 7-8 basisschool'],
    ['Excursie naar de Vloeiweide', 'activiteit', 'Een begeleide excursie naar de Vloeiweide voor schoolklassen. Gids vertelt het verhaal van wat er hier is gebeurd. Bezoek aan het monument.', 'Basisschool groep 6-8, middelbare school'],
    ['Project: Oral History', 'project', 'Een meersemesterproject waarbij leerlingen interviews afnemen met (na)bestaanden en inwoners van Rijsbergen over de bezettingsjaren.', 'Middelbare school (klas 2-4)'],
    ['Lesfilm: Rijsbergen in de Tweede Wereldoorlog', 'lesmateriaal', 'Een educatieve film (25 minuten) over de bezettingstijd, het verzet en het drama op de Vloeiweide. Met begeleidend lesmateriaal.', 'Groep 6-8, middelbare school klas 1-3'],
    ['Werkblad: Wie waren de slachtoffers?', 'lesmateriaal', 'Een werkblad waarbij leerlingen onderzoek doen naar de achtergronden van de slachtoffers. Leert over bronnenonderzoek.', 'Middelbare school klas 1-3'],
  ]) {
    await pool.query(
      'INSERT INTO onderwijs (titel, type, beschrijving, doelgroep) VALUES ($1,$2,$3,$4)',
      [titel, type, beschrijving, doelgroep]
    );
  }

  console.log('Voorbeelddata geladen.');
}

module.exports = { pool, init };

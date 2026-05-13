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

  // --- TIJDLIJN: echte historische feiten ---
  for (const [datum, titel, beschrijving, categorie] of [
    [
      '1940-05-10',
      'Duitsland valt Nederland binnen',
      'Op 10 mei 1940 valt Duitsland Nederland binnen. Na vijf dagen strijd capituleert het Nederlandse leger op 15 mei 1940. De bezetting begint. Ook Rijsbergen en omgeving raken onder Duits bewind.',
      'bezetting'
    ],
    [
      '1944-01-01',
      'Ordedienst richt radiopost in op de Vloeiweide',
      'De illegale verzetsorganisatie Ordedienst (OD), district 16 Breda, richt een geheime radiopost in het boswachtershuis van de familie Neefs op het landgoed De Vloeiweide bij Rijsbergen. De post zendt in morse-code versleutelde berichten over Duitse troepenbewegingen naar de Geallieerden. Commandant is Paul Windhausen, kunstleraar aan het Onze-Lieve-Vrouwelyceum in Breda.',
      'verzet'
    ],
    [
      '1944-09-05',
      'Dolle Dinsdag — bevrijding lijkt nabij',
      'Op 5 september 1944 (Dolle Dinsdag) slaan NSB\'ers massaal op de vlucht in de verwachting dat de Geallieerden Nederland razendsnel zullen bevrijden. De bevrijding stagneerde echter na de mislukte operatie Market Garden. Rijsbergen en de Vloeiweide-radiopost blijven in gevaarlijk bezet gebied.',
      'bezetting'
    ],
    [
      '1944-10-04',
      'Duits overval op de radiopost — 9 doden',
      'In de vroege ochtend van 4 oktober 1944 voeren de Duitsers — na verkenning door Belgisch verrader Lodewijk de Coster — een overval uit op het boswachtershuis van de familie Neefs aan de Hellegatweg. Bij de schietpartij komen om het leven: radiopostleider Paul Windhausen (41), radio-operators Henk Touw (31), Johan Oberg (37) en Johannes de Vries (26), bewaker Marinus van den Boogaard (22). Het huis vat vlam. In de brand komen ook om het leven: Maria Neefs-Koijen (45), haar dochters Maria Elisabeth (18) en Maria Francisca (17), en haar zoontje Cornelis (4). De boswachter Ernest Neefs overleeft als enige volwassene. In totaal vallen er 9 doden op die dag.',
      'drama'
    ],
    [
      '1944-10-05',
      'Executies op de Schietheide — 8 verzetsmensen gefusilleerd',
      'Op 5 oktober 1944, minder dan 24 uur na de overval, worden acht gevangen genomen verzetsmensen door een Duits executiepeloton doodgeschoten op de Schietheide in het Mastbos bij Ginneken (Breda). Het betreft leden van de Ordedienst: Bakker, J.J. van den Boogaard, Brautigam, Van den Heuvel, Hofman, Nelissen, Visser en De Vries. Zij waren gearresteerd in de nasleep van de overval op de Vloeiweide.',
      'drama'
    ],
    [
      '1944-10-05',
      'Totaal: 17 doden in twee dagen',
      'Het oorlogsdrama op de Vloeiweide eist in totaal 17 slachtoffers: 5 verzetsmensen die op 4 oktober sneuvelden bij de overval, 4 burgerslachtoffers van het Neefs-gezin die omkwamen in de brand, en 8 verzetsmensen die op 5 oktober werden gefusilleerd op de Schietheide. Het is een van de zwaarste oorlogsdrama\'s in de geschiedenis van Rijsbergen.',
      'drama'
    ],
    [
      '1944-11-01',
      'Joris van den Bergh schrijft eerste verslag',
      'Al in november 1944 legt Joris van den Bergh de feiten van het drama schriftelijk vast in "De Post in de Vloeiweide", een van de vroegste en meest directe historische getuigenissen over de gebeurtenissen.',
      'publicatie'
    ],
    [
      '1994-10-08',
      'Monument op de Vloeiweide onthuld',
      'Precies 50 jaar na het drama, op 8 oktober 1994, wordt het herdenkingsmonument op de Vloeiweide onthuld. Het monument bestaat uit de bewaard gebleven fundering van het boswachtershuis van de familie Neefs, met een bakstenen gedenkmuur en een natuurstenen plaquette. Op de plaquette staat: "Deze grond waarop u staat is geheiligd door Nederlands bloed. Zij stierven voor u." Adres: Hellegatweg 6, Rijsbergen.',
      'monument'
    ],
    [
      '2004-01-01',
      'Boek "De geest van de Vloeiweide" verschijnt',
      'John van Ierland publiceert "De geest van de Vloeiweide" (2004), een uitgebreide historische reconstructie van het drama en zijn nasleep, gebaseerd op archiefonderzoek en gesprekken met nabestaanden.',
      'publicatie'
    ],
    [
      '2011-01-01',
      'Rinie Maas publiceert "Brabants oorlogsdrama"',
      'Rinie Maas brengt "Brabants oorlogsdrama" uit, een breed opgezet boek over het drama op de Vloeiweide in de bredere context van de Brabantse bevrijdingsstrijd in het najaar van 1944.',
      'publicatie'
    ],
    [
      '2024-10-06',
      'Herdenking 80 jaar Vloeiweidedrama',
      'Op zondag 6 oktober 2024 vindt de herdenking van het 80-jarig herdenkingsjaar plaats. Programma: 10:30 uur herdenkingsdienst in de Sint Bavokerk te Rijsbergen, gevolgd door een stille tocht om 12:00 uur van de hoek Hellegatweg/Sintelweg naar het monument. Aanwezig zijn onder meer burgemeester Joyce Vermue en de voorzitter van de Vloeiweide-stichting. Na afloop tentoonstelling van schilderijen van Paul Windhausen in \'t Buytenhuis.',
      'herdenking'
    ],
  ]) {
    await pool.query(
      'INSERT INTO events (datum,titel,beschrijving,categorie) VALUES ($1,$2,$3,$4)',
      [datum, titel, beschrijving, categorie]
    );
  }

  // --- VERHALEN: gebaseerd op echte feiten en personen ---
  for (const [titel, auteur, inhoud, samenvatting, categorie] of [
    [
      'Paul Windhausen: de kunstenaar die zijn leven gaf',
      'Redactie Vloeiweide Platform — op basis van historisch onderzoek',
      `Paul Windhausen werd geboren in 1903 en werkte als kunstleraar aan het Onze-Lieve-Vrouwelyceum in Breda. Hij was een man van cultuur, die zijn studenten de liefde voor schilderen en tekenen bijbracht. Maar achter die rustige beroepsfaçade schuilde een vastberaden verzetsstrijder.

Als commandant van de radiopost van de Ordedienst (district 16) op de Vloeiweide droeg Windhausen een enorme verantwoordelijkheid. Elke uitzending was een risico: de Duitsers peilde actief naar illegale radiozenders. Toch bleef hij doorzenden — versleutelde berichten in morsecode over de posities van Duitse troepen, bestemd voor de Geallieerden.

Op 4 oktober 1944 kwamen de Duitsers. Na verraad door een Belgische informant omsingelden ze het boswachtershuis van de familie Neefs aan de Hellegatweg. In de schietpartij die volgde, stierf Paul Windhausen op 41-jarige leeftijd.

Na de oorlog is een straat in Breda naar hem vernoemd. Zijn schilderijen werden in 2024 tentoongesteld in 't Buytenhuis te Rijsbergen, ter gelegenheid van de 80e herdenking van het drama.

Paul Windhausen was niet alleen een verzetsstrijder — hij was ook een mens die geloofde dat vrijheid en cultuur onlosmakelijk met elkaar verbonden zijn.`,
      'Paul Windhausen (1903-1944) was kunstleraar in Breda en commandant van de illegale radiopost op de Vloeiweide. Op 4 oktober 1944 stierf hij bij de Duitse overval.',
      'informatie'
    ],
    [
      'De familie Neefs: onschuldige slachtoffers van het drama',
      'Redactie Vloeiweide Platform — op basis van historisch onderzoek',
      `Boswachter Ernest Neefs woonde met zijn gezin in het huis aan de Hellegatweg op het landgoed De Vloeiweide. Het was een idyllische plek — midden in de bossen, weg van het geweld van de bezetting. Of zo leek het.

Toen de Ordedienst in het begin van 1944 vroeg of de radiopost in het boswachtershuis ondergebracht mocht worden, stemde de familie Neefs in. Zij geloofden in het verzet. Zij wilden helpen.

Op 4 oktober 1944 betaalden zij daarvoor de hoogste prijs.

Bij de Duitse overval vatten het huis vlam. In de brand kwamen om het leven:
- Maria Neefs-Koijen (45 jaar), de moeder
- Maria Elisabeth Neefs (18 jaar), de oudste dochter
- Maria Francisca Neefs (17 jaar), de tweede dochter
- Cornelis Neefs (4 jaar), het jongste kind

Ernest Neefs overleefde als enige volwassene. Hij moest de rest van zijn leven leven met de wetenschap dat zijn huis, zijn keuze om mee te helpen aan het verzet, het leven had gekost van zijn vrouw en drie van zijn kinderen.

Het monument op de Vloeiweide staat op de fundamenten van het huis dat de familie Neefs bewoonde. Die bakstenen zijn niet alleen steen — het zijn overblijfselen van een leven, een gezin, een thuishaven die in vlammen opging.`,
      'De familie Neefs stelde hun boswachtershuis beschikbaar voor de illegale radiopost. Op 4 oktober 1944 kwamen vier gezinsleden om het leven bij de Duitse overval.',
      'nabestaande'
    ],
    [
      'De radiopost van de Ordedienst: hoe werkte het verzet?',
      'Redactie Vloeiweide Platform — op basis van historisch onderzoek',
      `In het voorjaar van 1944 richtte de Ordedienst (OD) — een illegale verzetsorganisatie — een radiopost in op de Vloeiweide bij Rijsbergen. De post maakte deel uit van district 16, met hoofdkwartier in Breda.

De radiopost had één doel: het doorzenden van versleutelde berichten in morsecode naar de Geallieerde strijdkrachten. Informatie over de ligging van Duitse troepen, munitiedepots en verdedigingswerken. Informatie die levens kon redden.

Het werk was gevaarlijk. De Duitsers beschikten over peilwagens die actief op zoek waren naar illegale zenders. Elke uitzending moest zo kort mogelijk zijn. De operators wisselden regelmatig van locatie, maar de Vloeiweide bleef een belangrijk knooppunt.

De bemanning van de post bestond uit:
- Paul Windhausen — commandant
- Henk Touw — radio-operator (31 jaar)
- Johan Oberg — radio-operator (37 jaar)
- Johannes de Vries — radio-operator (26 jaar)
- Marinus van den Boogaard — bewaker (22 jaar)

Na de zogenaamde "Dolle Dinsdag" (5 september 1944) leek de bevrijding zo nabij. Maar de geallieerde opmars stagneerde na de mislukte operatie Market Garden. De radiopost bleef actief — en daarmee ook het gevaar.

Op 4 oktober 1944 werd de post verraden door Lodewijk de Coster, een Belgische informant die voor de Duitsers werkte. De overval die volgde, kostte negen mensen het leven.`,
      'Een historisch overzicht van hoe de illegale radiopost van de Ordedienst op de Vloeiweide werkte, wie er bij betrokken waren en hoe het drama zich voltrok.',
      'informatie'
    ],
    [
      'De acht gefusileerden op de Schietheide',
      'Redactie Vloeiweide Platform — op basis van historisch onderzoek',
      `Op 5 oktober 1944, minder dan 24 uur na de overval op de Vloeiweide, werden acht verzetsmensen door een Duits executiepeloton doodgeschoten.

De executies vonden plaats op de Schietheide, een open plek in het Mastbos bij Ginneken (Breda), onder bevel van Oberleutnant Adolf Balhüff.

De namen van de acht gefusileerden:
Bakker · J.J. van den Boogaard · Brautigam · Van den Heuvel · Hofman · Nelissen · Visser · De Vries

Zij waren gearresteerd in de nasleep van de overval op de Vloeiweide, als leden of contacten van de Ordedienst. Zonder rechtszaak, zonder vonnis, werden zij de volgende ochtend al gefusilleerd.

Ook op de Schietheide staat een monument, als stille getuige van wat daar op die oktobermorgen plaatsvond.

Het waren de laatste oorlogsmaanden. De bevrijding van geheel Nederland zou nog maanden op zich laten wachten — tot mei 1945. Voor deze acht mannen was de oorlog voorbij voordat zij de vrijheid konden zien.`,
      'Op 5 oktober 1944 werden acht leden van de Ordedienst gefusilleerd op de Schietheide in het Mastbos bij Breda. Hun namen staan gegraveerd op het monument.',
      'informatie'
    ],
  ]) {
    await pool.query(
      'INSERT INTO verhalen (titel,auteur,inhoud,samenvatting,categorie) VALUES ($1,$2,$3,$4,$5)',
      [titel, auteur, inhoud, samenvatting, categorie]
    );
  }

  // --- LOCATIES: echte GPS-coördinaten ---
  for (const [naam, beschrijving, lat, lng, categorie] of [
    [
      'Monument De Vloeiweide',
      'Herdenkingsmonument op de plek van het voormalige boswachtershuis van de familie Neefs (Hellegatweg 6, Rijsbergen). Onthuld op 8 oktober 1994. Bestaat uit de bewaard gebleven fundering met een bakstenen gedenkmuur en natuurstenen plaquette. Tekst: "Deze grond waarop u staat is geheiligd door Nederlands bloed. Zij stierven voor u."',
      51.5445196251292,
      4.704576122814956,
      'monument'
    ],
    [
      'Locatie radiopost Vloeiweide (voormalig boswachtershuis)',
      'Op deze plek stond het boswachtershuis van Ernest Neefs, waar de illegale radiopost van de Ordedienst was gevestigd. Hier vond op 4 oktober 1944 de fatale Duitse overval plaats. Het huis brandde af; de fundering is bewaard gebleven als deel van het monument.',
      51.5445196251292,
      4.704576122814956,
      'drama'
    ],
    [
      'Sint Bavokerk Rijsbergen',
      'De Sint Bavokerk (ook: Sint Bavo-parochiekerk) in het centrum van Rijsbergen. Hier begint elk jaar de herdenkingsbijeenkomst om 10:30 uur, waarna de stille tocht vertrekt naar het monument op de Vloeiweide. In de kerk bevindt zich ook een herdenkingsraam gewijd aan het drama.',
      51.5167,
      4.6980,
      'kerk'
    ],
    [
      'Schietheide — executieplaats (Mastbos, Ginneken/Breda)',
      'Op de Schietheide in het Mastbos bij Ginneken werden op 5 oktober 1944 acht leden van de Ordedienst gefusilleerd door een Duits executiepeloton onder bevel van Oberleutnant Adolf Balhüff. Ook hier staat een herdenkingsmonument.',
      51.5524,
      4.7662,
      'drama'
    ],
    [
      'Startpunt stille tocht — hoek Hellegatweg/Sintelweg',
      'Elk jaar begint de stille tocht bij de herdenking van het Vloeiweidedrama op de hoek van de Hellegatweg en de Sintelweg. Van hieruit loopt de stoet naar het monument op de Vloeiweide, circa 200 meter verderop.',
      51.5438,
      4.7032,
      'herdenking'
    ],
  ]) {
    await pool.query(
      'INSERT INTO locaties (naam,beschrijving,lat,lng,categorie) VALUES ($1,$2,$3,$4,$5)',
      [naam, beschrijving, lat, lng, categorie]
    );
  }

  // --- PUBLICATIES: echte boeken en bronnen ---
  for (const [titel, type, auteur, beschrijving, jaar, koop_url] of [
    [
      'De Post in de Vloeiweide',
      'boek',
      'Joris van den Bergh',
      'Het vroegste en meest directe verslag van het drama op de Vloeiweide, geschreven nog in november 1944, kort na de gebeurtenissen. Van den Bergh was zelf betrokken bij het verzet en optekende de feiten terwijl de herinneringen nog vers waren. Een onmisbaar historisch document.',
      1944,
      null
    ],
    [
      'De geest van de Vloeiweide',
      'boek',
      'John van Ierland',
      'Een uitgebreide historische reconstructie van het drama op de Vloeiweide en zijn nasleep, gepubliceerd in 2004. Gebaseerd op archiefonderzoek en gesprekken met nabestaanden. Van Ierland beschrijft niet alleen de feiten van 4-5 oktober 1944, maar ook de bredere context van het verzet in de regio Breda en de Ordedienst.',
      2004,
      null
    ],
    [
      'Brabants oorlogsdrama',
      'boek',
      'Rinie Maas',
      'Rinie Maas plaatst het drama op de Vloeiweide in de bredere context van de Brabantse bevrijdingsstrijd in het najaar van 1944. Het boek beschrijft de hoop en wanhoop van de bezettingstijd, de rol van het verzet en de prijs die werd betaald voor de vrijheid.',
      2011,
      null
    ],
    [
      'De radiopost van de Ordedienst in Rijsbergen — achtergronden van het drama op de Vloeiweide',
      'artikel',
      'J.W.M. Schulten',
      'Wetenschappelijk artikel gepubliceerd in het Jaarboek De Oranjeboom, deel 57 (1994), pp. 71-86. Schulten analyseert de historische achtergronden van de Ordedienst-radiopost op de Vloeiweide en de omstandigheden die leidden tot de overval van 4 oktober 1944. Verscheen ter gelegenheid van de 50e herdenking.',
      1994,
      null
    ],
    [
      'Voorgrond, Achtergrond',
      'toneelstuk',
      'Toneelgroep Rijsbergen',
      'Toneelstuk met film in drie bedrijven, gebaseerd op het drama op de Vloeiweide. Opgevoerd door de lokale toneelgroep van Rijsbergen ter gelegenheid van een van de herdenkingsjaren.',
      null,
      null
    ],
  ]) {
    await pool.query(
      'INSERT INTO publicaties (titel,type,auteur,beschrijving,jaar,koop_url) VALUES ($1,$2,$3,$4,$5,$6)',
      [titel, type, auteur, beschrijving, jaar, koop_url]
    );
  }

  // --- HERDENKINGEN: echte herdenkingen ---
  for (const [titel, datum, beschrijving, locatie, jaarlijks] of [
    [
      'Jaarlijkse herdenking Vloeiweidedrama',
      'Eerste zondag na 4 oktober',
      'De jaarlijkse herdenkingsplechtigheid vindt plaats op de eerste zondag na 4 oktober — de dag van de overval in 1944. Programma: 10:30 uur herdenkingsdienst in de Sint Bavokerk te Rijsbergen · 12:00 uur stille tocht vanaf hoek Hellegatweg/Sintelweg · 12:15 uur plechtigheid bij het monument met bloemlegging en toespraken van de voorzitter van de Vloeiweide-stichting en de burgemeester van Zundert.',
      'Sint Bavokerk + Monument Vloeiweide, Hellegatweg 6, Rijsbergen',
      1
    ],
    [
      'Nationale Dodenherdenking — 4 mei',
      '4 mei',
      'Tijdens de jaarlijkse nationale Dodenherdenking wordt ook in Rijsbergen stilgestaan bij de slachtoffers van het Vloeiweidedrama. Op 4 mei worden in heel Nederland om 20:00 uur twee minuten stilte gehouden ter nagedachtenis aan alle gevallenen van de Tweede Wereldoorlog.',
      'Rijsbergen',
      1
    ],
    [
      'Bevrijdingsdag — 5 mei',
      '5 mei',
      'Op 5 mei viert Nederland elk jaar de bevrijding van de Duitse bezetting in 1945. In Rijsbergen wordt Bevrijdingsdag herdacht met aandacht voor de lokale geschiedenis en de zeventien slachtoffers van het Vloeiweidedrama, die de vrijheid niet meer hebben kunnen meemaken.',
      'Rijsbergen',
      1
    ],
    [
      'Herdenking 80 jaar Vloeiweidedrama — 6 oktober 2024',
      '6 oktober 2024',
      'Bijzondere lustrumherdenking ter gelegenheid van het 80-jarig herdenkingsjaar. Met tentoonstelling van schilderijen van Paul Windhausen in \'t Buytenhuis. Aanwezig: burgemeester Joyce Vermue van Zundert en vertegenwoordigers van de Vloeiweide-stichting. Scholieren van de Sint Bavo School namen deel aan de stille tocht.',
      'Sint Bavokerk + Monument Vloeiweide, Rijsbergen',
      0
    ],
  ]) {
    await pool.query(
      'INSERT INTO herdenkingen (titel,datum,beschrijving,locatie,jaarlijks) VALUES ($1,$2,$3,$4,$5)',
      [titel, datum, beschrijving, locatie, jaarlijks]
    );
  }

  // --- ONDERWIJS: educatieve materialen ---
  for (const [titel, type, beschrijving, doelgroep] of [
    [
      'Les: De radiopost op de Vloeiweide — wat is verzet?',
      'lesmateriaal',
      'Een lespakket (twee lessen) over de illegale radiopost van de Ordedienst op de Vloeiweide en de bredere vraag: wat drijft mensen tot verzet tegen een bezetting? Inclusief bronnenmateriaal over Paul Windhausen en de familie Neefs, werkbladen en discussievragen. Leerlingen leren morsecode lezen en begrijpen hoe gevaarlijk het werk van de radiooperators was.',
      'Groep 7-8 basisschool'
    ],
    [
      'Excursie naar het monument op de Vloeiweide',
      'activiteit',
      'Een begeleide excursie naar Hellegatweg 6 in Rijsbergen, waar het monument staat op de fundamenten van het boswachtershuis van de familie Neefs. Een gids vertelt het verhaal van 4-5 oktober 1944: de overval, de brand, de executies op de Schietheide. Leerlingen leggen zelf bloemen neer bij het monument en lezen de plaquette. Afsluiting met een reflectiegesprek: wat voel je als je op deze plek staat?',
      'Groep 6-8 basisschool en middelbare school klas 1-2'
    ],
    [
      'Oral History-project: nabestaanden van het Vloeiweidedrama interviewen',
      'project',
      'Een meersemesterproject waarbij leerlingen zelf in contact treden met nabestaanden, lokale historici of de Vloeiweide-stichting. Zij leren interviewtechnieken, doen archiefonderzoek bij het Stadsarchief Breda of het regionaal archief, en presenteren hun bevindingen in een tentoonstelling, podcast of artikel.',
      'Middelbare school klas 2-4 (havo/vwo)'
    ],
    [
      'Werkblad: Wie waren de zeventien slachtoffers?',
      'lesmateriaal',
      'Een onderzoeksopdracht waarbij leerlingen op basis van beschikbare bronnen (Wikipedia, Tracesofwar.nl, regionaal archief) de achtergrond reconstrueren van elk van de zeventien slachtoffers van het Vloeiweidedrama. Wie waren zij? Hoe oud waren zij? Wat deden zij voor de oorlog? Leerlingen leren dat achter elk naam een mens schuilt.',
      'Middelbare school klas 1-3'
    ],
    [
      'Scholierenherdenking op de Vloeiweide',
      'activiteit',
      'Elk jaar nemen leerlingen van de Sint Bavo School in Rijsbergen deel aan de herdenking op de Vloeiweide. Zij lopen mee in de stille tocht en leggen namens de school een krans neer bij het monument. De school heeft het monument symbolisch "onder haar hoede". Contact opnemen via de gemeente Zundert of de Vloeiweide-stichting om als school deel te nemen.',
      'Basisschool groep 6-8'
    ],
  ]) {
    await pool.query(
      'INSERT INTO onderwijs (titel,type,beschrijving,doelgroep) VALUES ($1,$2,$3,$4)',
      [titel, type, beschrijving, doelgroep]
    );
  }

  console.log('Voorbeelddata (historisch verantwoord) geladen.');
}

module.exports = { pool, init };
